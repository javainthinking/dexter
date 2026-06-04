import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { api, withFallbackChain } from './api.js';
import { formatToolResult } from '../types.js';
import { TTL_24H } from './utils.js';
import { fetchValyuEarnings } from './valyu.js';

const EarningsInputSchema = z.object({
  ticker: z
    .string()
    .optional()
    .describe("Optional stock ticker symbol to fetch company-specific earnings. Omit to fetch the latest earnings feed across all companies."),
  limit: z
    .number()
    .int()
    .positive()
    .max(100)
    .optional()
    .describe('Optional number of earnings records to return. For the feed, defaults to 10 and maxes at 100. For a ticker, values above 40 are clamped by the API.'),
});

export const getEarnings = new DynamicStructuredTool({
  name: 'get_earnings',
  description:
    'Fetches earnings data from Financial Datasets. Pass a ticker for company-specific earnings, or omit ticker to fetch the latest earnings feed across all covered companies.',
  schema: EarningsInputSchema,
  func: async (input) => {
    const ticker = input.ticker?.trim().toUpperCase();

    // Feed mode (no ticker) or an explicit limit: return the full list. The
    // valyu fallback is ticker-specific, so it only applies to the single
    // company snapshot below.
    if (!ticker || input.limit) {
      const params = {
        ticker: ticker || undefined,
        limit: input.limit,
      };
      const { data, url } = await api.get('/earnings', params, { cacheable: true, ttlMs: TTL_24H });
      const records = Array.isArray(data?.earnings) ? data.earnings : [];
      return formatToolResult(records, [url]);
    }

    // Single-company snapshot: fall back to valyu if Financial Datasets fails.
    const { data, url } = await withFallbackChain(`earnings ${ticker}`, [
      { name: 'financial-datasets', run: () => api.get('/earnings', { ticker }, { cacheable: true, ttlMs: TTL_24H }) },
      { name: 'valyu', run: () => fetchValyuEarnings(ticker) },
    ]);
    const record = Array.isArray(data?.earnings) ? data.earnings[0] : null;
    return formatToolResult(record || {}, [url]);
  },
});
