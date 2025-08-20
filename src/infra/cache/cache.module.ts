import { Module } from '@nestjs/common';
import { EnvModule } from '../http/env/env.module';
import { EnvService } from '../http/env/env.service';

@Module({
  imports: [EnvModule],
  providers: [EnvService],
})
export class CacheModule {}
