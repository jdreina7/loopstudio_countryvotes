import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  MongooseHealthIndicator,
  HttpHealthIndicator,
} from '@nestjs/terminus';

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
      '/all?fields=name';

    return this.health.check([
      () => this.db.pingCheck('database', { timeout: 300 }),
      () =>
        this.http.pingCheck('rest-countries-api', restCountriesUrl, {
          timeout: 3000,
        }),
    ]);
  }
}
