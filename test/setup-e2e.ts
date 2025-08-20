import { config } from 'dotenv';

import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { execSync } from 'node:child_process';
import { DomainEvents } from '@/core/events';
import { Redis } from 'ioredis';
import { envSchema } from '@/infra/http/env/env';

// Load environment variables from .env files
config({ path: '.env', override: true });
config({ path: '.env.test', override: true });

const env = envSchema.parse(process.env);

const prisma = new PrismaClient();
const schemaId = randomUUID();

const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  db: env.REDIS_DB,
});

function generateUniqueDatabaseURL(schemaId: string) {
  if (!schemaId) {
    throw new Error('schemaId is required');
  }

  if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }

  const url = new URL(env.DATABASE_URL);

  url.searchParams.set('schema', schemaId);

  return url.toString();
}

async function dropSchema(schema: string) {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);

  await prisma.$disconnect();
}

beforeAll(async () => {
  const databaseURL = generateUniqueDatabaseURL(schemaId);

  process.env.DATABASE_URL = databaseURL;

  DomainEvents.shouldRun = false;

  await redis.flushdb();

  execSync('npx prisma migrate deploy');
});

afterAll(async () => {
  await dropSchema(schemaId);
});
