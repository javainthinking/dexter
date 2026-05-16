import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { randomBytes } from 'node:crypto';
import { and, eq } from 'drizzle-orm';
import { getDb } from '@dexter/core/db/client';
import {
  users,
  authSessions,
  verificationTokens,
} from '@dexter/core/db/schema/auth';

/**
 * POST /api/auth/email/verify
 *
 * Body: { email, code }
 *
 * Validates the 6-digit code in `dexter_verification_tokens`, creates the
 * `dexter_users` row if it doesn't already exist, then writes a
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
    email = body.email?.trim().toLowerCase();
    const code = body.code?.trim();
    if (!email || !EMAIL_RE.test(email) || !code || !/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: 'invalid_input', message: 'Provide a valid email and 6-digit code.' },
        { status: 400 },
      );
    }

    const db = getDb();
    const [token] = await db
      .select()
      .from(verificationTokens)
      .where(
        and(eq(verificationTokens.identifier, email), eq(verificationTokens.token, code)),
      )
      .limit(1);

    if (!token) {
      return NextResponse.json(
        { error: 'invalid_code', message: 'That code is not valid for this email.' },
        { status: 400 },
      );
    }

    if (token.expires.getTime() <= Date.now()) {
      await db
        .delete(verificationTokens)
        .where(
          and(eq(verificationTokens.identifier, email), eq(verificationTokens.token, code)),
        );
      return NextResponse.json(
        { error: 'expired_code', message: 'That code has expired. Request a new one.' },
        { status: 400 },
      );
    }

    // Single-use: drop the token now so it can't be replayed.
    await db
      .delete(verificationTokens)
      .where(
        and(eq(verificationTokens.identifier, email), eq(verificationTokens.token, code)),
      );

    // Find or create the user.
    const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    let userId: string;
    if (existing) {
      if (!existing.emailVerified) {
        await db
          .update(users)
          .set({ emailVerified: new Date(), updatedAt: new Date() })
          .where(eq(users.id, existing.id));
      }
      userId = existing.id;
    } else {
      const [created] = await db
        .insert(users)
        .values({ email, emailVerified: new Date() })
        .returning({ id: users.id });
      userId = created.id;
    }

    // Create the NextAuth-compatible session row.
    const sessionToken = newSessionToken();
    const expires = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
    await db.insert(authSessions).values({ sessionToken, userId, expires });

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
        newUser: !existing,
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
