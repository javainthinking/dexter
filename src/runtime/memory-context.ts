/**
 * Per-request Memory injection via AsyncLocalStorage.
 *
 * Background: the three memory tools (memory_update / memory_search /
 * memory_get) historically imported `MemoryManager` directly, which hard-
 * coded the SQLite + local-filesystem backend. That was fine when there
 * was only one runtime (CLI), but the Web SaaS surface needs a different
 * Memory backend per request (MemoryLake for cloud, Postgres fallback,
 * local for tests). Threading the port through the tool registry would
 * require rebuilding the registry per request, which is expensive.
 *
 * AsyncLocalStorage gives us request-scoped context that survives across
 * `await` boundaries within the same async task. The agent runner enters
 * the scope at the start of `runQuery`, every tool runs inside it, and
 * `getCurrentMemory()` resolves to the request's Memory port. Concurrent
 * requests stay isolated.
 */

import { AsyncLocalStorage } from 'node:async_hooks';
import type { Memory } from '../ports/memory.js';

const memoryStorage = new AsyncLocalStorage<Memory>();

/**
 * Enter a Memory-scoped async region. The provided port is what
 * `getCurrentMemory()` returns for the duration of `fn`.
 */
export function withMemory<R>(memory: Memory, fn: () => R | Promise<R>): Promise<R> {
  return Promise.resolve(memoryStorage.run(memory, fn));
}

/**
 * Resolve the Memory port for the current async context. Falls back to the
 * legacy MemoryManager-backed adapter when no scope is active (CLI / cron
 * paths that haven't been migrated to call withMemory yet).
 */
let fallback: Memory | null = null;

export async function getCurrentMemory(): Promise<Memory> {
  const scoped = memoryStorage.getStore();
  if (scoped) return scoped;
  if (!fallback) {
    const { LocalMemoryAdapter } = await import('../adapters/memory/local.js');
    fallback = await LocalMemoryAdapter.create();
  }
  return fallback;
}
