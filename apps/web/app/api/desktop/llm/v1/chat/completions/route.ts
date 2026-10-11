import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUser } from '../../../../../../../lib/auth/session';
import { checkQuota, getUserPlan } from '../../../../../../../lib/billing';
import { MEMORYLAKE_LLM_BASE_URL } from '@dexter/core/providers';

/**
 * POST /api/desktop/llm/v1/chat/completions
 *
 * OpenAI-compatible LLM gateway for the desktop agent. The desktop never
 * holds provider keys: it sends its bearer token, we gate on the user's
 * plan, swap the public model alias for the upstream model, and stream the
 * upstream response straight back.
 *
 * Upstream is the MemoryLake router (OpenAI-compatible, same as the web
 * agent — see src/providers.ts), keyed by MEMORYLAKE_API_KEY.
 *   DESKTOP_LLM_MODEL     (default gpt-5.5) — what `analyst-default` maps to
 *
 * POC limits: quota is checked (read-only) against the monthly
 * conversation allowance but not incremented — metering per desktop
 * conversation is a follow-up once the desktop sends a conversation id.
 */

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 300;

const MODEL_ALIASES: Record<string, () => string> = {
  'analyst-default': () => process.env.DESKTOP_LLM_MODEL || 'gpt-5.5',
};

export async function POST(request: NextRequest): Promise<Response> {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: { message: 'unauthenticated' } }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: { message: 'invalid_body' } }, { status: 400 });
  }
  const alias = typeof body.model === 'string' ? body.model : '';
  const resolve = MODEL_ALIASES[alias];
  if (!resolve) {
    return NextResponse.json({ error: { message: `unknown model: ${alias}` } }, { status: 400 });
  }

  const { plan } = await getUserPlan(user.id);
  const quota = await checkQuota(user.id, plan, 'conversations');
  if (!quota.allowed) {
    return NextResponse.json(
      {
        error: {
          message: `You've used all ${quota.limit} conversations on the ${plan} plan this month.`,
          code: 'quota_exceeded',
        },
      },
      { status: 402 },
    );
  }

  const apiKey = process.env.MEMORYLAKE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: { message: 'gateway_not_configured' } }, { status: 503 });
  }

  const upstream = await fetch(`${MEMORYLAKE_LLM_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ ...body, model: resolve(), user: user.id }),
    signal: request.signal,
  });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'content-type': upstream.headers.get('content-type') ?? 'application/json',
      'cache-control': 'no-store',
    },
  });
}
