import { useQuery } from '@tanstack/react-query';
import { healthApi } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import './HealthStatus.css';

interface HealthDetail {
  status: string;
}

interface HealthResponse {
  status: string;
  info: {
    database?: HealthDetail;
    'rest-countries-api'?: HealthDetail;
  };
  error: Record<string, unknown>;
  details: {
    database?: HealthDetail;
    'rest-countries-api'?: HealthDetail;
  };
}

export const HealthStatus = () => {
  const { t } = useLanguage();

  const { data, isLoading, error } = useQuery<HealthResponse>({
    queryKey: ['health'],
    queryFn: healthApi.getHealth,
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 2,
  });

  if (isLoading) {
    return (
      <div className="health-status loading">
        <span className="health-icon">⏳</span>
        <span>{t.health.checking}</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="health-status error">
        <span className="health-icon">❌</span>
        <div className="health-details">
          <span className="health-title">{t.health.error}</span>
          <span className="health-subtitle">{t.health.cannotConnect}</span>
        </div>
      </div>
    );
  }

  const dbStatus = data.details?.database?.status || 'down';
  const apiStatus = data.details?.['rest-countries-api']?.status || 'down';
  const isHealthy = data.status === 'ok';

  return (
    <div className={`health-status ${isHealthy ? 'healthy' : 'unhealthy'}`}>
      <span className="health-icon">{isHealthy ? '✅' : '⚠️'}</span>
      <div className="health-details">
        <span className="health-title">{t.health.systemStatus}</span>
        <div className="health-services">
          <div className={`service-status ${dbStatus === 'up' ? 'up' : 'down'}`}>
            <span className="service-dot"></span>
            <span>{t.health.database}: {dbStatus === 'up' ? t.health.online : t.health.offline}</span>
          </div>
          <div className={`service-status ${apiStatus === 'up' ? 'up' : 'down'}`}>
            <span className="service-dot"></span>
            <span>{t.health.externalApi}: {apiStatus === 'up' ? t.health.online : t.health.offline}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
