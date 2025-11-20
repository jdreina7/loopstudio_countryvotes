import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { votesApi } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import './VotesBarChart.css';

export const VotesBarChart = () => {
  const { t } = useLanguage();

  const { data, isLoading, error } = useQuery({
    queryKey: ['topCountriesChart'],
    queryFn: () => votesApi.getTopCountries(10),
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="chart-container">
        <h3 className="chart-title">{t.charts.topCountriesTitle}</h3>
        <div className="chart-loading">{t.countriesTable.loading}</div>
      </div>
    );
  }

  if (error || !data || data.length === 0) {
    return (
      <div className="chart-container">
        <h3 className="chart-title">{t.charts.topCountriesTitle}</h3>
        <div className="chart-empty">{t.countriesTable.noVotes}</div>
      </div>
    );
  }

  const chartData = data.map((country) => ({
    name: country.name.length > 15 ? country.name.substring(0, 15) + '...' : country.name,
    fullName: country.name,
    votes: country.voteCount || 0,
  }));

  return (
    <div className="chart-container">
      <h3 className="chart-title">{t.charts.topCountriesTitle}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
          />
          <YAxis tick={{ fill: 'var(--text-secondary)' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
            }}
            labelFormatter={(value, payload) => {
              if (payload && payload.length > 0) {
                return payload[0].payload.fullName;
              }
              return value;
            }}
          />
          <Legend />
          <Bar dataKey="votes" fill="#3b82f6" name={t.countriesTable.votes} radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
