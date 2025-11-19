import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from '../../../src/health/health.controller';
import { HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus';

describe('HealthController', () => {
  let controller: HealthController;
  let health: jest.Mocked<HealthCheckService>;

  beforeEach(async () => {
    const mockHealthCheckService = {
      check: jest.fn().mockResolvedValue({
        status: 'ok',
        info: {
          database: {
            status: 'up',
          },
        },
        error: {},
        details: {
          database: {
            status: 'up',
          },
        },
      }),
    };

    const mockMongooseHealthIndicator = {
      pingCheck: jest.fn().mockResolvedValue({
        database: {
          status: 'up',
        },
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: mockHealthCheckService,
        },
        {
          provide: MongooseHealthIndicator,
          useValue: mockMongooseHealthIndicator,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    health = module.get<HealthCheckService>(
      HealthCheckService,
    ) as unknown as jest.Mocked<HealthCheckService>;
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Health Check Unit Testing', () => {
    it('1- Should return health status', async () => {
      const result = await controller.check();

      // Inspect mock calls directly to avoid unbound-method linter issues
      expect(health.check.mock.calls.length).toBeGreaterThan(0);
      expect(result).toEqual({
        status: 'ok',
        info: {
          database: {
            status: 'up',
          },
        },
        error: {},
        details: {
          database: {
            status: 'up',
          },
        },
      });
    });

    it('2- Should check database with correct parameters', async () => {
      await controller.check();

      // Inspect the first call's first argument (the health checks array)
      const firstCallArg = health.check.mock.calls[0][0];
      expect(firstCallArg).toEqual(
        expect.arrayContaining([expect.any(Function)]),
      );
    });
  });
});
