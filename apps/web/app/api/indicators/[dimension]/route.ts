import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth/session';
import {
  daysAgoIso,
  fetchValyuMarketMovers,
  getHistoricalPrices,
  todayIso,
} from '../../../../lib/indicators/prices';
import {
  bucketAdx,
  bucketBoll,
  bucketBollTrend,
  bucketFlow,
  bucketKdj,
  bucketMa,
  bucketMaTrend,
  bucketMacd,
  bucketRsi,
  bucketTrend,
  bucketVolume,
  computeAdx,
  computeBoll,
  computeFlow,
  computeKdj,
  computeMa,
  computeMacd,
  computeRsi,
  computeVolume,
  isLimitOrHaltBar,
  latestSummary,
  maskLimitDaysInTrend,
  type Bucket,
  type BucketSample,
  type PriceBar,
} from '../../../../lib/indicators/math';

/**
 * Trailing window for the per-card bucket sparkline. 5 days matches
 * "trading week" mental model and is the maximum the badge can show
 * without crowding the bucket-label text. Tuneable here — every
 * dimension uses the same lookback so the trail is comparable across
 * tabs at a glance.
 */
const BUCKET_TREND_LOOKBACK = 5;

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

interface ComputeResult {
  series: unknown[];
  bucket: Bucket;
  bucketTrend: BucketSample[];
  latestExtras: Record<string, number | null>;
}

function computeForDimension(dimension: string, prices: PriceBar[]): ComputeResult {
  const closes = prices.map((p) => p.close);
  const times = prices.map((p) => p.time);
  if (dimension === 'macd') {
    const rows = computeMacd(closes);
    const last = rows[rows.length - 1] ?? { dif: null, dea: null, hist: null };
    return {
      series: rows,
      bucket: bucketMacd(rows),
      bucketTrend: bucketTrend(rows, bucketMacd, times, BUCKET_TREND_LOOKBACK),
      latestExtras: { dif: last.dif, dea: last.dea, hist: last.hist },
    };
  }
  if (dimension === 'ma') {
    const rows = computeMa(closes);
    const last = rows[rows.length - 1] ?? { ma5: null, ma20: null, ma60: null };
    return {
      series: rows,
      bucket: bucketMa(closes, rows),
      bucketTrend: bucketMaTrend(closes, rows, times, BUCKET_TREND_LOOKBACK),
      latestExtras: { ma5: last.ma5, ma20: last.ma20, ma60: last.ma60 },
    };
  }
  if (dimension === 'volume') {
    const rows = computeVolume(prices);
    const last = rows[rows.length - 1] ?? { avgVol20: null, volRatio: null, direction: 0 };
    return {
      series: rows,
      bucket: bucketVolume(rows),
      bucketTrend: bucketTrend(rows, bucketVolume, times, BUCKET_TREND_LOOKBACK),
      latestExtras: { avgVol20: last.avgVol20, volRatio: last.volRatio },
    };
  }
  if (dimension === 'rsi') {
    const rows = computeRsi(closes);
    const last = rows[rows.length - 1] ?? { rsi: null };
    return {
      series: rows,
      bucket: bucketRsi(rows),
      bucketTrend: bucketTrend(rows, bucketRsi, times, BUCKET_TREND_LOOKBACK),
      latestExtras: { rsi: last.rsi },
    };
  }
  if (dimension === 'kdj') {
    const rows = computeKdj(prices);
    const last = rows[rows.length - 1] ?? { k: null, d: null, j: null };
    return {
      series: rows,
      bucket: bucketKdj(rows),
      bucketTrend: bucketTrend(rows, bucketKdj, times, BUCKET_TREND_LOOKBACK),
      latestExtras: { k: last.k, d: last.d, j: last.j },
    };
  }
  if (dimension === 'boll') {
    const rows = computeBoll(closes);
    const last = rows[rows.length - 1] ?? { mid: null, upper: null, lower: null, bandwidth: null };
    return {
      series: rows,
      bucket: bucketBoll(closes, rows),
      bucketTrend: bucketBollTrend(closes, rows, times, BUCKET_TREND_LOOKBACK),
      latestExtras: { mid: last.mid, upper: last.upper, lower: last.lower, bandwidth: last.bandwidth },
    };
  }
  if (dimension === 'adx') {
    const rows = computeAdx(prices);
    const last = rows[rows.length - 1] ?? { plusDi: null, minusDi: null, adx: null };
    return {
      series: rows,
      bucket: bucketAdx(rows),
      bucketTrend: bucketTrend(rows, bucketAdx, times, BUCKET_TREND_LOOKBACK),
      latestExtras: { plusDi: last.plusDi, minusDi: last.minusDi, adx: last.adx },
    };
  }
  // flow
  const rows = computeFlow(prices);
  const last = rows[rows.length - 1] ?? { daily: null, cum20: null, cum5: null };
  return {
    series: rows,
    bucket: bucketFlow(rows),
    bucketTrend: bucketTrend(rows, bucketFlow, times, BUCKET_TREND_LOOKBACK),
    latestExtras: { dailyFlow: last.daily, cum20: last.cum20, cum5: last.cum5 },
  };
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
