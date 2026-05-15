/**
 * Composition root for the Vercel-hosted Web surface.
 *
 * Two modes:
 *   - "local"  — used by `bun --filter @dexter/web dev` for local development.
 *                Reuses the same local adapters as CLI (SQLite vector index +
 *                .dexter/ filesystem). Lets us run the real agent end-to-end
 *                inside Next.js without setting up Postgres first.
 *   - "cloud"  — Phase-3 target. Will wire up Vercel Blob + Neon Postgres +
 *                pgvector + Vercel Cron + per-org secrets. Currently throws
 *                so the seam is observable.
 *
 * Selection rule: if `process.env.DATABASE_URL` is set we go cloud; otherwise
 * local. Callers can override with `options.mode`.
 */

import type { CorePorts, EventSink, WebSessionStore } from '../../ports/index.js';
import { systemClock } from '../../ports/index.js';
import { LocalFsBlobStore } from '../../adapters/blob/local-fs.js';
import { LocalMemoryAdapter } from '../../adapters/memory/local.js';
import { EnvSecretsVault } from '../../adapters/secrets/env.js';
import { ConsoleLogger } from '../../adapters/logger/console.js';
import { DisabledBrowserDriver } from '../../adapters/browser/disabled.js';
import { PostgresMemoryAdapter } from '../../adapters/memory/postgres.js';
import { MemoryLakeAdapter } from '../../adapters/memory/memorylake.js';
import { PostgresWebSessionStore } from '../../adapters/storage/postgres/web-session-store.js';
import { VercelBlobStore } from '../../adapters/blob/vercel-blob.js';
import type { Memory } from '../../ports/memory.js';

export type WebPortsMode = 'local' | 'cloud';

export interface WebPortsContext {
  /** Tenant identifier (org_id). All cloud storage adapters scope to this. */
  orgId?: string;
  /** End-user identifier. */
  userId?: string;
  /** Per-request id for log correlation. */
  requestId: string;
  /** Per-request EventSink (typically an SseEventSink). */
  events?: EventSink;
  /** Force a mode; defaults to env-based detection. */
  mode?: WebPortsMode;
}

export interface WebPortsBundle extends CorePorts {
  /** Mode actually selected for this composition. */
  mode: WebPortsMode;
  /** Web session storage (cloud mode only — local uses in-memory). */
  webSessions?: WebSessionStore;
}

export async function composeWebPorts(ctx: WebPortsContext): Promise<WebPortsBundle> {
  const mode = ctx.mode ?? detectMode();
  return mode === 'cloud' ? composeCloud(ctx) : composeLocal(ctx);
}

function detectMode(): WebPortsMode {
  return process.env.DATABASE_URL ? 'cloud' : 'local';
}

/**
 * Memory backend selection (cloud mode):
 *   1. MemoryLake REST API when MEMORYLAKE_API_KEY + PROJECT_ID + BASE_URL
 *      are present. This is the preferred path — semantic search, conflict
 *      detection, and keyword clustering all live on the MemoryLake side.
 *   2. Postgres tables (dexter_memory_files / _chunks) as a fallback when
 *      the MemoryLake creds aren't configured. Phase 3.5 will enable
 *      pgvector here for parity.
 */
function chooseMemoryAdapter(ctx: WebPortsContext): Memory {
  const mlKey = process.env.MEMORYLAKE_API_KEY;
  const mlProject = process.env.MEMORYLAKE_PROJECT_ID;
  const mlBase = process.env.MEMORYLAKE_BASE_URL;
  if (mlKey && mlProject && mlBase) {
    // user_id scoping policy:
    //   - Phase 4 (auth landed):    ctx.userId is the authenticated user.id
    //                               from Clerk/Better Auth. One MemoryLake
    //                               user per real human, so memory survives
    //                               cookie wipes, new devices, etc.
    //   - Pre-auth (today):         ctx.userId is undefined → one shared
    //                               pool keyed by `dexter-anonymous`. We do
    //                               NOT use the browser session id here:
    //                               that would split memory per cookie and
    //                               prevent the agent from accumulating
    //                               context across sessions.
    //   - Phase 5 multi-tenant B2B: prefix with ctx.orgId.
    const userId = ctx.userId ?? 'dexter-anonymous';
    return new MemoryLakeAdapter({
      apiKey: mlKey,
      projectId: mlProject,
      baseUrl: mlBase,
      userId,
    });
  }
  return new PostgresMemoryAdapter({ orgId: ctx.orgId });
}

async function composeCloud(ctx: WebPortsContext): Promise<WebPortsBundle> {
  const logger = new ConsoleLogger({
    baseFields: { surface: 'web', mode: 'cloud', requestId: ctx.requestId },
  });

  // Vercel Blob requires BLOB_READ_WRITE_TOKEN. When it's absent (local
  // dev without `vercel env pull`) we fall back to the local filesystem
  // store so the app still boots — write paths just won't be portable to
  // Vercel runtime, but reads/writes still work.
  const blob = process.env.BLOB_READ_WRITE_TOKEN
    ? new VercelBlobStore({ prefix: 'dexter' })
    : new LocalFsBlobStore();

  const memory = chooseMemoryAdapter(ctx);
  const webSessions = new PostgresWebSessionStore();

  return {
    mode: 'cloud',
    blob,
    memory,
    events:
      ctx.events ?? {
        emit() {},
        async flush() {},
        async close() {},
      },
    secrets: new EnvSecretsVault(),
    browser: new DisabledBrowserDriver(),
    clock: systemClock,
    logger,
    webSessions,
  };
}

async function composeLocal(ctx: WebPortsContext): Promise<WebPortsBundle> {
  const logger = new ConsoleLogger({
    baseFields: { surface: 'web', mode: 'local', requestId: ctx.requestId },
  });
  return {
    mode: 'local',
    blob: new LocalFsBlobStore(),
    memory: await LocalMemoryAdapter.create(),
    events:
      ctx.events ?? {
        emit() {},
        async flush() {},
        async close() {},
      },
    secrets: new EnvSecretsVault(),
    browser: new DisabledBrowserDriver(),
    clock: systemClock,
    logger,
  };
}
