import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUser } from '../../../../../../lib/auth/session';
import { completeDesktopTurn } from '../../../../../../lib/desktop-turns';

/** POST /api/desktop/turns/<id>/complete — the desktop's turn ended (done, error or stopped). */

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  const { id } = await context.params;
  if (!UUID_RE.test(id)) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  await completeDesktopTurn(user.id, id);
  return NextResponse.json({ ok: true });
}
