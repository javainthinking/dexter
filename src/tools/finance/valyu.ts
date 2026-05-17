/**
 * Valyu adapter — second-fallback source for US-market financials and the
 * primary source for market-movers (which Financial Datasets / Yahoo don't
 * cover in our existing toolset).
 *
 * Valyu exposes typed financial datasets behind a natural-language search
 * surface. Each fetcher here:
 *   1. Builds a NL query that pins the result to a specific dataset via
 *      `includedSources`.
 *   2. Returns the first result's `content` (already structured JSON) plus
 *      the canonical `url` so the caller can attach source citations.
 *
 * Layering: this module is a pure data adapter. It does NOT decide whether
 * Valyu is the primary source for a given call — that's `withFallback` /
 * `withFallbackChain` in api.ts. The matching DynamicStructuredTool wrappers
 * live alongside the existing tools (earnings.ts, insider_trades.ts, etc.).
 */

import { Valyu } from 'valyu-js';
import type { SearchResponse, SearchResult } from 'valyu-js';
import { logger } from '../../utils/logger.js';
import type { ApiResponse } from './api.js';

const VALYU_SOURCES = {
  cashFlow: 'valyu/valyu-cash-flow-US',
  incomeStatement: 'valyu/valyu-income-statement-US',
  marketMovers: 'valyu/valyu-market-movers-US',
  earnings: 'valyu/valyu-earnings-US',
  statistics: 'valyu/valyu-statistics-US',
  insiderTransactions: 'valyu/valyu-insider-transactions-US',
} as const;

let cachedClient: Valyu | null = null;

function getValyuClient(): Valyu {
  if (cachedClient) return cachedClient;
  const apiKey = process.env.VALYU_API_KEY;
  if (!apiKey) {
    throw new Error('VALYU_API_KEY is not set');
  }
  cachedClient = new Valyu(apiKey);
  return cachedClient;
}

/**
 * Execute a single-source Valyu search and return the first hit.
 *
 * Throws when the API call itself fails, when Valyu reports success:false,
 * or when no results come back — callers (typically a `withFallback` chain)
 * use the thrown error to decide whether to try the next source.
 */
