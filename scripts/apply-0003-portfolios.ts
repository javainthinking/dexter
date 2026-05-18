/**
 * One-shot script: apply 0003_portfolios.sql against the live DB and
 * register the migration in drizzle's __drizzle_migrations table. Kept
 * separate from `drizzle-kit push` because that tool requires a TTY for
 * its destructive-change prompt.
 *
 * Run once with: bun run scripts/apply-0003-portfolios.ts
 */
import 'dotenv/config';
import { readFileSync } from 'node:fs';
import postgres from 'postgres';

const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!url) throw new Error('DIRECT_URL or DATABASE_URL must be set');

const sql = postgres(url, { prepare: false, max: 1 });

async function main(): Promise<void> {
  const path = new URL('../src/db/migrations/0003_portfolios.sql', import.meta.url);
  const raw = readFileSync(path, 'utf-8');
  const statements = raw
    .split('--> statement-breakpoint')
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !/^--/.test(s));

  await sql.begin(async (tx) => {
    for (const stmt of statements) {
      await tx.unsafe(stmt);
    }
    // Register so drizzle-kit's `journal.json` and `__drizzle_migrations`
    // stay in sync — otherwise `bun run db:generate` would try to recreate
    // the same SQL on the next run.
    await tx`
      CREATE TABLE IF NOT EXISTS "drizzle"."__drizzle_migrations" (
        "id" serial PRIMARY KEY NOT NULL,
        "hash" text NOT NULL,
        "created_at" bigint
      )
    `.catch(() => {});
    await tx`
      INSERT INTO "drizzle"."__drizzle_migrations" ("hash", "created_at")
      VALUES ('0003_portfolios', ${Date.now()})
      ON CONFLICT DO NOTHING
    `;
  });

  console.log('migration 0003_portfolios applied');
}

main()
  .catch((err) => {
    console.error('migration failed:', err);
    process.exit(1);
  })
  .finally(() => sql.end());
