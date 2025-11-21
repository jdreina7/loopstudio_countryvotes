import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  MongooseHealthIndicator,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import {
  REST_COUNTRIES_ENDPOINT_HEALTH_CHECK,
  HEALTH_CHECK_DB_TIMEOUT_MS,
  HEALTH_CHECK_API_TIMEOUT_MS,
} from '../utils/constants';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: MongooseHealthIndicator,
    private http: HttpHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({
    summary: 'Health check endpoint',
    description:
      'Returns the health status of the database and external REST Countries API',
  })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
    schema: {
      example: {
        status: 'ok',
        info: {
          database: { status: 'up' },
          'rest-countries-api': { status: 'up' },
        },
        error: {},
        details: {
          database: { status: 'up' },
          'rest-countries-api': { status: 'up' },
        },
      },
    },
  })
  @ApiResponse({ status: 503, description: 'Service is unhealthy' })
  check() {
    const restCountriesUrl =
      (process.env.REST_COUNTRIES_API || 'https://restcountries.com/v3.1') +
      REST_COUNTRIES_ENDPOINT_HEALTH_CHECK;

    return this.health.check([
      () =>
        this.db.pingCheck('database', { timeout: HEALTH_CHECK_DB_TIMEOUT_MS }),
      () =>
        this.http.pingCheck('rest-countries-api', restCountriesUrl, {
          timeout: HEALTH_CHECK_API_TIMEOUT_MS,
        }),
    ]);
  }
}
