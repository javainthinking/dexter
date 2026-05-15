/**
 * Drizzle + postgres-js client factory.
 *
 * Connection strategy (Supabase / Neon convention):
 *   - DATABASE_URL  → pgbouncer pooler, used for app queries
 *   - DIRECT_URL    → direct (port 5432), used for migrations / schema ops
 *
 * `prepare: false` is mandatory when going through pgbouncer in transaction
 * mode — prepared statements break across pooled connections.
 */

import postgres from 'postgres';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from './schema/index.js';

export type DexterDb = PostgresJsDatabase<typeof schema>;

interface ClientHandles {
  db: DexterDb;
  client: ReturnType<typeof postgres>;
}

const cache = new Map<string, ClientHandles>();

export function getDb(url?: string): DexterDb {
  return resolve(url).db;
}

export function getSql(url?: string): ReturnType<typeof postgres> {
  return resolve(url).client;
}

function resolve(explicitUrl?: string): ClientHandles {
  const url = explicitUrl ?? process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is not set. Cannot construct Dexter Postgres client.');
  }
  const cached = cache.get(url);
  if (cached) return cached;
  // `prepare: false` for pgbouncer transaction mode.
  // `max` is conservative — Fluid Compute may instantiate many parallel
  // function invocations, each holding their own client.
  const client = postgres(url, { prepare: false, max: 1 });
  const db = drizzle(client, { schema });
  const handles: ClientHandles = { db, client };
  cache.set(url, handles);
  return handles;
}

/**
 * Migration-time client uses DIRECT_URL (no pgbouncer). drizzle-kit reads
 * this via drizzle.config.ts; runtime code does not need it.
 */
export function getMigrationUrl(): string {
  const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  if (!url) throw new Error('DIRECT_URL or DATABASE_URL must be set for migrations.');
  return url;
}
