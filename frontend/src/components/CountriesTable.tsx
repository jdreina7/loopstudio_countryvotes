import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { votesApi } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { SearchInput } from './SearchInput';
import {
  QUERY_KEY_TOP_COUNTRIES,
  REFETCH_INTERVAL_MS,
  TOP_COUNTRIES_PAGE_SIZE,
  FLAG_IMAGE_WIDTH,
} from '../utils/constants';
import './CountriesTable.css';

interface CountriesTableProps {
  refreshTrigger?: number;
}

export const CountriesTable = ({ refreshTrigger }: CountriesTableProps) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: countries = [], isLoading } = useQuery({
    queryKey: [QUERY_KEY_TOP_COUNTRIES, refreshTrigger],
    queryFn: () => votesApi.getTopCountries(TOP_COUNTRIES_PAGE_SIZE),
    refetchInterval: REFETCH_INTERVAL_MS,
  });

  const filteredCountries = useMemo(() => {
    if (!searchTerm) return countries;
    const term = searchTerm.toLowerCase();
    return countries.filter(
      (country) =>
        country.name.toLowerCase().includes(term) ||
        country.capital.toLowerCase().includes(term) ||
        country.region.toLowerCase().includes(term) ||
        country.subregion.toLowerCase().includes(term),
    );
  }, [searchTerm, countries]);

  return (
    <div>
        <h1 className="table-title">{t.countriesTable.title}</h1>

        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder={t.countriesTable.searchPlaceholder}
        />
      <div className="countries-table-container">

        {isLoading ? (
          <div className="loading">{t.countriesTable.loading}</div>
        ) : (
          <div className="table-wrapper">
            <table className="countries-table">
              <thead>
                <tr>
                  <th>{t.countriesTable.country}</th>
                  <th>{t.countriesTable.flag}</th>
                  <th>{t.countriesTable.capital}</th>
                  <th>{t.countriesTable.region}</th>
                  <th>{t.countriesTable.subregion}</th>
                  <th>{t.countriesTable.votes}</th>
                </tr>
              </thead>
              <tbody>
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <tr key={country.code}>
                      <td>{country.name}</td>
                      <td><img src={country.flag} alt={country.officialName} width={FLAG_IMAGE_WIDTH} /></td>
                      <td>{country.capital}</td>
                      <td>{country.region}</td>
                      <td>{country.subregion}</td>
                      <td className="votes-cell">{country.voteCount || 0}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="no-results">
                      {searchTerm
                        ? t.countriesTable.noResults
                        : t.countriesTable.noVotes}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
