import { useQuery } from '@tanstack/react-query';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { statisticsApi } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import './VotesBarChart.css';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const RegionPieChart = () => {
  const { t } = useLanguage();

  const { data, isLoading, error } = useQuery({
    queryKey: ['votesByRegion'],
    queryFn: statisticsApi.getVotesByRegion,
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="chart-container">
        <h3 className="chart-title">{t.charts.regionDistribution}</h3>
        <div className="chart-loading">{t.countriesTable.loading}</div>
      </div>
    );
  }

  if (error || !data || data.length === 0) {
    return (
      <div className="chart-container">
        <h3 className="chart-title">{t.charts.regionDistribution}</h3>
        <div className="chart-empty">{t.countriesTable.noVotes}</div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3 className="chart-title">{t.charts.regionDistribution}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            dataKey="votes"
            nameKey="region"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={{ stroke: 'var(--text-secondary)' }}
          >
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
