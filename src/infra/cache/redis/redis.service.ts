import { EnvService } from '@/infra/http/env/env.service';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  constructor(private envService: EnvService) {
    super({
      host: envService.get('REDIS_HOST'),
      port: Number(envService.get('REDIS_PORT')),
      db: Number(envService.get('REDIS_DB')),
    });
  }

  onModuleDestroy() {
    return this.disconnect();
  }
}
