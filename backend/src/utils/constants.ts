/**
 * Application-wide constants
 * Central location for all hardcoded values to improve maintainability
 */

// ==================== CACHE CONFIGURATION ====================
export const CACHE_DEFAULT_TTL_MS = 300000; // 5 minutes
export const CACHE_TOP_COUNTRIES_TTL_MS = 300000; // 5 minutes
export const CACHE_COUNTRIES_TTL_MS = 3600000; // 1 hour

// ==================== CACHE KEYS ====================
export const CACHE_KEY_TOP_COUNTRIES = 'top_countries';
export const CACHE_KEY_ALL_COUNTRIES = 'all_countries';
export const CACHE_KEY_COUNTRY_PREFIX = 'country_';

// ==================== THROTTLER CONFIGURATION ====================
export const THROTTLER_TTL_MS = 1000; // 1 second
export const THROTTLER_LIMIT = 5; // 5 requests per second

// ==================== API VERSIONING ====================
export const API_DEFAULT_VERSION = '1';
export const API_VERSION_PREFIX = 'api/v';
export const SWAGGER_API_VERSION = '1.0';
export const SWAGGER_DOCS_PATH = 'api/docs';

// ==================== REST COUNTRIES API ENDPOINTS ====================
export const REST_COUNTRIES_ENDPOINT_ALL =
  'all?fields=name,ccn3,cca2,cca3,capital,region,subregion,flags';
export const REST_COUNTRIES_ENDPOINT_ALPHA_PREFIX = '/alpha/';
export const REST_COUNTRIES_ENDPOINT_HEALTH_CHECK = '/all?fields=name';

// ==================== VALIDATION RULES ====================
export const VOTE_NAME_MIN_LENGTH = 2;
export const VOTE_NAME_MAX_LENGTH = 100;
export const COUNTRY_CODE_LENGTH = 3;
export const COUNTRY_NAME_MIN_LENGTH = 2;
export const SEARCH_QUERY_MIN_LENGTH = 2;

// ==================== DEFAULT VALUES ====================
export const DEFAULT_TOP_COUNTRIES_LIMIT = 10;
export const TOP_COUNTRIES_FETCH_MULTIPLIER = 2; // Fetch extra countries to compensate for API failures
export const DEFAULT_CAPITAL = 'N/A';
export const DEFAULT_SUBREGION = 'N/A';

// ==================== HEALTH CHECK TIMEOUTS ====================
export const HEALTH_CHECK_DB_TIMEOUT_MS = 300;
export const HEALTH_CHECK_API_TIMEOUT_MS = 3000;

// ==================== DATABASE FIELD NAMES ====================
export const VOTE_FIELD_COUNTRY_CODE = 'countryCode';
export const VOTE_FIELD_COUNTRY_NAME = 'countryName';
export const VOTE_FIELD_CREATED_AT = 'createdAt';

// ==================== DATABASE ERROR CODES ====================
export const MONGODB_DUPLICATE_KEY_ERROR_CODE = 11000;

// ==================== DATE/TIME UTILITIES ====================
export const ISO_DATE_SEPARATOR = 'T';
export const ISO_DATE_PART_INDEX = 0;

// ==================== HTTP STATUS CODES ====================
export const HTTP_STATUS_CREATED = 201;
export const HTTP_STATUS_CONFLICT = 409;
export const HTTP_STATUS_BAD_REQUEST = 400;
export const HTTP_STATUS_NOT_FOUND = 404;
export const HTTP_STATUS_SERVICE_UNAVAILABLE = 503;

// ==================== ERROR MESSAGES ====================
export const SEARCH_QUERY_LENGTH_ERROR_MSG =
  'Query must be at least 2 characters long';
export const COUNTRY_NOT_FOUND_ERROR_MSG = 'Country not found';
export const VOTE_SUCCESS_MESSAGE = 'Vote registered successfully';
