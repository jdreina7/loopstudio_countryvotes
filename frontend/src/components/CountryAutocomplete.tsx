import { useState, useEffect, useRef } from 'react';
import { countriesApi } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import type { Country } from '../types';
import { AUTOCOMPLETE_DEBOUNCE_MS, MIN_AUTOCOMPLETE_LENGTH } from '../utils/constants';
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
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (value.length >= MIN_AUTOCOMPLETE_LENGTH) {
        setIsLoading(true);
        try {
          const results = await countriesApi.searchCountries(value);
          setSuggestions(results);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching countries:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, AUTOCOMPLETE_DEBOUNCE_MS);
    return () => clearTimeout(debounceTimer);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value, '', '');
  };

  const handleSuggestionClick = (country: Country) => {
    onChange(country.name, country.code, country.flag);
    setShowSuggestions(false);
  };

  return (
    <div className="autocomplete-wrapper" ref={wrapperRef}>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={t.voteForm.countryPlaceholder}
        className={`autocomplete-input ${error ? 'error' : ''}`}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((country) => (
            <li
              key={country.code}
              onClick={() => handleSuggestionClick(country)}
              className="suggestion-item"
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
