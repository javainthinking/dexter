/**
 * One-shot script: apply 0011_gsc.sql (additive, idempotent).
 *
 * Run once with: bun run scripts/apply-0011.ts
 */
import { readFileSync } from 'node:fs';
// Loads repo-root + apps/web .env.local (dotenv/config only reads ./.env).
import { db } from './seo/lib';

const sql = db();

async function main(): Promise<void> {
  const path = new URL('../src/db/migrations/0011_gsc.sql', import.meta.url);
  const statements = readFileSync(path, 'utf-8')
    .split('--> statement-breakpoint')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  await sql.begin(async (tx) => {
    for (const stmt of statements) await tx.unsafe(stmt);
  });
  const [row] = await sql`
    select to_regclass('public.dexter_gsc_daily') as daily,
           to_regclass('public.dexter_gsc_totals_daily') as totals`;
  console.log('migration 0011_gsc applied:', row.daily, row.totals);
}

main()
  .catch((err) => {
    console.error('migration failed:', err);
    process.exit(1);
  })
  .finally(() => sql.end());
