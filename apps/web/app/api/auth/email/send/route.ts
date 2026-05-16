import { NextResponse, type NextRequest } from 'next/server';
import { and, eq, gt } from 'drizzle-orm';
import { getDb } from '@dexter/core/db/client';
import { verificationTokens } from '@dexter/core/db/schema/auth';
import { sendSignInCodeEmail } from '../../../../../lib/auth/email';

/**
 * POST /api/auth/email/send
 *
 * Body: { email }
 *
 * Generates a 6-digit code, stores it in `dexter_verification_tokens`
 * (identifier = email, token = code), throttles to one fresh code per
 * minute per email, and sends the email via nodemailer. If SMTP is not
 * configured we still create the token in dev and surface the code in
 * the response so testing works without a mail server.
 */

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const CODE_TTL_MINUTES = 10;
const THROTTLE_SECONDS = 60;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest): Promise<Response> {
  const requestId = crypto.randomUUID();
  let email: string | undefined;
  try {
    const body = (await request.json().catch(() => ({}))) as { email?: string };
    email = body.email?.trim().toLowerCase();
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: 'invalid_email', message: 'Please enter a valid email address.' },
        { status: 400 },
      );
    }

    const db = getDb();
    const now = new Date();
    const throttleCutoff = new Date(now.getTime() - THROTTLE_SECONDS * 1000 * 60);
    // Throttle window is short for the *unexpired* tokens — if there's an
    // unused, recent token we say "wait". We use `expires` as a proxy
    // since we don't have created_at on the standard NextAuth table.
    const existing = await db
      .select()
      .from(verificationTokens)
      .where(
        and(
          eq(verificationTokens.identifier, email),
          gt(
            verificationTokens.expires,
            new Date(now.getTime() + (CODE_TTL_MINUTES - 1) * 60 * 1000),
          ),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      const remaining = Math.max(
        0,
        Math.ceil(
          (existing[0].expires.getTime() - (CODE_TTL_MINUTES - 1) * 60 * 1000 - now.getTime()) /
            1000,
        ),
      );
      if (remaining > 0) {
        return NextResponse.json(
          {
            error: 'throttled',
            message: `Please wait ${remaining}s before requesting another code.`,
            retryAfter: remaining,
          },
          { status: 429 },
        );
      }
    }

    // Wipe any earlier tokens for this email so only the latest works.
    await db.delete(verificationTokens).where(eq(verificationTokens.identifier, email));

    const code = generateCode();
    const expires = new Date(now.getTime() + CODE_TTL_MINUTES * 60 * 1000);
    await db.insert(verificationTokens).values({ identifier: email, token: code, expires });

    let devCode: string | undefined;
    try {
      const result = await sendSignInCodeEmail({
        to: email,
        code,
        expiresInMinutes: CODE_TTL_MINUTES,
      });
      if (result.skipped) {
        // No SMTP configured — fall back to returning the code in dev/preview
        // so the user can still complete sign-in.
        if (process.env.NODE_ENV !== 'production') devCode = code;
      }
    } catch (err) {
      console.error(
        JSON.stringify({
          level: 'error',
          route: '/api/auth/email/send',
          requestId,
          email,
          msg: 'email_send_failed',
          error: err instanceof Error ? err.message : String(err),
        }),
      );
      if (process.env.NODE_ENV !== 'production') devCode = code;
    }

    console.log(
      JSON.stringify({
        level: 'info',
        route: '/api/auth/email/send',
        requestId,
        email,
        msg: 'code_sent',
        devMode: !!devCode,
      }),
    );

    return NextResponse.json({
      ok: true,
      expiresInSeconds: CODE_TTL_MINUTES * 60,
      ...(devCode ? { devCode } : {}),
    });
  } catch (err) {
    console.error(
      JSON.stringify({
        level: 'error',
        route: '/api/auth/email/send',
        requestId,
        email,
        msg: 'unexpected_error',
        error: err instanceof Error ? err.message : String(err),
      }),
    );
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
