import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { VotesModule } from './votes/votes.module';
import { CountriesModule } from './countries/countries.module';
import { HealthModule } from './health/health.module';
import { StatisticsModule } from './statistics/statistics.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import {
  CACHE_DEFAULT_TTL_MS,
  THROTTLER_TTL_MS,
  THROTTLER_LIMIT,
} from './utils/constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/countryvote',
    ),
    CacheModule.register({
      isGlobal: true,
      ttl: CACHE_DEFAULT_TTL_MS, // 5 minutes cache
    }),
    ThrottlerModule.forRoot([
      {
        ttl: THROTTLER_TTL_MS, // 1 second
        limit: THROTTLER_LIMIT, // 5 requests per second
      },
    ]),
    CountriesModule,
    HealthModule,
    StatisticsModule,
    VotesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
