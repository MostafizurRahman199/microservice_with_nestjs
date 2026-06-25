import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';

import { RedisService } from '../redis/redis.service';

@Injectable()
export class RateLimitGuard implements CanActivate {

  // Inject RedisService so we can access Redis commands
  constructor(
    private readonly redisService: RedisService,
  ) {}

  /**
   * This method runs before the controller handler.
   * If it returns true, the request continues.
   * If it throws an exception or returns false,
   * the request is blocked.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {

    // Get the incoming HTTP request object
    const request = context.switchToHttp().getRequest();

    // Extract client's IP address
    // If IP is unavailable, use 'unknown'
    const ip = request.ip || 'unknown';

    /**
     * Create a unique Redis key for this IP.
     *
     * Example:
     * rate_limit:192.168.1.10
     * rate_limit:127.0.0.1
     */
    const key = `rate_limit:${ip}`;

    /**
     * Increment request count in Redis.
     *
     * Redis INCR command:
     *
     * First request:
     * rate_limit:127.0.0.1 = 1
     *
     * Second request:
     * rate_limit:127.0.0.1 = 2
     *
     * Third request:
     * rate_limit:127.0.0.1 = 3
     */
    const currentRequest =
      await this.redisService.client.incr(key);

    /**
     * If this is the first request,
     * set expiration time to 60 seconds.
     *
     * Why?
     * Otherwise Redis would keep the key forever.
     *
     * Example:
     * rate_limit:127.0.0.1 = 1
     * TTL = 60 seconds
     *
     * After 60 seconds,
     * Redis automatically deletes the key.
     */
    if (currentRequest === 1) {
      await this.redisService.client.expire(key, 60);
    }

    /**
     * Allow only 5 requests within 60 seconds.
     *
     * Request counts:
     * 1 -> allowed
     * 2 -> allowed
     * 3 -> allowed
     * 4 -> allowed
     * 5 -> allowed
     * 6 -> blocked
     * 7 -> blocked
     * ...
     */
    if (currentRequest > 5) {

      // Throw an HTTP 400 error
      throw new BadRequestException(
        `Too many requests from ${ip}. Try again later.`,
      );
    }

    // Request is allowed
    return true;
  }
}