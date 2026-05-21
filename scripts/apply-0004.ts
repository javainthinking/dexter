/**
 * Apply just the 0004_agent_jobs migration without going through
 * drizzle-kit (which insists on interactive prompts for unrelated
 * drift). We read the SQL file and execute it as one transaction
 * against DIRECT_URL.
 *
 * Idempotent: `CREATE TABLE IF NOT EXISTS` would make this safe, but
 * the migration as written uses plain CREATE. We wrap in a try and
 * silently no-op if the table already exists ("42P07" duplicate_table).
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

const sqlPath = join(import.meta.dir, '..', 'src', 'db', 'migrations', '0004_agent_jobs.sql');
const sqlText = readFileSync(sqlPath, 'utf-8');

// Strip the drizzle-kit `--> statement-breakpoint` markers and split
// into separate statements so we can run each independently and
// tolerate "already exists" on individual ones.
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
