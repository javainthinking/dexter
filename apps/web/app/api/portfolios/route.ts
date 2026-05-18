import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUser } from '../../../lib/auth/session';
import {
  PortfolioHttpError,
  createPortfolio,
  listPortfolios,
} from '../../../lib/portfolios';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(): Promise<Response> {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  const items = await listPortfolios(user.id);
  return NextResponse.json({ portfolios: items });
}

export async function POST(request: NextRequest): Promise<Response> {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  let body: { name?: unknown; description?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }
  if (typeof body.name !== 'string') {
    return NextResponse.json({ error: 'name_required' }, { status: 400 });
  }
  try {
    const row = await createPortfolio(
      user.id,
      body.name,
      typeof body.description === 'string' ? body.description : null,
    );
    return NextResponse.json({ portfolio: row }, { status: 201 });
  } catch (err) {
    return toErrorResponse(err);
  }
}

function toErrorResponse(err: unknown): Response {
  if (err instanceof PortfolioHttpError) {
    return NextResponse.json({ error: err.code, ...err.detail }, { status: err.status });
  }
  console.error('portfolios route error:', err);
  return NextResponse.json({ error: 'server_error' }, { status: 500 });
}
