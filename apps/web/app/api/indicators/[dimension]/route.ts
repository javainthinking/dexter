import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth/session';
import {
  daysAgoIso,
  fetchValyuMarketMovers,
  getHistoricalPrices,
  todayIso,
} from '../../../../lib/indicators/prices';
import {
  isLimitOrHaltBar,
  latestSummary,
  maskLimitDaysInTrend,
  type Bucket,
} from '../../../../lib/indicators/math';
import { computeForDimension } from '../../../../lib/indicators/compute';

/**
 * GET /api/indicators/[dimension]?tickers=NVDA,TSLA&days=140
 *
 * dimension ∈ { macd | ma | volume | flow | movers }
 *
 * For ticker-based dimensions (macd / ma / volume / flow) the response is
 * `{ asOf, dimension, tickers: [{ ticker, prices, indicator, latest,
 *    bucket, error?, sourceUrl }] }` — one per ticker, errors are reported
 * inline so a single bad ticker doesn't fail the whole page.
 *
 * For movers the response is `{ asOf, dimension: 'movers', gainers, losers,
 * market, retrievedAt }` — Valyu fetches gainers + losers in parallel.
 */

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const DIMENSIONS = new Set(['macd', 'ma', 'volume', 'flow', 'rsi', 'kdj', 'boll', 'adx', 'movers']);

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ dimension: string }> },
): Promise<Response> {
  const requestId = crypto.randomUUID();
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

    const { dimension } = await context.params;
    if (!DIMENSIONS.has(dimension)) {
      return NextResponse.json({ error: 'unknown_dimension' }, { status: 400 });
    }

    if (dimension === 'movers') {
      return await handleMovers();
    }

    const url = new URL(request.url);
    const rawTickers = url.searchParams.get('tickers') ?? '';
    const tickers = rawTickers
      .split(',')
      .map((t) => t.trim().toUpperCase())
      .filter(Boolean);
    if (tickers.length === 0) {
      return NextResponse.json({ error: 'missing_tickers' }, { status: 400 });
    }
    const daysParam = Number.parseInt(url.searchParams.get('days') ?? '140', 10);
    const days = Number.isFinite(daysParam) ? Math.max(40, Math.min(400, daysParam)) : 140;
    const endDate = todayIso();
    const startDate = daysAgoIso(days);

    const results = await Promise.all(
      tickers.map(async (ticker) => {
        try {
          const { prices, sourceUrl } = await getHistoricalPrices(ticker, startDate, endDate);
          const indicator = computeForDimension(dimension, prices);
          const summary = latestSummary(prices);
          // Limit-up / limit-down / halt defence: when high === low the
          // bar carries no usable range, so every range-aware indicator
          // gets fed degenerate input. Force those days to `neutral`
          // for both the headline bucket (today) and the 5-day trail —
          // applied here so all 8 dimensions get the same protection
          // without per-indicator branches.
          const todayIsLimit = isLimitOrHaltBar(prices[prices.length - 1]);
          const safeBucket: Bucket = todayIsLimit ? 'neutral' : indicator.bucket;
          const safeTrend = maskLimitDaysInTrend(prices, indicator.bucketTrend);
          return {
            ticker,
            sourceUrl,
            prices,
            indicator: indicator.series,
            bucket: safeBucket,
            bucketTrend: safeTrend,
            latest: { ...summary, ...indicator.latestExtras },
          };
        } catch (error) {
          return {
            ticker,
            error: error instanceof Error ? error.message : String(error),
          };
        }
      }),
    );

    return NextResponse.json({
      asOf: endDate,
      dimension,
      startDate,
      endDate,
      tickers: results,
    });
  } catch (err) {
    console.error(
      JSON.stringify({
        level: 'error',
        route: '/api/indicators',
        requestId,
        error: err instanceof Error ? err.message : String(err),
      }),
    );
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

async function handleMovers(): Promise<Response> {
  try {
    const { data } = await fetchValyuMarketMovers();
    return NextResponse.json({
      asOf: todayIso(),
      dimension: 'movers',
      ...data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'movers_failed',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 502 },
    );
  }
}
