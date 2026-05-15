import { join } from 'node:path';
import { tmpdir } from 'node:os';

const DEFAULT_DIR = '.dexter';

/**
 * Resolve the directory where Dexter persists scratchpads, tool-result
 * offload files, the legacy SQLite memory index, the gateway debug log,
 * cron job state, and other run-time artefacts.
 *
 * Selection rules:
 *
 *   1. `DEXTER_DIR` env var wins if set (explicit override; useful for tests).
 *   2. On Vercel function instances the project root is read-only — the
 *      only writable location is `/tmp`. Redirect there so legacy fs-based
 *      code paths (scratchpad, tool-result-storage, MemoryManager fallback,
 *      etc.) keep working without rewriting them.
 *      `/tmp` is per-instance and ephemeral, which exactly matches what
 *      these artefacts need (single-request debug / overflow files). For
 *      anything that needs to survive cold starts we already route through
 *      the SaaS adapters (Postgres / MemoryLake / Vercel Blob).
 *   3. Otherwise — CLI, WhatsApp Worker, local `bun --filter @dexter/web
 *      dev`, tests — keep the historical `.dexter/` directory relative to
 *      the current working directory, so existing workflows and on-disk
 *      memory files remain reachable.
 */
function resolveDexterDir(): string {
  if (process.env.DEXTER_DIR && process.env.DEXTER_DIR.length > 0) {
    return process.env.DEXTER_DIR;
  }
  if (process.env.VERCEL === '1') {
    return join(tmpdir(), '.dexter');
  }
  return DEFAULT_DIR;
}

export function getDexterDir(): string {
  return resolveDexterDir();
}

export function dexterPath(...segments: string[]): string {
  return join(getDexterDir(), ...segments);
}
