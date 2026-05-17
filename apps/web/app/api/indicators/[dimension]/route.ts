import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth/session';
import {
  daysAgoIso,
  fetchValyuMarketMovers,
  getHistoricalPrices,
  todayIso,
} from '../../../../lib/indicators/prices';
import {
  bucketFlow,
  bucketMa,
  bucketMacd,
  bucketVolume,
  computeFlow,
  computeMa,
  computeMacd,
  computeVolume,
  latestSummary,
  type Bucket,
  type PriceBar,
} from '../../../../lib/indicators/math';

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

const DIMENSIONS = new Set(['macd', 'ma', 'volume', 'flow', 'movers']);

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
          return {
            ticker,
            sourceUrl,
            prices,
            indicator: indicator.series,
            bucket: indicator.bucket,
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
  latestExtras: Record<string, number | null>;
}

function computeForDimension(dimension: string, prices: PriceBar[]): ComputeResult {
  const closes = prices.map((p) => p.close);
  if (dimension === 'macd') {
    const rows = computeMacd(closes);
    const last = rows[rows.length - 1] ?? { dif: null, dea: null, hist: null };
    return {
      series: rows,
      bucket: bucketMacd(rows),
      latestExtras: { dif: last.dif, dea: last.dea, hist: last.hist },
    };
  }
  if (dimension === 'ma') {
    const rows = computeMa(closes);
    const last = rows[rows.length - 1] ?? { ma5: null, ma20: null, ma60: null };
    return {
      series: rows,
      bucket: bucketMa(closes, rows),
      latestExtras: { ma5: last.ma5, ma20: last.ma20, ma60: last.ma60 },
    };
  }
  if (dimension === 'volume') {
    const rows = computeVolume(prices);
    const last = rows[rows.length - 1] ?? { avgVol20: null, volRatio: null, direction: 0 };
    return {
      series: rows,
      bucket: bucketVolume(rows),
      latestExtras: { avgVol20: last.avgVol20, volRatio: last.volRatio },
    };
  }
  // flow
  const rows = computeFlow(prices);
  const last = rows[rows.length - 1] ?? { daily: null, cum20: null, cum5: null };
  return {
    series: rows,
    bucket: bucketFlow(rows),
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
