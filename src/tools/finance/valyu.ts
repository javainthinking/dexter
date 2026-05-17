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
  stocks: 'valyu/valyu-stocks',
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
 * Each Valyu content row arrives as a flat array or a numeric-indexed
 * object. Both decode through `parseContent`; this helper coerces them
 * into a real array so downstream `.map`/`.slice` calls are safe.
 */
function toRowArray(content: unknown): Array<Record<string, unknown>> {
  if (Array.isArray(content)) return content as Array<Record<string, unknown>>;
  if (content && typeof content === 'object') {
    const obj = content as Record<string, unknown>;
    const rows: Array<Record<string, unknown>> = [];
    for (let i = 0; obj[String(i)] !== undefined; i++) {
      rows.push(obj[String(i)] as Record<string, unknown>);
    }
    return rows;
  }
  return [];
}

function num(v: unknown): number | undefined {
  if (v === null || v === undefined) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * Build a `cash_flow_statements` payload shaped like Financial Datasets'.
 *
 * Valyu nests the cashflows by activity type (operating / investing /
 * financing), so we lift the relevant scalar fields up to the top level
 * the formatter + downstream consumers expect.
 */
export async function fetchValyuCashFlowStatements(
  ticker: string,
  limit: number,
): Promise<ApiResponse> {
  const label = `valyu cash-flow ${ticker}`;
  const query = `${ticker} most recent ${limit} cash flow statements`;
  const result = await searchSingleSource(query, VALYU_SOURCES.cashFlow, label);
  const rows = toRowArray(parseContent(result.content, label));
  const cash_flow_statements = rows.slice(0, limit).map((row) => {
    const operating = (row.operating_activities ?? {}) as Record<string, unknown>;
    const investing = (row.investing_activities ?? {}) as Record<string, unknown>;
    return {
      ticker: ticker.toUpperCase(),
      report_period: row.fiscal_date,
      fiscal_year: row.year,
      net_cash_flow_from_operations: num(operating.operating_cash_flow),
      operating_cash_flow: num(operating.operating_cash_flow),
      capital_expenditure: num(investing.capital_expenditures),
      free_cash_flow: num(row.free_cash_flow),
      depreciation_and_amortization: num(operating.depreciation),
      stock_based_compensation: num(operating.stock_based_compensation),
    };
  });
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
  const rows = toRowArray(parseContent(result.content, label));
  const income_statements = rows.slice(0, limit).map((row) => ({
    ticker: ticker.toUpperCase(),
    report_period: row.fiscal_date,
    fiscal_year: row.year,
    fiscal_quarter: row.quarter,
    revenue: num(row.sales),
    cost_of_revenue: num(row.cost_of_goods),
    gross_profit: num(row.gross_profit),
    operating_income: num(row.operating_income),
    net_income: num(row.net_income),
    earnings_per_share: num(row.eps_basic),
    earnings_per_share_diluted: num(row.eps_diluted),
    basic_earnings_per_share: num(row.eps_basic),
    weighted_average_shares: num(row.basic_shares_outstanding),
    weighted_average_shares_diluted: num(row.diluted_shares_outstanding),
    ebitda: num(row.ebitda),
    ebit: num(row.ebit),
  }));
  return { data: { income_statements }, url: result.url };
}

/** Build an `earnings` payload shaped like Financial Datasets'. */
export async function fetchValyuEarnings(ticker: string): Promise<ApiResponse> {
  const label = `valyu earnings ${ticker}`;
  const query = `${ticker} latest earnings report`;
  const result = await searchSingleSource(query, VALYU_SOURCES.earnings, label);
  const rows = toRowArray(parseContent(result.content, label));
  const latest = rows[0];
  if (!latest) {
    throw new Error(`[Valyu] no earnings data for ${ticker}`);
  }
  const earnings = [{
    ticker: ticker.toUpperCase(),
    report_date: latest.date,
    report_time: latest.time,
    eps_actual: num(latest.eps_actual),
    eps_estimate: num(latest.eps_estimate),
    eps_surprise: num(latest.difference),
    eps_surprise_percent: num(latest.surprise_prc),
  }];
  return { data: { earnings }, url: result.url };
}

/**
 * Build an `insider_trades` payload shaped like Financial Datasets'.
 *
 * Valyu collapses transaction type into a free-text `description` field
 * ("Sale at price 171.97 - 177.51 per share."). We sniff the first verb so
 * downstream filters that key off `transaction_type` (buy/sell/exercise)
 * still work, while the original description rides through verbatim for
 * audit purposes.
 */
function inferTransactionType(description: unknown): string {
  const text = String(description ?? '').toLowerCase();
  if (text.includes('sale') || text.includes('sold') || text.includes('sell')) return 'sell';
  if (text.includes('purchase') || text.includes('bought') || text.includes('buy')) return 'buy';
  if (text.includes('exercise')) return 'exercise';
  if (text.includes('gift')) return 'gift';
  return 'unknown';
}

export async function fetchValyuInsiderTrades(
  ticker: string,
  limit: number,
): Promise<ApiResponse> {
  const label = `valyu insider ${ticker}`;
  const query = `${ticker} recent insider transactions`;
  const result = await searchSingleSource(query, VALYU_SOURCES.insiderTransactions, label);
  const rows = toRowArray(parseContent(result.content, label));
  const insider_trades = rows.slice(0, limit).map((row) => ({
    ticker: ticker.toUpperCase(),
    name: row.full_name,
    title: row.position,
    transaction_date: row.date_reported,
    filing_date: row.date_reported,
    is_direct: row.is_direct,
    transaction_shares: num(row.shares),
    transaction_value: num(row.value),
    transaction_type: inferTransactionType(row.description),
    description: row.description,
  }));
  return { data: { insider_trades }, url: result.url };
}

/**
 * Build a key-ratios snapshot shaped like Financial Datasets'.
 *
 * Valyu's statistics object is heavily nested (valuations_metrics /
 * financials / stock_statistics / stock_price_summary / dividends_and_splits).
 * We flatten the relevant scalars onto the top level the existing formatter
 * + downstream consumers expect. Both Financial-Datasets-style long names
 * (`price_to_earnings_ratio`, `return_on_equity`) and the short aliases the
 * formatter prefers (`pe_ratio`, `roe`) are populated so neither side has to
 * branch on source.
 *
 * NOTE: Valyu reports debt/equity as a percentage (7.255 -> 7.255%), whereas
 * FinDatasets reports it as a raw ratio (~0.14 for NVDA). Divide by 100 so
 * downstream math (e.g. quick screen filters) treats them identically.
 */
export async function fetchValyuKeyRatiosSnapshot(ticker: string): Promise<ApiResponse> {
  const label = `valyu statistics ${ticker}`;
  const query = `${ticker} latest statistics`;
  const result = await searchSingleSource(query, VALYU_SOURCES.statistics, label);
  const content = parseContent<Record<string, unknown>>(result.content, label);
  const valuations = (content.valuations_metrics ?? {}) as Record<string, unknown>;
  const financials = (content.financials ?? {}) as Record<string, unknown>;
  const balance = (financials.balance_sheet ?? {}) as Record<string, unknown>;
  const incomeStmt = (financials.income_statement ?? {}) as Record<string, unknown>;
  const priceSummary = (content.stock_price_summary ?? {}) as Record<string, unknown>;
  const dividends = (content.dividends_and_splits ?? {}) as Record<string, unknown>;

  const debtToEquityPct = num(balance.total_debt_to_equity_mrq);
  const debtToEquity = debtToEquityPct !== undefined ? debtToEquityPct / 100 : undefined;

  const snapshot = {
    ticker: ticker.toUpperCase(),
    market_cap: num(valuations.market_capitalization),
    enterprise_value: num(valuations.enterprise_value),
    pe_ratio: num(valuations.trailing_pe),
    price_to_earnings_ratio: num(valuations.trailing_pe),
    forward_pe: num(valuations.forward_pe),
    peg_ratio: num(valuations.peg_ratio),
    price_to_sales_ratio: num(valuations.price_to_sales_ttm),
    price_to_book_ratio: num(valuations.price_to_book_mrq),
    enterprise_value_to_ebitda_ratio: num(valuations.enterprise_to_ebitda),
    gross_margin: num(financials.gross_margin),
    operating_margin: num(financials.operating_margin),
    net_margin: num(financials.profit_margin),
    roe: num(financials.return_on_equity_ttm),
    return_on_equity: num(financials.return_on_equity_ttm),
    roa: num(financials.return_on_assets_ttm),
    return_on_assets: num(financials.return_on_assets_ttm),
    quarterly_revenue_growth: num(incomeStmt.quarterly_revenue_growth),
    quarterly_earnings_growth: num(incomeStmt.quarterly_earnings_growth_yoy),
    revenue_per_share: num(incomeStmt.revenue_per_share_ttm),
    eps: num(incomeStmt.diluted_eps_ttm),
    ebitda: num(incomeStmt.ebitda),
    current_ratio: num(balance.current_ratio_mrq),
    debt_to_equity: debtToEquity,
    book_value_per_share: num(balance.book_value_per_share_mrq),
    beta: num(priceSummary.beta),
    fifty_two_week_high: num(priceSummary.fifty_two_week_high),
    fifty_two_week_low: num(priceSummary.fifty_two_week_low),
    dividend_yield: num(dividends.trailing_annual_dividend_yield),
    forward_dividend_yield: num(dividends.forward_annual_dividend_yield),
    payout_ratio: num(dividends.payout_ratio),
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

/**
 * Stock OHLCV — historical and snapshot.
 *
 * Valyu returns rows in DESCENDING order (newest first); the rest of the
 * codebase assumes ascending. Always reverse before returning so a
 * downstream `prices[N-1]` reliably means "latest bar".
 *
 * Date format normalisation: Valyu's `datetime` is "YYYY-MM-DD HH:MM:SS"
 * for daily bars (time is zeroed). Slice to YYYY-MM-DD so the field shape
 * matches Yahoo's adapter (`time` is a date-only ISO string).
 *
 * Currency / exchange are surfaced when available so the agent can cite
 * the source feed correctly.
 */

const VALYU_INTERVAL: Record<'day' | 'week' | 'month' | 'year', string> = {
  day: 'daily',
  week: 'weekly',
  month: 'monthly',
  year: 'monthly',
};

interface ValyuStockBar {
  datetime?: string;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
}

function toDateOnly(value: unknown): string | undefined {
  if (!value) return undefined;
  return String(value).slice(0, 10);
}

export async function fetchValyuHistoricalPrices(
  ticker: string,
  startDate: string,
  endDate: string,
  interval: 'day' | 'week' | 'month' | 'year',
): Promise<ApiResponse> {
  const granularity = VALYU_INTERVAL[interval] ?? 'daily';
  const label = `valyu stocks ${ticker} ${startDate}..${endDate}`;
  // Encode start/end into the NL query — Valyu's stocks dataset honours
  // explicit date ranges when present and clamps the response accordingly.
  const query = `${ticker} ${granularity} OHLCV stock price history from ${startDate} to ${endDate}`;
  const result = await searchSingleSource(query, VALYU_SOURCES.stocks, label);
  const rawRows = toRowArray(parseContent(result.content, label)) as ValyuStockBar[];
  if (rawRows.length === 0) {
    throw new Error(`[Valyu] no price data for ${ticker} ${startDate}..${endDate}`);
  }
  // Detect ordering by comparing first vs last datetime. Always emit ascending
  // (oldest first, newest last) regardless of what Valyu sends — chart code
  // downstream relies on prices[N-1] being the latest bar.
  const firstTime = rawRows[0]?.datetime ?? '';
  const lastTime = rawRows[rawRows.length - 1]?.datetime ?? '';
  const ordered = firstTime > lastTime ? [...rawRows].reverse() : rawRows;

  const prices = ordered
    .filter((row) => row.close != null)
    .map((row) => ({
      ticker,
      open: row.open ?? null,
      close: row.close ?? null,
      high: row.high ?? null,
      low: row.low ?? null,
      volume: row.volume ?? null,
      time: toDateOnly(row.datetime),
    }));

  return {
    data: { ticker, prices },
    url: result.url,
  };
}

export async function fetchValyuPriceSnapshot(ticker: string): Promise<ApiResponse> {
  const label = `valyu stock snapshot ${ticker}`;
  // Ask for one recent bar so we get an OHLCV row rather than the scalar
  // "latest price" Valyu sometimes returns for terse queries.
  const query = `${ticker} latest daily OHLCV stock price`;
  const result = await searchSingleSource(query, VALYU_SOURCES.stocks, label);
  const rows = toRowArray(parseContent(result.content, label)) as ValyuStockBar[];
  const meta = (result.metadata ?? {}) as Record<string, unknown>;
  let row: ValyuStockBar | null = null;
  if (rows.length > 0) {
    // Newest-first → row[0]; descending-safe even if Valyu flips.
    const firstTime = rows[0]?.datetime ?? '';
    const lastTime = rows[rows.length - 1]?.datetime ?? '';
    row = firstTime >= lastTime ? rows[0] : rows[rows.length - 1];
  }
  if (!row) {
    // Fallback: content might be a scalar number ("latest price") with no OHLCV
    const scalar = parseContent<unknown>(result.content, label);
    if (typeof scalar === 'number') {
      const snapshot = {
        ticker: ticker.toUpperCase(),
        price: scalar,
        close: scalar,
        time: toDateOnly(meta.timestamp),
        currency: meta.currency,
        exchange: meta.exchange,
      };
      return { data: { snapshot }, url: result.url };
    }
    throw new Error(`[Valyu] no snapshot data for ${ticker}`);
  }
  const snapshot = {
    ticker: ticker.toUpperCase(),
    open: row.open,
    high: row.high,
    low: row.low,
    close: row.close,
    price: row.close,
    volume: row.volume,
    time: toDateOnly(row.datetime),
    currency: meta.currency,
    exchange: meta.exchange,
  };
  return { data: { snapshot }, url: result.url };
}
