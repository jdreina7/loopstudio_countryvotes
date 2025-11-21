import { useQuery } from '@tanstack/react-query';
import { statisticsApi } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { QUERY_KEY_STATISTICS, STATS_REFETCH_INTERVAL_MS } from '../utils/constants';
import './StatsCards.css';

export const StatsCards = () => {
  const { t } = useLanguage();

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEY_STATISTICS],
    queryFn: statisticsApi.getStatistics,
    refetchInterval: STATS_REFETCH_INTERVAL_MS,
  });

  if (isLoading) {
    return (
      <div className="stats-grid">
        <div className="stat-card loading">
          <div className="stat-value">-</div>
          <div className="stat-label">{t.charts.totalVotes}</div>
        </div>
        <div className="stat-card loading">
          <div className="stat-value">-</div>
          <div className="stat-label">{t.charts.uniqueCountries}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon">📊</div>
        <div className="stat-value">{data?.totalVotes || 0}</div>
        <div className="stat-label">{t.charts.totalVotes}</div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">🌍</div>
        <div className="stat-value">{data?.uniqueCountries || 0}</div>
        <div className="stat-label">{t.charts.uniqueCountries}</div>
      </div>
    </div>
  );
};
