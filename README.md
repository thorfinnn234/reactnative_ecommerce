# Ecom — full-stack ecommerce (learning project)

pnpm monorepo containing a React Native (Expo) shopping app, a React admin panel, and an Express API backed by PostgreSQL.

| Path              | What                                    | Stack                                                   |
| ----------------- | --------------------------------------- | ------------------------------------------------------- |
| `apps/mobile`     | Customer app                            | Expo SDK 58, Expo Router, NativeWind v4 (Tailwind v3)   |
| `apps/admin`      | Admin panel                             | React 19, Vite 8, Tailwind v4                           |
| `apps/api`        | REST API                                | Node 22, Express 5, TypeScript, zod, Prisma, PostgreSQL |
| `packages/shared` | Types + zod schemas shared by all three | TypeScript                                              |

## Prerequisites

- Node.js **22.12+**
- pnpm **12** (`corepack enable` or `npm i -g pnpm`)
- Docker Desktop (for local Postgres)
- For the mobile app: Expo Go or a development build on a device/emulator

## Setup

```bash
pnpm install

# Environment files (no real secrets are committed — fill in your own)
cp apps/api/.env.example apps/api/.env
cp apps/admin/.env.example apps/admin/.env
cp apps/mobile/.env.example apps/mobile/.env

# Start Postgres (postgres:17, user/password/db = ecom/ecom on localhost:5432)
pnpm db:up

# Apply migrations and load sample data (5 categories, 20 products)
pnpm db:migrate
pnpm db:seed
```

## Database (Prisma 7)

Prisma lives in `apps/api`. Run commands from the repo root:

```bash
pnpm db:migrate              # create/apply migrations (prisma migrate dev)
pnpm db:seed                 # idempotent seed (safe to re-run)
pnpm db:studio               # browse data in Prisma Studio
pnpm db:reset                # drop + re-apply all migrations (then run db:seed — v7 no longer auto-seeds)
pnpm prisma <any args>       # raw Prisma CLI, e.g. `pnpm prisma migrate dev --name add_x`
```

- **Money is always an `Int` in kobo** (₦1 = 100 kobo). Format to naira only for display.
- **CHECK constraints** (`stock >= 0`, quantities `> 0`, amounts non-negative) can't be written
  in `schema.prisma`, so they're hand-added SQL at the bottom of the `init` migration. If you
  create a migration that recreates those tables, re-add them.
- The generated client goes to `apps/api/src/generated/prisma` (git-ignored). It is regenerated
  on `pnpm install`, or manually with `pnpm --filter @ecom/api db:generate`.
- Prisma 7 doesn't auto-load `.env`; `prisma.config.ts` loads it with Node's built-in
  `process.loadEnvFile()`.

## Running

```bash
pnpm dev          # api + admin + mobile together
pnpm dev:api      # http://localhost:4100   (GET /health)
pnpm dev:admin    # http://localhost:5180   (/api/* is proxied to the API)
pnpm dev:mobile   # Expo dev server — scan the QR code with Expo Go
```

Ports are deliberately non-default (4100, 5180) to avoid clashing with other local projects.
If port 8081 is taken, run `pnpm --filter @ecom/mobile exec expo start --port 8095`.

**Phone → API:** `localhost` on a phone is the phone itself. Set `EXPO_PUBLIC_API_URL` in
`apps/mobile/.env` to your computer's LAN IP (e.g. `http://192.168.1.10:4100`), or
`http://10.0.2.2:4100` for the Android emulator.

## Quality checks

```bash
pnpm lint         # ESLint (flat config at repo root)
pnpm typecheck    # tsc --noEmit in every workspace (strict mode everywhere)
pnpm format       # Prettier
pnpm build        # shared → dist, api → dist, admin → dist, mobile → expo export
```

## How the monorepo fits together

- **Metro**: since SDK 52 Expo detects monorepos automatically, so `apps/mobile/metro.config.js`
  only adds NativeWind and the shared-package condition below.
- **`@ecom/shared` without a watch build**: its `package.json` `exports` has a custom
  `@ecom/source` condition pointing at `src/index.ts`. Metro, Vite, tsx (API dev) and TypeScript
  are configured to use that condition, so they read the TypeScript source directly. Only the
  production API build (`node dist/index.js`) uses the compiled `dist/` output.
- **Shared imports use `.ts` extensions** (`./constants.ts`); `rewriteRelativeImportExtensions`
  turns them into `.js` at build time so the output runs on plain Node ESM.
- **pnpm build scripts** are blocked by default; allowed packages are listed under `allowBuilds`
  in `pnpm-workspace.yaml`.
- **Env loading** uses Node's built-in `--env-file` (no dotenv dependency).

## Stopping Postgres

```bash
pnpm db:down              # stop the container, keep data
docker compose down -v    # stop and wipe the database volume
```
