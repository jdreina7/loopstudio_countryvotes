import { useState, useEffect, useRef } from 'react';
import { countriesApi } from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
import type { Country } from '../../types';
import { AUTOCOMPLETE_DEBOUNCE_MS, MIN_AUTOCOMPLETE_LENGTH } from '../../utils/constants';
import './CountryAutocomplete.css';

interface CountryAutocompleteProps {
  value: string;
  onChange: (countryName: string, countryCode: string, flag: string) => void;
  error?: string;
}

export const CountryAutocomplete = ({
  value,
  onChange,
  error,
}: CountryAutocompleteProps) => {
  const { t } = useLanguage();
  const [suggestions, setSuggestions] = useState<Country[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (value.length >= MIN_AUTOCOMPLETE_LENGTH) {
        // Cancel previous request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController();

        setIsLoading(true);
        setSelectedIndex(-1);

        try {
          const results = await countriesApi.searchCountries(
            value,
            abortControllerRef.current.signal
          );
          setSuggestions(results);
          setShowSuggestions(true);
        } catch (error) {
          // Ignore abort errors
          if (error instanceof Error && error.name !== 'AbortError') {
            console.error('Error fetching countries:', error);
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, AUTOCOMPLETE_DEBOUNCE_MS);
    return () => {
      clearTimeout(debounceTimer);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value, '', '');
  };

  const handleSuggestionClick = (country: Country) => {
    onChange(country.name, country.code, country.flag);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div className="autocomplete-wrapper" ref={wrapperRef}>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={t.voteForm.countryPlaceholder}
        className={`autocomplete-input ${error ? 'error' : ''}`}
        role="combobox"
        aria-expanded={showSuggestions}
        aria-autocomplete="list"
        aria-controls="suggestions-list"
        aria-activedescendant={
          selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined
        }
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul
          className="suggestions-list"
          role="listbox"
          id="suggestions-list"
        >
          {suggestions.map((country, index) => (
            <li
              key={country.code}
              id={`suggestion-${index}`}
              onClick={() => handleSuggestionClick(country)}
              className={`suggestion-item ${
                index === selectedIndex ? 'selected' : ''
              }`}
              role="option"
              aria-selected={index === selectedIndex}
            >
              <span>{country.name}</span>
              <span className="suggestion-region">
                {country.region}
              </span>
            </li>
          ))}
        </ul>
      )}
      {showSuggestions && value.length >= MIN_AUTOCOMPLETE_LENGTH && suggestions.length === 0 && !isLoading && (
        <ul className="suggestions-list">
          <li className="suggestion-item no-results">{t.autocomplete.noResults}</li>
        </ul>
      )}
    </div>
  );
};
