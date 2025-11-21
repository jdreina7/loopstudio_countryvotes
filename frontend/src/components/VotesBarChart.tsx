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
import {
  QUERY_KEY_TOP_COUNTRIES_CHART,
  CHART_REFETCH_INTERVAL_MS,
  TOP_COUNTRIES_PAGE_SIZE,
  MAX_COUNTRY_NAME_DISPLAY_LENGTH,
  BAR_CHART_HEIGHT,
  BAR_CHART_MARGIN,
  BAR_CHART_X_AXIS_ANGLE,
  BAR_CHART_X_AXIS_HEIGHT,
  BAR_CHART_COLOR,
  BAR_BORDER_RADIUS,
} from '../utils/constants';
import './VotesBarChart.css';

export const VotesBarChart = () => {
  const { t } = useLanguage();

  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEY_TOP_COUNTRIES_CHART],
    queryFn: () => votesApi.getTopCountries(TOP_COUNTRIES_PAGE_SIZE),
    refetchInterval: CHART_REFETCH_INTERVAL_MS,
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
    name: country.name.length > MAX_COUNTRY_NAME_DISPLAY_LENGTH ? country.name.substring(0, MAX_COUNTRY_NAME_DISPLAY_LENGTH) + '...' : country.name,
    fullName: country.name,
    votes: country.voteCount || 0,
  }));

  return (
    <div className="chart-container">
      <h3 className="chart-title">{t.charts.topCountriesTitle}</h3>
      <ResponsiveContainer width="100%" height={BAR_CHART_HEIGHT}>
        <BarChart data={chartData} margin={BAR_CHART_MARGIN}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis
            dataKey="name"
            angle={BAR_CHART_X_AXIS_ANGLE}
            textAnchor="end"
            height={BAR_CHART_X_AXIS_HEIGHT}
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
          <Bar dataKey="votes" fill={BAR_CHART_COLOR} name={t.countriesTable.votes} radius={BAR_BORDER_RADIUS} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
