import { NextResponse, type NextRequest } from 'next/server';
import { createDesktopSession } from '../../../../../lib/auth/desktop';
import { redeemEmailCode } from '../../../../../lib/auth/email-code';

/**
 * POST /api/desktop/email/verify — in-app sign-in for the desktop client.
 *
 * Body: { email, code } (code from POST /api/auth/email/send). Same
 * redemption as the web flow, but instead of a cookie it returns a desktop
 * Bearer token: `{ token, expires, userId }`. Public route.
 */

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest): Promise<Response> {
  const body = (await request.json().catch(() => ({}))) as { email?: unknown; code?: unknown };
  try {
    const result = await redeemEmailCode(body.email, body.code);
    if (!result.ok) {
      return NextResponse.json({ error: result.error, message: result.message }, { status: result.status });
    }
    const { token, expires } = await createDesktopSession(result.userId);
    return NextResponse.json({ token, expires: expires.toISOString(), userId: result.userId });
  } catch (err) {
    console.error(
      JSON.stringify({
        level: 'error',
        route: '/api/desktop/email/verify',
        msg: 'unexpected_error',
        error: err instanceof Error ? err.message : String(err),
      }),
    );
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
