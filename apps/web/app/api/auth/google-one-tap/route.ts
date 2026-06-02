import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { randomBytes } from 'node:crypto';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { eq } from 'drizzle-orm';
import { getDb } from '@dexter/core/db/client';
import { users, authSessions } from '@dexter/core/db/schema/auth';

/**
 * POST /api/auth/google-one-tap
 *
 * Body: { credential }  — the ID token (JWT) returned by Google Identity
 * Services One Tap.
 *
 * We verify the token's signature against Google's published JWKS and check
 * issuer + audience + expiry (jose does exp for us), then find-or-create the
 * user and mint a NextAuth-compatible session — exactly like the email-code
 * flow in /api/auth/email/verify, so getServerSession() recognises it no
 * matter which path created the session.
 *
 * Why this is safe without a separate CSRF token: the credential is a
 * short-lived JWT cryptographically bound to OUR client id (the `aud`
 * claim). A token minted for any other site fails the audience check, and
 * it can't be forged without Google's signing key.
 */

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const SESSION_TTL_DAYS = 30;

// Module-scope so the JWKS is fetched once and cached across invocations.
const GOOGLE_JWKS = createRemoteJWKSet(
  new URL('https://www.googleapis.com/oauth2/v3/certs'),
);

function newSessionToken(): string {
  return randomBytes(32).toString('hex');
}

export async function POST(request: NextRequest): Promise<Response> {
  const requestId = crypto.randomUUID();
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: 'not_configured' }, { status: 503 });
  }

  let email: string | undefined;
  try {
    const body = (await request.json().catch(() => ({}))) as { credential?: string };
    const credential = body.credential?.trim();
    if (!credential) {
      return NextResponse.json({ error: 'missing_credential' }, { status: 400 });
    }

    // Verify signature, issuer, audience and expiry against Google.
    let payload;
    try {
      ({ payload } = await jwtVerify(credential, GOOGLE_JWKS, {
        issuer: ['https://accounts.google.com', 'accounts.google.com'],
        audience: clientId,
      }));
    } catch {
      return NextResponse.json({ error: 'invalid_token' }, { status: 401 });
    }

    const emailClaim = typeof payload.email === 'string' ? payload.email.toLowerCase() : '';
    const emailVerified = payload.email_verified === true || payload.email_verified === 'true';
    if (!emailClaim || !emailVerified) {
      return NextResponse.json({ error: 'email_unverified' }, { status: 401 });
    }
    email = emailClaim;
    const name = typeof payload.name === 'string' ? payload.name : null;
    const picture = typeof payload.picture === 'string' ? payload.picture : null;

    const db = getDb();

    // Find or create the user. Backfill name/image on first One Tap login so
    // accounts created via the email-code flow get their Google profile.
    const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    let userId: string;
    if (existing) {
      userId = existing.id;
      await db
        .update(users)
        .set({
          emailVerified: existing.emailVerified ?? new Date(),
          name: existing.name ?? name,
          image: existing.image ?? picture,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existing.id));
    } else {
      const [created] = await db
        .insert(users)
        .values({ email, emailVerified: new Date(), name, image: picture })
        .returning({ id: users.id });
      userId = created.id;
    }

    // Mint the NextAuth database session + cookie.
    const sessionToken = newSessionToken();
    const expires = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
    await db.insert(authSessions).values({ sessionToken, userId, expires });

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
        route: '/api/auth/google-one-tap',
        requestId,
        email,
        userId,
        newUser: !existing,
        msg: 'signed_in',
      }),
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(
      JSON.stringify({
        level: 'error',
        route: '/api/auth/google-one-tap',
        requestId,
        email,
        msg: 'unexpected_error',
        error: err instanceof Error ? err.message : String(err),
      }),
    );
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
