import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { formatToolResult } from '../types.js';
import { fetchValyuMarketMovers } from './valyu.js';

const MarketMoversInputSchema = z.object({
  /**
   * Reserved for future filters (e.g. session=premarket, limit). Valyu's
   * dataset currently returns a fixed snapshot for the active US session,
   * so the schema is intentionally empty — keeping the parameter object
   * means we can extend without breaking existing callers.
   */
  _: z.string().optional().describe('Reserved.'),
});

export const getMarketMovers = new DynamicStructuredTool({
  name: 'get_market_movers',
  description:
    'Fetch the top US-market gainers and losers for the current trading session, including symbol, name, price, $ change, % change, and volume. Use for "what is moving today", broad-market pulse checks, and surfacing tickers that warrant deeper analysis.',
  schema: MarketMoversInputSchema,
  func: async () => {
    const { data, url } = await fetchValyuMarketMovers();
    return formatToolResult(data, [url]);
  },
});
