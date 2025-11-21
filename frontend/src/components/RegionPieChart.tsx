import { useQuery } from '@tanstack/react-query';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import type { PieLabelRenderProps } from 'recharts';
import { statisticsApi } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import {
  QUERY_KEY_VOTES_BY_REGION,
  REGION_CHART_REFETCH_MS,
  PIE_CHART_HEIGHT,
  PIE_CHART_OUTER_RADIUS,
  CHART_COLORS,
} from '../utils/constants';
import './VotesBarChart.css';

export const RegionPieChart = () => {
  const { t } = useLanguage();

  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEY_VOTES_BY_REGION],
    queryFn: statisticsApi.getVotesByRegion,
    refetchInterval: REGION_CHART_REFETCH_MS,
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
      <ResponsiveContainer width="100%" height={PIE_CHART_HEIGHT}>
        <PieChart>
          <Pie
            data={data}
            dataKey="votes"
            nameKey="region"
            cx="50%"
            cy="50%"
            outerRadius={PIE_CHART_OUTER_RADIUS}
            label={(props: PieLabelRenderProps) =>
              `${props.name || ''} ${props.percent ? (props.percent * 100).toFixed(0) : 0}%`
            }
            labelLine={{ stroke: 'var(--text-secondary)' }}
          >
            {data.map((_entry: unknown, index: number) => (
              <Cell
                key={`cell-${index}`}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
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
