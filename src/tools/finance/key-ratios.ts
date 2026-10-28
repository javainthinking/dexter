import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { withFallbackChain } from './api.js';
import { formatToolResult } from '../types.js';
import { fetchYahooKeyRatiosSnapshot } from './yahoo.js';
import { fetchValyuKeyRatiosSnapshot } from './valyu.js';

const KeyRatiosInputSchema = z.object({
  ticker: z
    .string()
    .describe("The stock ticker symbol to fetch key ratios for. For example, 'AAPL' for Apple."),
});

export const getKeyRatios = new DynamicStructuredTool({
  name: 'get_key_ratios',
  description:
    'Fetches the latest financial metrics snapshot for a company, including valuation ratios (P/E, P/B, P/S, EV/EBITDA, PEG), profitability (margins, ROE, ROA, ROIC), liquidity (current/quick/cash ratios), leverage (debt/equity, debt/assets), per-share metrics (EPS, book value, FCF), and growth rates (revenue, earnings, EPS, FCF, EBITDA).',
  schema: KeyRatiosInputSchema,
  func: async (input) => {
    const ticker = input.ticker.trim().toUpperCase();
    const { data, url } = await withFallbackChain(`financial-metrics/snapshot ${ticker}`, [
      { name: 'valyu', run: () => fetchValyuKeyRatiosSnapshot(ticker) },
      { name: 'yahoo', run: () => fetchYahooKeyRatiosSnapshot(ticker) },
    ]);
    return formatToolResult(data.snapshot || {}, [url]);
  },
});
