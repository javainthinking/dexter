import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth/session';
import { getUserPlan, turnQuotaBlock } from '../../../../lib/billing';
import { startDesktopTurn } from '../../../../lib/desktop-turns';

/**
 * POST /api/desktop/turns  { agentSessionId? } → { turnId }
 *
 * Admits a desktop chat turn through the same quota gate as web's
 * /api/agent (402 with the same body, so the shared chat UI shows the same
 * upgrade prompt). The gateway only serves LLM calls inside an admitted turn.
 */

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const SESSION_RE = /^[A-Za-z0-9_-]{1,128}$/;

export async function POST(request: NextRequest): Promise<Response> {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as { agentSessionId?: unknown };
  const agentSessionId =
    typeof body.agentSessionId === 'string' && SESSION_RE.test(body.agentSessionId) ? body.agentSessionId : undefined;

  const { plan } = await getUserPlan(user.id);
  const blocked = await turnQuotaBlock(user.id, plan);
  if (blocked) return NextResponse.json(blocked, { status: 402 });

  return NextResponse.json({ turnId: await startDesktopTurn(user.id, agentSessionId) });
}
