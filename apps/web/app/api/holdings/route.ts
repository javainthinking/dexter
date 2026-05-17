import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUser } from '../../../lib/auth/session';
import { getHoldings, normaliseTickers, saveHoldings } from '../../../lib/holdings';

/**
 * Holdings management endpoints.
 *
 * GET /api/holdings
 *   → { tickers: string[], updatedAt: string | null }
 *
 * PUT /api/holdings  (body: { tickers: string[] })
 *   → { tickers, updatedAt }
 *   Writes the new record then forgets the prior one. Safe to call with
 *   an empty list to clear holdings.
 */

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(): Promise<Response> {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  const holdings = await getHoldings(user.id);
  return NextResponse.json({
    tickers: holdings.tickers,
    updatedAt: holdings.updatedAt,
  });
}

export async function PUT(request: NextRequest): Promise<Response> {
  const requestId = crypto.randomUUID();
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
    const body = (await request.json().catch(() => null)) as { tickers?: unknown } | null;
    if (!body || !Array.isArray(body.tickers)) {
      return NextResponse.json({ error: 'missing_tickers' }, { status: 400 });
    }
    const tickers = normaliseTickers(body.tickers as string[]);
    if (tickers.length > 50) {
      return NextResponse.json({ error: 'too_many_tickers', max: 50 }, { status: 400 });
    }
    const saved = await saveHoldings(user.id, tickers);
    return NextResponse.json({ tickers: saved.tickers, updatedAt: saved.updatedAt });
  } catch (err) {
    console.error(
      JSON.stringify({
        level: 'error',
        route: '/api/holdings',
        requestId,
        msg: 'save_failed',
        error: err instanceof Error ? err.message : String(err),
      }),
    );
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