async function searchSingleSource(
  query: string,
  source: string,
  label: string,
): Promise<SearchResult> {
  const client = getValyuClient();
  let response: SearchResponse;
  try {
    response = await client.search(query, {
      includedSources: [source],
      maxNumResults: 1,
      isToolCall: true,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(`[Valyu] network error: ${label} — ${message}`);
    throw new Error(`[Valyu] request failed for ${label}: ${message}`);
  }

  if (!response.success) {
    const detail = response.error ?? 'unknown error';
    logger.error(`[Valyu] error: ${label} — ${detail}`);
    throw new Error(`[Valyu] request failed for ${label}: ${detail}`);
  }

  const first = response.results?.[0];
  if (!first) {
    throw new Error(`[Valyu] no results for ${label}`);
  }
  return first;
}

/**
 * Parse a Valyu `content` payload into a plain object/array.
 *
 * Valyu's `SearchResult.content` is typed `string | object | any[]` because
 * unstructured datasets return prose. The financial datasets we care about
 * always return structured JSON, but a few endpoints occasionally hand back
 * a JSON-encoded string — handle both shapes.
 */
function parseContent<T>(content: unknown, label: string): T {
  if (typeof content === 'string') {
    try {
      return JSON.parse(content) as T;
    } catch {
      throw new Error(`[Valyu] could not parse content for ${label}`);
    }
  }
  return content as T;
}

/**
 * Build a `cash_flow` payload shaped like Financial Datasets' response so the
 * existing `getCashFlowStatements` tool can swap us in without changes to
 * downstream code paths.
 *
 * Valyu's schema is sparser than Financial Datasets' — it gives us the four
 * top-line cashflows plus capex. The unmapped fields are simply omitted, not
 * faked, so the LLM sees `null`-ish gaps and can flag the limitation.
 */
export async function fetchValyuCashFlowStatements(
  ticker: string,
  limit: number,
): Promise<ApiResponse> {
  const label = `valyu cash-flow ${ticker}`;
  const query = `${ticker} most recent ${limit} cash flow statements`;
  const result = await searchSingleSource(query, VALYU_SOURCES.cashFlow, label);
  const content = parseContent<Array<Record<string, unknown>>>(result.content, label);
  const cash_flow_statements = content.slice(0, limit).map((row) => ({
    ticker: ticker.toUpperCase(),
    report_period: row.fiscal_date_ending,
    net_cash_flow_from_operations: row.operating_cashflow,
    net_cash_flow_from_investing: row.investing_cashflow,
    net_cash_flow_from_financing: row.financing_cashflow,
    free_cash_flow: row.free_cashflow,
    capital_expenditure: row.capital_expenditures,
  }));
  return { data: { cash_flow_statements }, url: result.url };
}

/** Build an `income_statements` payload shaped like Financial Datasets'. */
export async function fetchValyuIncomeStatements(
  ticker: string,
  limit: number,
): Promise<ApiResponse> {
  const label = `valyu income ${ticker}`;
  const query = `${ticker} most recent ${limit} income statements`;
  const result = await searchSingleSource(query, VALYU_SOURCES.incomeStatement, label);
  const content = parseContent<Array<Record<string, unknown>>>(result.content, label);
  const income_statements = content.slice(0, limit).map((row) => ({
    ticker: ticker.toUpperCase(),
    report_period: row.fiscal_date_ending,
    revenue: row.total_revenue,
    gross_profit: row.gross_profit,
    operating_income: row.operating_income,
    net_income: row.net_income,
    earnings_per_share: row.basic_eps,
    earnings_per_share_diluted: row.diluted_eps,
  }));
  return { data: { income_statements }, url: result.url };
}

/** Build an `earnings` payload shaped like Financial Datasets'. */
export async function fetchValyuEarnings(ticker: string): Promise<ApiResponse> {
  const label = `valyu earnings ${ticker}`;
  const query = `${ticker} latest earnings report`;
  const result = await searchSingleSource(query, VALYU_SOURCES.earnings, label);
  const content = parseContent<Array<Record<string, unknown>>>(result.content, label);
  const latest = content[0];
  if (!latest) {
    throw new Error(`[Valyu] no earnings data for ${ticker}`);
  }
  const earnings = [{
    ticker: ticker.toUpperCase(),
    report_period: latest.fiscal_date_ending,
    report_date: latest.date,
    currency: latest.currency,
    eps_actual: latest.eps_actual,
    eps_estimate: latest.eps_estimate,
    eps_surprise: latest.surprise,
    eps_surprise_percent: latest.surprise_percentage,
  }];
  return { data: { earnings }, url: result.url };
}

/** Build an `insider_trades` payload shaped like Financial Datasets'. */
export async function fetchValyuInsiderTrades(
  ticker: string,
  limit: number,
): Promise<ApiResponse> {
  const label = `valyu insider ${ticker}`;
  const query = `${ticker} recent insider transactions`;
  const result = await searchSingleSource(query, VALYU_SOURCES.insiderTransactions, label);
  const content = parseContent<Array<Record<string, unknown>>>(result.content, label);
  const insider_trades = content.slice(0, limit).map((row) => ({
    ticker: ticker.toUpperCase(),
    name: row.insider_name,
    title: row.title,
    transaction_date: row.trade_date,
    filing_date: row.filing_date,
    transaction_shares: row.shares,
    transaction_price_per_share: row.price,
    transaction_value: row.value,
    transaction_type: row.transaction_type,
  }));
  return { data: { insider_trades }, url: result.url };
}

/** Build a key-ratios snapshot shaped like Financial Datasets'. */
export async function fetchValyuKeyRatiosSnapshot(ticker: string): Promise<ApiResponse> {
  const label = `valyu statistics ${ticker}`;
  const query = `${ticker} latest statistics`;
  const result = await searchSingleSource(query, VALYU_SOURCES.statistics, label);
  const content = parseContent<Record<string, unknown>>(result.content, label);
  const snapshot = {
    ticker: ticker.toUpperCase(),
    market_cap: content.market_cap,
    price_to_earnings_ratio: content.pe_ratio,
    return_on_equity: content.roe,
    debt_to_equity: content.debt_to_equity,
    dividend_yield: content.dividend_yield,
    beta: content.beta,
  };
  return { data: { snapshot }, url: result.url };
}

/**
 * Market movers — top US-market gainers and losers for the current session.
 *
 * Valyu only returns ONE direction (gainers OR losers) per call, signalled
 * via `metadata.direction`. Two queries fire in parallel and the results
 * are merged into a single `{ gainers, losers }` payload, which is the
 * shape downstream code wants regardless of how the upstream API splits it.
 *
 * Mapping notes — Valyu rows ship as `last/change/percent_change/volume`
 * with the company `name` and `exchange`. We normalise to `price` to match
 * how the rest of the codebase names quote fields.
 */
export interface MarketMover {
  symbol: string;
  name: string;
  exchange: string | null;
  price: number;
  change: number;
  percent_change: number;
  volume: number;
  datetime: string | null;
}

export interface MarketMoversPayload {
  gainers: MarketMover[];
  losers: MarketMover[];
  market: string | null;
  retrieved_at: string | null;
  source_urls: string[];
}

interface ValyuMoverRow {
  symbol: string;
  name?: string;
  exchange?: string;
  last?: number;
  change?: number;
  percent_change?: number;
  volume?: number;
  datetime?: string;
}

function normaliseMoverRow(row: ValyuMoverRow): MarketMover {
  return {
    symbol: row.symbol,
    name: row.name ?? '',
    exchange: row.exchange ?? null,
    price: Number(row.last ?? 0),
    change: Number(row.change ?? 0),
    percent_change: Number(row.percent_change ?? 0),
    volume: Number(row.volume ?? 0),
    datetime: row.datetime ?? null,
  };
}

async function fetchMoversByDirection(
  direction: 'gainers' | 'losers',
): Promise<{ rows: MarketMover[]; metadata: Record<string, unknown>; url: string }> {
  const query = `today top US stock market ${direction}`;
  const label = `valyu market-movers ${direction}`;
  const result = await searchSingleSource(query, VALYU_SOURCES.marketMovers, label);
  const content = parseContent<ValyuMoverRow[]>(result.content, label);
  return {
    rows: Array.isArray(content) ? content.map(normaliseMoverRow) : [],
    metadata: (result.metadata ?? {}) as Record<string, unknown>,
    url: result.url,
  };
}

export async function fetchValyuMarketMovers(): Promise<ApiResponse> {
  const [gainers, losers] = await Promise.all([
    fetchMoversByDirection('gainers'),
    fetchMoversByDirection('losers'),
  ]);
  const metadata = gainers.metadata ?? losers.metadata ?? {};
  const payload: MarketMoversPayload = {
    gainers: gainers.rows,
    losers: losers.rows,
    market: (metadata.market as string) ?? null,
    retrieved_at: (metadata.timestamp as string) ?? null,
    source_urls: [gainers.url, losers.url],
  };
  return { data: payload as unknown as Record<string, unknown>, url: gainers.url };
}
