/**
 * Apply 0005_feedback migration. Mirrors apply-0004.ts — bypasses
 * drizzle-kit's interactive drift resolution so a single migration can
 * be applied without TTY.
 */
import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import postgres from 'postgres';

const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!url) {
  console.error('DIRECT_URL or DATABASE_URL must be set.');
  process.exit(1);
}

const sqlPath = join(import.meta.dir, '..', 'src', 'db', 'migrations', '0005_feedback.sql');
const sqlText = readFileSync(sqlPath, 'utf-8');
const statements = sqlText
  .split('--> statement-breakpoint')
  .map((s) => s.trim())
  .filter((s) => s.length > 0);

const client = postgres(url, { prepare: false, max: 1 });
try {
  for (const stmt of statements) {
    try {
      await client.unsafe(stmt);
      console.log('✓', stmt.split('\n')[0].slice(0, 80));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('already exists')) {
        console.log('· already exists, skipping:', stmt.split('\n')[0].slice(0, 80));
      } else {
        throw err;
      }
    }
  }
  console.log('done.');
} finally {
  await client.end();
}
