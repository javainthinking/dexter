import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUser } from '../../../../../lib/auth/session';
import { searchSymbols } from '../../../../../lib/symbol-search';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/portfolios/symbols/search?q=<query>&limit=<n>
 *
 * Auth-gated even though the underlying data is public — keeps the
 * endpoint from being scraped by random clients and lets us add per-user
 * rate limiting later without churn.
 */
export async function GET(request: NextRequest): Promise<Response> {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  const url = new URL(request.url);
  const q = (url.searchParams.get('q') ?? '').trim();
  if (!q) return NextResponse.json({ results: [] });
  const limit = Math.min(20, Math.max(1, Number(url.searchParams.get('limit') ?? 8)));
  try {
    const results = await searchSymbols(q, limit);
    return NextResponse.json({ results });
  } catch (err) {
    console.error('symbol search error:', err);
    return NextResponse.json({ results: [], error: 'search_failed' }, { status: 200 });
  }
}
