/**
 * Shared utilities for financial tools.
 */

/** Sub-tool timeout in milliseconds. Returns partial results on timeout.
 * Sized for a full fallback chain (Valyu search, then Yahoo) on a slow day. */
export const SUB_TOOL_TIMEOUT_MS = 60_000;

/**
 * Race a promise against a timeout. Rejects with a descriptive error
 * if the promise doesn't settle within `ms` milliseconds.
 */
export function withTimeout<T>(promise: Promise<T>, ms: number, label?: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  return Promise.race([
    promise.finally(() => clearTimeout(timer)),
    new Promise<never>((_, reject) => {
      timer = setTimeout(
        () => reject(new Error(`${label ?? 'Operation'} timed out after ${ms / 1000}s`)),
        ms,
      );
    }),
  ]);
}
