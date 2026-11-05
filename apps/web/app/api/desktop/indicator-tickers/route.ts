import { NextResponse, type NextRequest } from 'next/server';
import { pickIndicatorTickers } from '@dexter/core/agent/indicator-cards';
import { DEFAULT_MODEL } from '@dexter/core/model/llm';
import { getCurrentUser } from '../../../../lib/auth/session';

/**
 * POST /api/desktop/indicator-tickers  { query, answer } → { tickers }
 *
 * The desktop app runs its chat agent locally, so the step web's
 * /api/agent does after each answer (pick the stocks the turn is about for
 * the inline indicator cards) is done here on request. The app appends the
 * tickers as an ```indicators block, which the shared chat UI renders.
 */

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MAX_QUERY = 4_000;
const MAX_ANSWER = 20_000;

export async function POST(request: NextRequest): Promise<Response> {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as { query?: unknown; answer?: unknown };
  if (typeof body.query !== 'string' || typeof body.answer !== 'string') {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }
  const tickers = await pickIndicatorTickers(
    body.query.slice(0, MAX_QUERY),
    body.answer.slice(0, MAX_ANSWER),
    DEFAULT_MODEL,
  );
  return NextResponse.json({ tickers });
}
