import { config } from 'dotenv';

import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { execSync } from 'node:child_process';
import { DomainEvents } from '@/core/events';

// Load environment variables from .env files
config({ path: '.env', override: true });
config({ path: '.env.test', override: true });

const prisma = new PrismaClient();
const schemaId = randomUUID();

function generateUniqueDatabaseURL(schemaId: string) {
  if (!schemaId) {
    throw new Error('schemaId is required');
  }

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }

  const url = new URL(process.env.DATABASE_URL);

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

  execSync('npx prisma migrate deploy');
});

afterAll(async () => {
  await dropSchema(schemaId);
});
