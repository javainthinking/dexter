/**
 * drizzle-kit config — drives migration generation + push.
 *
 * Schema lives at src/db/schema/. Migrations are emitted to
 * src/db/migrations/. Migrations run against DIRECT_URL (no pgbouncer).
 *
 * Commands:
 *   bun run db:generate       # produce SQL from schema diffs
 *   bun run db:push           # apply directly (dev only)
 *   bun run db:migrate        # apply tracked migration files (prod)
 *   bun run db:studio         # open Drizzle Studio
 */

import { defineConfig } from 'drizzle-kit';
import { config as loadEnv } from 'dotenv';

loadEnv({ quiet: true });

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema/index.ts',
  out: './src/db/migrations',
  dbCredentials: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? '',
  },
  // All tables in this app are prefixed dexter_. Tell drizzle-kit to ignore
  // any other tables in the database so it never tries to drop them.
  tablesFilter: ['dexter_*'],
  verbose: true,
  strict: true,
});
