import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { RateLimitGuard } from '../guards/rate-limit.guard';
import { RedisService } from '../redis/redis.service';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, RedisService, RateLimitGuard],
})
export class AppModule {}
