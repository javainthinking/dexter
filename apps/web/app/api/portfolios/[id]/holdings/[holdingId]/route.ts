import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUser } from '../../../../../../lib/auth/session';
import { PortfolioHttpError, removeHolding, updateHolding } from '../../../../../../lib/portfolios';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string; holdingId: string }> },
): Promise<Response> {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  const { id, holdingId } = await context.params;
  let body: { weight?: unknown; position?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }
  const patch: { weight?: number | null; position?: number } = {};
  if (body.weight !== undefined) {
    if (body.weight === null || body.weight === '') {
      patch.weight = null;
    } else {
      const n = Number(body.weight);
      // Weight is a percentage of the portfolio — bounded to [0, 100].
      // Empty/null means "watchlist only" (no position).
      if (!Number.isFinite(n) || n < 0 || n > 100) {
        return NextResponse.json({ error: 'invalid_weight' }, { status: 400 });
      }
      patch.weight = n;
    }
  }
  if (body.position !== undefined) {
    const n = Number(body.position);
    if (!Number.isInteger(n) || n < 0) {
      return NextResponse.json({ error: 'invalid_position' }, { status: 400 });
    }
    patch.position = n;
  }
  try {
    const row = await updateHolding(user.id, id, holdingId, patch);
    return NextResponse.json({ holding: row });
  } catch (err) {
    if (err instanceof PortfolioHttpError) {
      return NextResponse.json({ error: err.code, ...err.detail }, { status: err.status });
    }
    console.error('update holding error:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string; holdingId: string }> },
): Promise<Response> {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  const { id, holdingId } = await context.params;
  try {
    await removeHolding(user.id, id, holdingId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof PortfolioHttpError) {
      return NextResponse.json({ error: err.code, ...err.detail }, { status: err.status });
    }
    console.error('remove holding error:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
