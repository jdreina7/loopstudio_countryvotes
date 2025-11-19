export const MESSAGES = {
  // Vote messages
  VOTE: {
    ALREADY_VOTED:
      'This email has already voted. Only one vote per email is allowed.',
    CREATED: (countryName: string) =>
      `New vote created for country: ${countryName}`,
    ERROR_CREATING: 'Error creating vote',
  },

  // Country messages
  COUNTRY: {
    CACHED: 'Returning cached countries',
    FETCHING_API: 'Fetching countries from API',
    ERROR_FETCHING: 'Error fetching countries',
    ERROR_BY_CODE: (code: string) => `Error fetching country by code ${code}`,
    FAILED_FETCH: 'Failed to fetch countries',
    CACHED_TOP: 'Returning cached top countries',
    ERROR_TOP: 'Error getting top countries',
  },

  // Environment and configuration
  ENV: {
    REST_API_MISSING: 'REST_COUNTRIES_API environment variable is not set',
    REST_API_REQUIRED: 'REST_COUNTRIES_API environment variable is required',
    REST_API_SET_ENV: 'Please set REST_COUNTRIES_API in your .env file',
  },

  // Application startup
  APP: {
    RUNNING: (port: number | string) =>
      `🚀 Application is running on: http://localhost:${port}`,
    SWAGGER_DOCS: (port: number | string) =>
      `📚 Swagger documentation: http://localhost:${port}/api/docs`,
    HEALTH_CHECK: (port: number | string) =>
      `💚 Health check: http://localhost:${port}/api/v1/health`,
    REST_API_CONFIG: (apiUrl: string) => `✅ REST_COUNTRIES_API: ${apiUrl}`,
    ERROR_PREFIX: '❌ ERROR:',
  },
} as const;
