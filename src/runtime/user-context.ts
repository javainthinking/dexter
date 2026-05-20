/**
 * Per-request user identity via AsyncLocalStorage.
 *
 * The agent loop runs in a shared process — on CLI it's bound to a
 * single human at startup, but on Vercel it's a multi-tenant function
 * that handles concurrent requests from different signed-in users. We
 * need tools (currently the office uploader, soon others) to discover
 * "who is this request acting on behalf of?" without threading a
 * userId argument through every tool wrapper.
 *
 * Pattern mirrors `memory-context.ts`: the request handler enters the
 * scope before invoking the agent; tools resolve the current user id
 * by calling `getCurrentUserId()`. CLI mode leaves the store empty and
 * uses the `DEXTER_USER_ID` env var if set, falling back to 'default'
 * (same precedent the MemoryLake adapter uses).
 */

import { AsyncLocalStorage } from 'node:async_hooks';

export interface UserContext {
  /** Stable, URL-safe identifier — DB row id for web, env or 'default' for CLI. */
  userId: string;
  /** Optional display label; carry through if present so tools can attribute work. */
  email?: string;
}

const userStorage = new AsyncLocalStorage<UserContext>();

export function withUser<R>(ctx: UserContext, fn: () => R | Promise<R>): Promise<R> {
  return Promise.resolve(userStorage.run(ctx, fn));
}

/**
 * Return the current request's user context, or `null` if none was
 * established (e.g. CLI startup before any handler scope). Callers
 * that just want an id should prefer `getCurrentUserId()`.
 */
export function getCurrentUser(): UserContext | null {
  return userStorage.getStore() ?? null;
}

/**
 * Resolve a user id with sensible fallbacks. Order:
 *   1. AsyncLocalStorage scope (web request)
 *   2. DEXTER_USER_ID env var (CLI, scripts, CI)
 *   3. literal 'default' (single-tenant local use)
 *
 * Always returns a non-empty string, so callers don't need null checks.
 */
export function getCurrentUserId(): string {
  const scoped = userStorage.getStore();
  if (scoped?.userId) return scoped.userId;
  const fromEnv = process.env.DEXTER_USER_ID;
  if (fromEnv && fromEnv.trim().length > 0) return fromEnv.trim();
  return 'default';
}
