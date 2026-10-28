/**
 * One-shot script: apply 0010_stock_pages.sql (additive, idempotent).
 *
 * Run once with: bun run scripts/apply-0010.ts
 */
import 'dotenv/config';
import { readFileSync } from 'node:fs';
import postgres from 'postgres';

const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!url) throw new Error('DIRECT_URL or DATABASE_URL must be set');

const sql = postgres(url, { prepare: false, max: 1 });

async function main(): Promise<void> {
  const path = new URL('../src/db/migrations/0010_stock_pages.sql', import.meta.url);
  const statements = readFileSync(path, 'utf-8')
    .split('--> statement-breakpoint')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  await sql.begin(async (tx) => {
    for (const stmt of statements) await tx.unsafe(stmt);
  });
  const [row] = await sql`select to_regclass('public.dexter_stock_pages') as t`;
  console.log('migration 0010_stock_pages applied:', row.t);
}

main()
  .catch((err) => {
    console.error('migration failed:', err);
    process.exit(1);
  })
  .finally(() => sql.end());
