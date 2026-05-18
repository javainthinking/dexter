import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth/session';
import {
  PortfolioHttpError,
  deletePortfolio,
  getPortfolio,
  updatePortfolio,
} from '../../../../lib/portfolios';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  const { id } = await context.params;
  const portfolio = await getPortfolio(user.id, id);
  if (!portfolio) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json({ portfolio });
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  const { id } = await context.params;
  let body: { name?: unknown; description?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }
  try {
    const row = await updatePortfolio(user.id, id, {
      name: typeof body.name === 'string' ? body.name : undefined,
      description: body.description === undefined ? undefined : (body.description as string | null),
    });
    return NextResponse.json({ portfolio: row });
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  const { id } = await context.params;
  try {
    await deletePortfolio(user.id, id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return toErrorResponse(err);
  }
}

function toErrorResponse(err: unknown): Response {
  if (err instanceof PortfolioHttpError) {
    return NextResponse.json({ error: err.code, ...err.detail }, { status: err.status });
  }
  console.error('portfolio [id] route error:', err);
  return NextResponse.json({ error: 'server_error' }, { status: 500 });
}
