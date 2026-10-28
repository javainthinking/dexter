import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { stripFieldsDeep } from './api.js';
import { formatToolResult } from '../types.js';
import { fetchValyuInsiderTrades } from './valyu.js';

const REDUNDANT_INSIDER_FIELDS = ['issuer'] as const;

const InsiderTradesInputSchema = z.object({
  ticker: z
    .string()
    .describe("The stock ticker symbol to fetch insider trades for. For example, 'AAPL' for Apple."),
  limit: z
    .number()
    .default(10)
    .describe('Maximum number of insider trades to return (default: 10).'),
  filing_date_gte: z
    .string()
    .optional()
    .describe('Only trades filed on or after this date (YYYY-MM-DD).'),
  filing_date_lte: z
    .string()
    .optional()
    .describe('Only trades filed on or before this date (YYYY-MM-DD).'),
  name: z
    .string()
    .optional()
    .describe("Filter by insider name. Word order and abbreviations are tolerated (e.g. 'Timothy Teter' matches 'TETER TIMOTHY S')."),
});

/**
 * Token-based name matching: order-insensitive, with prefix matching to
 * handle SEC truncations (Tim ↔ Timothy). Matches when every query token
 * matches one of the candidate's tokens.
 */
function nameMatches(query: string, candidate: string): boolean {
  const queryTokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  const candidateTokens = candidate.toLowerCase().split(/\s+/).filter(Boolean);
  return queryTokens.every(q => candidateTokens.some(c => c.startsWith(q) || q.startsWith(c)));
}

export const getInsiderTrades = new DynamicStructuredTool({
  name: 'get_insider_trades',
  description: `Retrieves recent insider trading transactions for a given company ticker. Insider trades include purchases and sales of company stock by executives, directors, and other insiders, sourced from SEC Form 4 filings. Covers the most recent filings only; use the name and filing_date filters to narrow results.`,
  schema: InsiderTradesInputSchema,
  func: async (input) => {
    const ticker = input.ticker.trim().toUpperCase();
    // Filters run client-side, so over-fetch when any are set.
    const filtered = Boolean(input.name || input.filing_date_gte || input.filing_date_lte);
    const { data, url } = await fetchValyuInsiderTrades(ticker, filtered ? Math.max(input.limit, 100) : input.limit);
    const trades = ((data.insider_trades || []) as Record<string, unknown>[])
      .filter(row => !input.name || nameMatches(input.name, String(row.name ?? '')))
      .filter(row => !input.filing_date_gte || String(row.filing_date ?? '') >= input.filing_date_gte)
      .filter(row => !input.filing_date_lte || String(row.filing_date ?? '') <= input.filing_date_lte)
      .slice(0, input.limit);
    return formatToolResult(stripFieldsDeep(trades, REDUNDANT_INSIDER_FIELDS), [url]);
  },
});
