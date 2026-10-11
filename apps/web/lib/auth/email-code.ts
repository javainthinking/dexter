import { and, eq } from 'drizzle-orm';
import { getDb } from '@dexter/core/db/client';
import { users, verificationTokens } from '@dexter/core/db/schema/auth';

/**
 * 6-digit email code redemption shared by the web sign-in
 * (/api/auth/email/verify, sets the session cookie) and the desktop app
 * (/api/desktop/email/verify, returns a Bearer token).
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type EmailCodeResult =
  | { ok: true; email: string; userId: string; newUser: boolean }
  | { ok: false; status: 400; error: 'invalid_input' | 'invalid_code' | 'expired_code'; message: string; email?: string };

/**
 * Validates the code in `dexter_verification_tokens` (single-use), then
 * finds or creates the `dexter_users` row for the email.
 */
export async function redeemEmailCode(rawEmail: unknown, rawCode: unknown): Promise<EmailCodeResult> {
  const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : undefined;
  const code = typeof rawCode === 'string' ? rawCode.trim() : undefined;
  if (!email || !EMAIL_RE.test(email) || !code || !/^\d{6}$/.test(code)) {
    return { ok: false, status: 400, error: 'invalid_input', message: 'Provide a valid email and 6-digit code.', email };
  }

  const db = getDb();
  const match = and(eq(verificationTokens.identifier, email), eq(verificationTokens.token, code));
  const [token] = await db.select().from(verificationTokens).where(match).limit(1);
  if (!token) {
    return { ok: false, status: 400, error: 'invalid_code', message: 'That code is not valid for this email.', email };
  }
  // Single-use: drop the token now so it can't be replayed (also clears an expired one).
  await db.delete(verificationTokens).where(match);
  if (token.expires.getTime() <= Date.now()) {
    return { ok: false, status: 400, error: 'expired_code', message: 'That code has expired. Request a new one.', email };
  }

  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing) {
    if (!existing.emailVerified) {
      await db.update(users).set({ emailVerified: new Date(), updatedAt: new Date() }).where(eq(users.id, existing.id));
    }
    return { ok: true, email, userId: existing.id, newUser: false };
  }
  const [created] = await db.insert(users).values({ email, emailVerified: new Date() }).returning({ id: users.id });
  return { ok: true, email, userId: created.id, newUser: true };
}
