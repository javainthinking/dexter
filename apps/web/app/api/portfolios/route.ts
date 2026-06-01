import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUser } from '../../../lib/auth/session';
import {
  PortfolioHttpError,
  createPortfolio,
  listPortfolios,
  type AddHoldingInput,
} from '../../../lib/portfolios';
import { getUserPlan, getResourceUsage } from '../../../lib/billing';
import { PLAN_LIMITS } from '../../../lib/plans';

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
  let body: { name?: unknown; description?: unknown; holding?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }
  if (typeof body.name !== 'string') {
    return NextResponse.json({ error: 'name_required' }, { status: 400 });
  }
  // Invariant: portfolios are never empty. The POST body must include the
  // first holding; the lib creates portfolio + holding atomically.
  if (!body.holding || typeof body.holding !== 'object') {
    return NextResponse.json({ error: 'holding_required' }, { status: 400 });
  }
  const holdingInput = body.holding as Record<string, unknown>;
  if (typeof holdingInput.ticker !== 'string' || !holdingInput.ticker.trim()) {
    return NextResponse.json({ error: 'ticker_required' }, { status: 400 });
  }
  const weight = parseWeight(holdingInput.weight);
  if (weight === 'invalid') {
    return NextResponse.json({ error: 'invalid_weight' }, { status: 400 });
  }
  // Plan gate: block creating a portfolio past the plan's portfolio cap.
  // 402 carries the plan + numbers so the client can open the upgrade dialog.
  const { plan } = await getUserPlan(user.id);
  const portfolioLimit = PLAN_LIMITS[plan].portfolios;
  if (Number.isFinite(portfolioLimit)) {
    const { portfolios: used } = await getResourceUsage(user.id);
    if (used >= portfolioLimit) {
      return NextResponse.json(
        {
          error: 'quota_exceeded',
          code: 'PORTFOLIOS_LIMIT',
          metric: 'portfolios',
          plan,
          used,
          limit: portfolioLimit,
          message: `Your ${plan} plan includes ${portfolioLimit} portfolio${portfolioLimit === 1 ? '' : 's'}.`,
        },
        { status: 402 },
      );
    }
  }

  const holding: AddHoldingInput = {
    ticker: holdingInput.ticker,
    displayName: typeof holdingInput.displayName === 'string' ? holdingInput.displayName : null,
    exchange: typeof holdingInput.exchange === 'string' ? holdingInput.exchange : null,
    weight,
  };
  try {
    const result = await createPortfolio(
      user.id,
      body.name,
      holding,
      typeof body.description === 'string' ? body.description : null,
    );
    return NextResponse.json(
      { portfolio: result.portfolio, holding: result.holding },
      { status: 201 },
    );
  } catch (err) {
    return toErrorResponse(err);
  }
}

function parseWeight(v: unknown): number | null | 'invalid' {
  if (v === null || v === undefined || v === '') return null;
  const n = typeof v === 'number' ? v : Number(v);
  if (!Number.isFinite(n)) return 'invalid';
  if (n < 0 || n > 100) return 'invalid';
  return n;
}

function toErrorResponse(err: unknown): Response {
  if (err instanceof PortfolioHttpError) {
    return NextResponse.json({ error: err.code, ...err.detail }, { status: err.status });
  }
  console.error('portfolios route error:', err);
  return NextResponse.json({ error: 'server_error' }, { status: 500 });
}
