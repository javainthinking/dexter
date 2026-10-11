import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUser } from '../../../../../../../lib/auth/session';
import { claimDesktopTurn, meterDesktopTurn } from '../../../../../../../lib/desktop-turns';
import { MEMORYLAKE_LLM_BASE_URL } from '@dexter/core/providers';

/**
 * POST /api/desktop/llm/v1/chat/completions
 *
 * OpenAI-compatible LLM gateway for the desktop agent. The desktop never
 * holds provider keys: it sends its bearer token, we gate on the user's
 * turn, swap the public model alias for the upstream model, and stream the
 * upstream response straight back.
 *
 * Upstream is the MemoryLake router (OpenAI-compatible, same as the web
 * agent — see src/providers.ts), keyed by MEMORYLAKE_API_KEY.
 *   DESKTOP_LLM_MODEL     (default gpt-5.5) — what `analyst-default` maps to
 *
 * Quota works as on web: the desktop admits each chat turn through
 * POST /api/desktop/turns (the same gate as /api/agent), and a call here
 * must belong to an open admitted turn, matched by OpenCode's
 * x-opencode-session-id. The turn's first successful call counts it as one
 * conversation (lib/desktop-turns.ts).
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

  const agentSessionId = request.headers.get('x-opencode-session-id') ?? '';
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(agentSessionId)) {
    return NextResponse.json({ error: { message: 'missing x-opencode-session-id' } }, { status: 400 });
  }
  const turnId = await claimDesktopTurn(user.id, agentSessionId);
  if (!turnId) {
    return NextResponse.json({ error: { message: 'no_admitted_turn', code: 'turn_required' } }, { status: 409 });
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

  if (upstream.ok) await meterDesktopTurn(user.id, turnId);

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'content-type': upstream.headers.get('content-type') ?? 'application/json',
      'cache-control': 'no-store',
    },
  });
}
