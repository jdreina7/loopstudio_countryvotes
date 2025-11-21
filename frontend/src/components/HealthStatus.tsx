import { useQuery } from '@tanstack/react-query';
import { healthApi } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import {
  QUERY_KEY_HEALTH,
  HEALTH_CHECK_REFETCH_MS,
  HEALTH_CHECK_RETRY_COUNT,
  HEALTH_STATUS_OK,
  SERVICE_STATUS_UP,
} from '../utils/constants';
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
    queryKey: [QUERY_KEY_HEALTH],
    queryFn: healthApi.getHealth,
    refetchInterval: HEALTH_CHECK_REFETCH_MS,
    retry: HEALTH_CHECK_RETRY_COUNT,
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

  const dbStatus = data.details?.database?.status || SERVICE_STATUS_UP;
  const apiStatus = data.details?.['rest-countries-api']?.status || SERVICE_STATUS_UP;
  const isHealthy = data.status === HEALTH_STATUS_OK;

  return (
    <div className={`health-status ${isHealthy ? 'healthy' : 'unhealthy'}`}>
      <span className="health-icon">{isHealthy ? '✅' : '⚠️'}</span>
      <div className="health-details">
        <span className="health-title">{t.health.systemStatus}</span>
        <div className="health-services">
          <div className={`service-status ${dbStatus === SERVICE_STATUS_UP ? 'up' : 'down'}`}>
            <span className="service-dot"></span>
            <span>{t.health.database}: {dbStatus === SERVICE_STATUS_UP ? t.health.online : t.health.offline}</span>
          </div>
          <div className={`service-status ${apiStatus === SERVICE_STATUS_UP ? 'up' : 'down'}`}>
            <span className="service-dot"></span>
            <span>{t.health.externalApi}: {apiStatus === SERVICE_STATUS_UP ? t.health.online : t.health.offline}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
