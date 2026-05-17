import { readCache, writeCache, describeRequest } from '../../utils/cache.js';
import { logger } from '../../utils/logger.js';

const BASE_URL = 'https://api.financialdatasets.ai';

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

function getApiKey(): string {
  return process.env.FINANCIAL_DATASETS_API_KEY || '';
}

/**
 * Shared request execution: handles API key, error handling, logging, and response parsing.
 */
async function executeRequest(
  url: string,
  label: string,
  init: RequestInit,
): Promise<Record<string, unknown>> {
  const apiKey = getApiKey();

  if (!apiKey) {
    logger.warn(`[Financial Datasets API] call without key: ${label}`);
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      headers: {
        'x-api-key': apiKey,
        ...init.headers,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(`[Financial Datasets API] network error: ${label} — ${message}`);
    throw new Error(`[Financial Datasets API] request failed for ${label}: ${message}`);
  }

  if (!response.ok) {
    const detail = `${response.status} ${response.statusText}`;
    logger.error(`[Financial Datasets API] error: ${label} — ${detail}`);
    throw new Error(`[Financial Datasets API] request failed: ${detail}`);
  }

  const data = await response.json().catch(() => {
    const detail = `invalid JSON (${response.status} ${response.statusText})`;
    logger.error(`[Financial Datasets API] parse error: ${label} — ${detail}`);
    throw new Error(`[Financial Datasets API] request failed: ${detail}`);
  });

  return data as Record<string, unknown>;
}

export const api = {
  async get(
    endpoint: string,
    params: Record<string, string | number | string[] | undefined>,
    options?: { cacheable?: boolean; ttlMs?: number },
  ): Promise<ApiResponse> {
    const label = describeRequest(endpoint, params);

    // Check local cache first — avoids redundant network calls for immutable data
    if (options?.cacheable) {
      const cached = readCache(endpoint, params, options.ttlMs);
      if (cached) {
        return cached;
      }
    }

    const url = new URL(`${BASE_URL}${endpoint}`);

    // Add params to URL, handling arrays
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((v) => url.searchParams.append(key, v));
        } else {
          url.searchParams.append(key, String(value));
        }
      }
    }

    const data = await executeRequest(url.toString(), label, {});

    // Persist for future requests when the caller marked the response as cacheable
    if (options?.cacheable) {
      writeCache(endpoint, params, data, url.toString());
    }

    return { data, url: url.toString() };
  },

  async post(
    endpoint: string,
    body: Record<string, unknown>,
  ): Promise<ApiResponse> {
    const label = `POST ${endpoint}`;
    const url = `${BASE_URL}${endpoint}`;

    const data = await executeRequest(url, label, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    return { data, url };
  },
};

/** @deprecated Use `api.get` instead */
export const callApi = api.get;

/**
 * Run a primary data fetch, falling back to a secondary source on failure.
 *
 * Used by the finance tools to try Financial Datasets first and silently
 * switch to Yahoo Finance when the primary throws. Both sources are expected
 * to return shape-compatible `ApiResponse` objects so callers don't branch.
 */
export async function withFallback(
  primary: () => Promise<ApiResponse>,
  fallback: () => Promise<ApiResponse>,
  label: string,
): Promise<ApiResponse> {
  return withFallbackChain(label, [
    { name: 'primary', run: primary },
    { name: 'fallback', run: fallback },
  ]);
}

export interface FallbackSource {
  /** Human-readable name used in warn/error logs (e.g. "financial-datasets", "yahoo", "valyu"). */
  name: string;
  /** Lazy fetcher — only invoked if all earlier sources failed. */
  run: () => Promise<ApiResponse>;
}

/**
 * Try each source in order and return the first successful response.
 *
 * Used for fundamentals (cash-flow, income, earnings, insider, key-ratios)
 * where we chain Financial Datasets -> Yahoo -> Valyu so a 429 or sparse
 * record at one provider silently degrades to the next instead of failing
 * the agent turn. Each source must return a shape-compatible ApiResponse so
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
