import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUser } from '../../../../../lib/auth/session';
import { PortfolioHttpError, addHolding } from '../../../../../lib/portfolios';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  const { id } = await context.params;
  let body: {
    ticker?: unknown;
    displayName?: unknown;
    exchange?: unknown;
    weight?: unknown;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }
  if (typeof body.ticker !== 'string' || !body.ticker.trim()) {
    return NextResponse.json({ error: 'ticker_required' }, { status: 400 });
  }
  const weight = parseWeight(body.weight);
  if (weight === 'invalid') {
    return NextResponse.json({ error: 'invalid_weight' }, { status: 400 });
  }
  try {
    const row = await addHolding(user.id, id, {
      ticker: body.ticker,
      displayName: typeof body.displayName === 'string' ? body.displayName : null,
      exchange: typeof body.exchange === 'string' ? body.exchange : null,
      weight,
    });
    return NextResponse.json({ holding: row }, { status: 201 });
  } catch (err) {
    if (err instanceof PortfolioHttpError) {
      return NextResponse.json({ error: err.code, ...err.detail }, { status: err.status });
    }
    console.error('add holding error:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

/**
 * Accept null, undefined, "", or a numeric string. Empty means
 * "watchlist only — no position size", which is a first-class state per
 * the product spec. Range is 0–100 because the field represents a
 * percentage of the portfolio; anything outside that almost certainly
 * indicates the user typed the wrong unit (e.g. a dollar amount).
 */
function parseWeight(v: unknown): number | null | 'invalid' {
  if (v === null || v === undefined || v === '') return null;
  const n = typeof v === 'number' ? v : Number(v);
  if (!Number.isFinite(n)) return 'invalid';
  if (n < 0 || n > 100) return 'invalid';
  return n;
}
