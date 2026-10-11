import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { randomBytes } from 'node:crypto';
import { getDb } from '@dexter/core/db/client';
import { authSessions } from '@dexter/core/db/schema/auth';
import { redeemEmailCode } from '../../../../../lib/auth/email-code';

/**
 * POST /api/auth/email/verify
 *
 * Body: { email, code }
 *
 * Redeems the 6-digit code (lib/auth/email-code.ts), then writes a
 * `dexter_auth_sessions` row and sets the same cookie NextAuth uses so
 * `getServerSession()` recognises the session regardless of which flow
 * (Google OAuth or email code) created it.
 *
 * Cookie name follows the NextAuth v4 default convention:
 *   - next-auth.session-token             (http)
 *   - __Secure-next-auth.session-token    (https / production)
 */

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const SESSION_TTL_DAYS = 30;

function newSessionToken(): string {
  return randomBytes(32).toString('hex');
}

export async function POST(request: NextRequest): Promise<Response> {
  const requestId = crypto.randomUUID();
  let email: string | undefined;
  try {
    const body = (await request.json().catch(() => ({}))) as {
      email?: string;
      code?: string;
    };
    const result = await redeemEmailCode(body.email, body.code);
    email = result.email;
    if (!result.ok) {
      return NextResponse.json({ error: result.error, message: result.message }, { status: result.status });
    }
    const { userId, newUser } = result;

    // Create the NextAuth-compatible session row.
    const sessionToken = newSessionToken();
    const expires = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
    await getDb().insert(authSessions).values({ sessionToken, userId, expires });

    // Set the cookie. NextAuth uses different names in http vs https; both
    // are accepted by getServerSession because it tries every known name.
    const jar = await cookies();
    const cookieName =
      process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token';
    jar.set({
      name: cookieName,
      value: sessionToken,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      expires,
    });

    console.log(
      JSON.stringify({
        level: 'info',
        route: '/api/auth/email/verify',
        requestId,
        email,
        userId,
        msg: 'signed_in',
        newUser,
      }),
    );

    return NextResponse.json({ ok: true, userId });
  } catch (err) {
    console.error(
      JSON.stringify({
        level: 'error',
        route: '/api/auth/email/verify',
        requestId,
        email,
        msg: 'unexpected_error',
        error: err instanceof Error ? err.message : String(err),
      }),
    );
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
