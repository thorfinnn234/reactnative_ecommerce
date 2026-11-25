import { defineConfig } from 'prisma/config';

// Prisma 7 no longer auto-loads .env. Node's built-in loader avoids a dotenv dependency.
// Wrapped in try/catch so `prisma generate` still works when there is no .env (e.g. in CI).
try {
  process.loadEnvFile();
} catch {
  // no .env file — rely on the real environment
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // `?? ''` instead of env(): env() throws when unset, which would break `prisma generate`.
    url: process.env.DATABASE_URL ?? '',
  },
});
