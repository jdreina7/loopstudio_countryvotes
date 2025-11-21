/**
 * Application-wide constants
 * Central location for all hardcoded values to improve maintainability
 */

// ==================== TIMING & INTERVALS ====================
export const MESSAGE_DISPLAY_DURATION_MS = 5000; // 5 seconds
export const REFETCH_INTERVAL_MS = 30000; // 30 seconds
export const HEALTH_CHECK_REFETCH_MS = 30000; // 30 seconds
export const CHART_REFETCH_INTERVAL_MS = 30000; // 30 seconds
export const REGION_CHART_REFETCH_MS = 30000; // 30 seconds
export const STATS_REFETCH_INTERVAL_MS = 30000; // 30 seconds
export const AUTOCOMPLETE_DEBOUNCE_MS = 300; // 300ms

// ==================== API ENDPOINTS ====================
export const COUNTRIES_SEARCH_ENDPOINT = '/api/v1/countries/search';
export const COUNTRIES_ENDPOINT = '/api/v1/countries';
export const VOTES_ENDPOINT = '/api/v1/votes';
export const VOTES_TOP_ENDPOINT = '/api/v1/votes/top';
export const VOTES_CHECK_ENDPOINT = '/api/v1/votes/check';
export const HEALTH_ENDPOINT = '/api/v1/health';
export const STATISTICS_ENDPOINT = '/api/v1/statistics';
export const STATISTICS_REGIONS_ENDPOINT = '/api/v1/statistics/regions';
export const STATISTICS_TIMELINE_ENDPOINT = '/api/v1/statistics/timeline';

// ==================== VALIDATION VALUES ====================
export const MIN_SEARCH_QUERY_LENGTH = 2;
export const MIN_AUTOCOMPLETE_LENGTH = 2;

// ==================== REACT QUERY KEYS ====================
export const QUERY_KEY_TOP_COUNTRIES = 'topCountries';
export const QUERY_KEY_TOP_COUNTRIES_CHART = 'topCountriesChart';
export const QUERY_KEY_HEALTH = 'health';
export const QUERY_KEY_VOTES_BY_REGION = 'votesByRegion';
export const QUERY_KEY_STATISTICS = 'statistics';

// ==================== LOCAL STORAGE KEYS ====================
export const STORAGE_KEY_THEME = 'theme';
export const STORAGE_KEY_LANGUAGE = 'language';

// ==================== DOM ATTRIBUTES ====================
export const DOM_ATTR_THEME = 'data-theme';

// ==================== COLORS ====================
export const CHART_COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#a5d8ff',
  '#b2f2bb',
  '#ffe3a3',
  '#ffc9c9',
];
export const BAR_CHART_COLOR = '#3b82f6';
export const SUCCESS_COLOR = '#28a745';
export const ERROR_COLOR = '#dc3545';

// ==================== UI DIMENSIONS & SPACING ====================
export const FLAG_IMAGE_WIDTH = 30;
export const BAR_CHART_HEIGHT = 400;
export const BAR_CHART_MARGIN = { top: 20, right: 30, left: 20, bottom: 60 };
export const BAR_CHART_X_AXIS_ANGLE = -45;
export const BAR_CHART_X_AXIS_HEIGHT = 100;
export const BAR_BORDER_RADIUS: [number, number, number, number] = [8, 8, 0, 0];
export const PIE_CHART_HEIGHT = 400;
export const PIE_CHART_OUTER_RADIUS = 120;

// ==================== STATUS VALUES ====================
export const HEALTH_STATUS_OK = 'ok';
export const SERVICE_STATUS_DOWN = 'down';
export const SERVICE_STATUS_UP = 'up';

// ==================== HTTP STATUS CODES ====================
export const HTTP_STATUS_CONFLICT = 409;

// ==================== ERROR MESSAGES ====================
export const ERROR_DUPLICATE_VOTE_KEY = 'already voted';

// ==================== LIMITS & DEFAULTS ====================
export const DEFAULT_TOP_COUNTRIES_LIMIT = 10;
export const TOP_COUNTRIES_PAGE_SIZE = 10;
export const MAX_COUNTRY_NAME_DISPLAY_LENGTH = 15;

// ==================== RETRY CONFIG ====================
export const HEALTH_CHECK_RETRY_COUNT = 2;
