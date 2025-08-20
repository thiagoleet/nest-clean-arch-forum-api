import { Injectable } from '@nestjs/common';
import { CacheRepository } from '../cache-repository';
import { RedisService } from './redis.service';

const FIFTEEN_MINUTES_IN_SECONDS = 15 * 60;

@Injectable()
export class RedisCacheRepository implements CacheRepository {
  constructor(private redis: RedisService) {}

  async set(key: string, value: string): Promise<void> {
    await this.redis.set(key, value, 'EX', FIFTEEN_MINUTES_IN_SECONDS);
  }

  async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
