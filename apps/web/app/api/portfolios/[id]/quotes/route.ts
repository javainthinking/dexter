import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUser } from '../../../../../lib/auth/session';
import { getPortfolio } from '../../../../../lib/portfolios';
import {
  daysAgoIso,
  getHistoricalPrices,
  todayIso,
} from '../../../../../lib/indicators/prices';

/**
 * GET /api/portfolios/[id]/quotes
 *
 * Lightweight per-portfolio quote feed for the holdings list on the
 * /portfolios page. Returns the latest close and prior-trading-day
 * change for every holding. Failures are reported per-ticker so a
 * single bad symbol doesn't blank the whole portfolio row.
 *
 * Why not reuse /api/indicators/[dim]?
 *   - That endpoint computes the full indicator series (MACD/MA/Vol/Flow)
 *     and returns 90+ bars of OHLCV per ticker. For the holdings list we
 *     only need the latest two closes. Calling it from /portfolios would
 *     burn ~10× the CPU and bandwidth for the same display value.
 *   - This endpoint is also auth-gated through getCurrentUser + ownership
 *     check (via getPortfolio), so it can't be used by a different user
 *     to enumerate someone else's portfolio.
 */

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const requestId = crypto.randomUUID();
  const t0 = Date.now();
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
    const { id } = await context.params;
    const portfolio = await getPortfolio(user.id, id);
    if (!portfolio) return NextResponse.json({ error: 'not_found' }, { status: 404 });

    const endDate = todayIso();
    // 10-day window guarantees ≥ 2 trading days of bars even across a
    // long weekend or a holiday-heavy stretch. The chain's daily cache
    // makes the lookback cheap.
    const startDate = daysAgoIso(10);

    const quotes = await Promise.all(
      portfolio.holdings.map(async (h) => {
        try {
          const { prices } = await getHistoricalPrices(h.ticker, startDate, endDate);
          const n = prices.length;
          if (n === 0) {
            return { ticker: h.ticker, error: 'no_data' };
          }
          const last = prices[n - 1];
          const prev = n >= 2 ? prices[n - 2] : null;
          const close = last.close;
          const prevClose = prev?.close ?? null;
          const change =
            close != null && prevClose != null ? close - prevClose : null;
          const changePct =
            change != null && prevClose != null && prevClose !== 0
              ? (change / prevClose) * 100
              : null;
          return {
            ticker: h.ticker,
            asOf: last.time,
            close,
            prevClose,
            change,
            changePct,
          };
        } catch (err) {
          return {
            ticker: h.ticker,
            error: err instanceof Error ? err.message : String(err),
          };
        }
      }),
    );

    const failed = quotes.filter((q) => 'error' in q && q.error);
    if (failed.length > 0) {
      console.warn(
        JSON.stringify({
          level: 'warn',
          route: '/api/portfolios/[id]/quotes',
          requestId,
          userId: user.id,
          portfolioId: id,
          totalHoldings: portfolio.holdings.length,
          failedHoldings: failed.length,
          // Cap tickers list so a huge portfolio doesn't spam logs.
          tickers: failed.slice(0, 20).map((q) => q.ticker),
          msg: 'partial_quote_failure',
        }),
      );
    }
    console.log(
      JSON.stringify({
        level: 'info',
        route: '/api/portfolios/[id]/quotes',
        requestId,
        userId: user.id,
        portfolioId: id,
        holdings: portfolio.holdings.length,
        failed: failed.length,
        elapsedMs: Date.now() - t0,
        msg: 'quotes_served',
      }),
    );
    return NextResponse.json({ asOf: endDate, quotes });
  } catch (err) {
    console.error(
      JSON.stringify({
        level: 'error',
        route: '/api/portfolios/[id]/quotes',
        requestId,
        elapsedMs: Date.now() - t0,
        msg: 'quotes_failed',
        error: err instanceof Error ? err.message : String(err),
      }),
    );
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
