import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { api, withFallbackChain } from './api.js';
import { formatToolResult } from '../types.js';
import { TTL_24H } from './utils.js';
import { fetchValyuEarnings } from './valyu.js';

const EarningsInputSchema = z.object({
  ticker: z
    .string()
    .describe("The stock ticker symbol to fetch the latest earnings for. For example, 'AAPL' for Apple."),
});

export const getEarnings = new DynamicStructuredTool({
  name: 'get_earnings',
  description:
    'Fetches the most recent earnings snapshot for a company, including key income statement, balance sheet, and cash flow figures from the 8-K earnings release.',
  schema: EarningsInputSchema,
  func: async (input) => {
    const ticker = input.ticker.trim().toUpperCase();
    const { data, url } = await withFallbackChain(`earnings ${ticker}`, [
      { name: 'financial-datasets', run: () => api.get('/earnings', { ticker }, { cacheable: true, ttlMs: TTL_24H }) },
      { name: 'valyu', run: () => fetchValyuEarnings(ticker) },
    ]);
    const record = Array.isArray(data?.earnings) ? data.earnings[0] : null;
    return formatToolResult(record || {}, [url]);
  },
});
