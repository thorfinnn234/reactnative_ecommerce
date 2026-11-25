import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../generated/prisma/client.ts';

// Prisma 7 talks to Postgres through a driver adapter (node-postgres here).
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set. Copy apps/api/.env.example to apps/api/.env.');
}

export const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
