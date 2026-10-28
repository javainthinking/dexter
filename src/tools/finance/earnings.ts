import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { formatToolResult } from '../types.js';
import { fetchValyuEarnings } from './valyu.js';

const EarningsInputSchema = z.object({
  ticker: z
    .string()
    .describe("The stock ticker symbol to fetch the latest earnings for. For example, 'AAPL' for Apple."),
});

export const getEarnings = new DynamicStructuredTool({
  name: 'get_earnings',
  description:
    "Fetches a company's latest earnings release: report date and time, actual vs. estimated EPS, and the EPS surprise.",
  schema: EarningsInputSchema,
  func: async (input) => {
    const ticker = input.ticker.trim().toUpperCase();
    const { data, url } = await fetchValyuEarnings(ticker);
    const record = Array.isArray(data?.earnings) ? data.earnings[0] : null;
    return formatToolResult(record || {}, [url]);
  },
});
