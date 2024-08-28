// Nest
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Env
import { envSchema } from './http/env/env';

// Modules
import { AuthModule } from './auth/auth.module';
import { HttpModule } from './http/http.module';
import { EnvModule } from './http/env/env.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    HttpModule,
    EnvModule,
  ],
})
export class AppModule {}
