import 'server-only';

import { api, withFallbackChain } from '@dexter/core/tools/finance/api';
import {
  fetchValyuHistoricalPrices,
  fetchValyuMarketMovers,
} from '@dexter/core/tools/finance/valyu';
import { fetchYahooHistoricalPrices } from '@dexter/core/tools/finance/yahoo';
import type { PriceBar } from './math';

/**
 * Server-side OHLCV fetcher used by the /indicators page.
 *
 * Hits the same 3-source chain the agent's get_stock_prices tool uses
 * (FinDatasets -> Valyu -> Yahoo) so the web indicators see the same data
 * the CLI dashboards do. Returns an ASCENDING price array — chart code
 * downstream relies on prices[N-1] being the latest bar.
 *
 * The chain throws when every source fails; the caller is expected to
 * convert that into a per-ticker error in the API response so a single
 * bad ticker doesn't blow up the whole page.
 */
export async function getHistoricalPrices(
  ticker: string,
  startDate: string,
  endDate: string,
): Promise<{ ticker: string; prices: PriceBar[]; sourceUrl: string }> {
  const params = {
    ticker: ticker.toUpperCase(),
    interval: 'day',
    start_date: startDate,
    end_date: endDate,
  };
  const endDateObj = new Date(`${endDate}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { data, url } = await withFallbackChain(
    `web/prices ${ticker} ${startDate}..${endDate}`,
    [
      { name: 'financial-datasets', run: () => api.get('/prices/', params, { cacheable: endDateObj < today }) },
      { name: 'valyu',              run: () => fetchValyuHistoricalPrices(ticker, startDate, endDate, 'day') },
      { name: 'yahoo',              run: () => fetchYahooHistoricalPrices(ticker, startDate, endDate, 'day') },
    ],
  );
  const raw = Array.isArray(data.prices) ? (data.prices as Array<Record<string, unknown>>) : [];
  // Defensive resort: chains should already be ascending, but if Yahoo or a
  // future source flips we'd rather pay an O(n log n) tax than render a
  // chart with the x-axis reversed.
  const sorted = [...raw].sort((a, b) => String(a.time ?? '').localeCompare(String(b.time ?? '')));
  const prices: PriceBar[] = sorted.map((row) => ({
    time: String(row.time ?? '').slice(0, 10),
    open: numOrNull(row.open),
    high: numOrNull(row.high),
    low: numOrNull(row.low),
    close: numOrNull(row.close),
    volume: numOrNull(row.volume),
  }));
  return { ticker: ticker.toUpperCase(), prices, sourceUrl: url };
}

function numOrNull(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/**
 * Date helpers for the indicator pages — match the same convention used by
 * the CLI dashboard prompts: 140 calendar days back ≈ 90 trading bars.
 */
export function isoDate(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function todayIso(): string {
  return isoDate(new Date());
}

export function daysAgoIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return isoDate(d);
}

/** Re-export movers for the API route. */
export { fetchValyuMarketMovers };
