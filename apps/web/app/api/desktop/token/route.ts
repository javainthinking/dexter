import { NextResponse, type NextRequest } from 'next/server';
import {
  bearerFrom,
  exchangeDesktopAuthCode,
  revokeDesktopToken,
} from '../../../../lib/auth/desktop';

/**
 * POST   /api/desktop/token  { code, code_verifier } → { token, expires, userId }
 * DELETE /api/desktop/token  (Authorization: Bearer) → revoke (app sign-out)
 *
 * Public route (not in proxy's protected list): the code + PKCE verifier
 * are the credential. See lib/auth/desktop.ts for the full flow.
 */

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest): Promise<Response> {
  let body: { code?: unknown; code_verifier?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }
  if (typeof body.code !== 'string' || typeof body.code_verifier !== 'string') {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }
  try {
    const result = await exchangeDesktopAuthCode(body.code, body.code_verifier);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({
      token: result.token,
      expires: result.expires.toISOString(),
      userId: result.userId,
    });
  } catch (err) {
    console.error('desktop token exchange failed:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest): Promise<Response> {
  const token = bearerFrom(request.headers.get('authorization'));
  if (!token) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  await revokeDesktopToken(token);
  return new Response(null, { status: 204 });
}
