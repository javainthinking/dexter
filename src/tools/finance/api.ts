import { logger } from '../../utils/logger.js';

export interface ApiResponse {
  data: Record<string, unknown>;
  url: string;
}

/**
 * Remove redundant fields from API payloads before they are returned to the LLM.
 * This reduces token usage while preserving the financial metrics needed for analysis.
 */
export function stripFieldsDeep(value: unknown, fields: readonly string[]): unknown {
  const fieldsToStrip = new Set(fields);

  function walk(node: unknown): unknown {
    if (Array.isArray(node)) {
      return node.map(walk);
    }

    if (!node || typeof node !== 'object') {
      return node;
    }

    const record = node as Record<string, unknown>;
    const cleaned: Record<string, unknown> = {};

    for (const [key, child] of Object.entries(record)) {
      if (fieldsToStrip.has(key)) {
        continue;
      }
      cleaned[key] = walk(child);
    }

    return cleaned;
  }

  return walk(value);
}

export interface FallbackSource {
  /** Human-readable name used in warn/error logs (e.g. "valyu", "yahoo"). */
  name: string;
  /** Lazy fetcher — only invoked if all earlier sources failed. */
  run: () => Promise<ApiResponse>;
}

/**
 * Try each source in order and return the first successful response.
 *
 * Used by the finance tools to chain Valyu and Yahoo Finance so a 429 or
 * sparse record at one provider silently degrades to the next instead of
 * failing the agent turn. Each source must return a shape-compatible ApiResponse so
 * downstream code stays provider-agnostic.
 *
 * The thrown error on full-chain failure includes every provider's message
 * so post-mortems don't require re-running the call with logging on.
 */
export async function withFallbackChain(
  label: string,
  sources: FallbackSource[],
): Promise<ApiResponse> {
  if (sources.length === 0) {
    throw new Error(`${label}: no sources configured`);
  }
  const failures: string[] = [];
  for (let i = 0; i < sources.length; i++) {
    const source = sources[i];
    try {
      return await source.run();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push(`${source.name}: ${message}`);
      const next = sources[i + 1];
      if (next) {
        logger.warn(`[Finance] ${source.name} failed for ${label}: ${message} — falling back to ${next.name}`);
      } else {
        logger.error(`[Finance] ${source.name} failed for ${label}: ${message}`);
      }
    }
  }
  throw new Error(`${label}: all sources failed (${failures.join('; ')})`);
}
