import 'server-only';
import { createHash, randomBytes } from 'node:crypto';
import { and, eq, gt, like } from 'drizzle-orm';
import { getDb } from '@dexter/core/db/client';
import { users, authSessions, verificationTokens } from '@dexter/core/db/schema/auth';
import type { SessionUser } from './session';

/**
 * Desktop app sign-in (RFC 8252 + PKCE S256).
 *
 *   1. Desktop opens /desktop/authorize?state&code_challenge in the system
 *      browser. The page is behind the normal web sign-in.
 *   2. The page mints a one-time code bound to (userId, code_challenge) and
 *      hands it back via pickskill://auth/callback?code&state.
 *   3. Desktop POSTs /api/desktop/token { code, code_verifier } and receives
 *      a bearer token.
 *
 * Storage reuses existing NextAuth tables, so no migration is needed:
 *   - one-time codes live in dexter_verification_tokens with identifier
 *     `desktop:<userId>:<code_challenge>` and token = sha256(code);
 *   - the bearer token IS a dexter_auth_sessions row, so revocation and
 *     expiry behave exactly like a browser session, and the same token works
 *     as the NextAuth session cookie inside the app's web views.
 */

const CODE_TTL_MS = 2 * 60 * 1000;
const DESKTOP_SESSION_TTL_DAYS = 90;
const IDENTIFIER_PREFIX = 'desktop:';

export const DESKTOP_REDIRECT_URI = 'pickskill://auth/callback';

// base64url, 43–128 chars per RFC 7636.
const PKCE_RE = /^[A-Za-z0-9_-]{43,128}$/;
const STATE_RE = /^[A-Za-z0-9_-]{16,128}$/;

export function isValidCodeChallenge(v: unknown): v is string {
  return typeof v === 'string' && PKCE_RE.test(v);
}

export function isValidState(v: unknown): v is string {
  return typeof v === 'string' && STATE_RE.test(v);
}

function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

function s256Challenge(verifier: string): string {
  return createHash('sha256').update(verifier).digest('base64url');
}

/** Mint a one-time authorization code for a signed-in user. */
export async function createDesktopAuthCode(userId: string, codeChallenge: string): Promise<string> {
  const code = randomBytes(32).toString('base64url');
  await getDb()
    .insert(verificationTokens)
    .values({
      identifier: `${IDENTIFIER_PREFIX}${userId}:${codeChallenge}`,
      token: sha256(code),
      expires: new Date(Date.now() + CODE_TTL_MS),
    });
  return code;
}

export type ExchangeResult =
  | { ok: true; token: string; expires: Date; userId: string }
  | { ok: false; error: 'invalid_grant' | 'invalid_request' };

/**
 * Redeem a code + PKCE verifier for a desktop session token. The code row is
 * deleted before any check runs, so a code is single-use even when the
 * verifier is wrong (a guessed verifier burns the code).
 */
export async function exchangeDesktopAuthCode(code: string, codeVerifier: string): Promise<ExchangeResult> {
  if (!code || !PKCE_RE.test(codeVerifier)) return { ok: false, error: 'invalid_request' };
  const db = getDb();
  const [row] = await db
    .delete(verificationTokens)
    .where(
      and(
        eq(verificationTokens.token, sha256(code)),
        like(verificationTokens.identifier, `${IDENTIFIER_PREFIX}%`),
      ),
    )
    .returning();
  if (!row || row.expires.getTime() < Date.now()) return { ok: false, error: 'invalid_grant' };

  const rest = row.identifier.slice(IDENTIFIER_PREFIX.length);
  const sep = rest.lastIndexOf(':');
  const userId = rest.slice(0, sep);
  const challenge = rest.slice(sep + 1);
  if (!userId || s256Challenge(codeVerifier) !== challenge) return { ok: false, error: 'invalid_grant' };

  return { ok: true, userId, ...(await createDesktopSession(userId)) };
}

/** Mint a desktop session token (a `dexter_auth_sessions` row) for a signed-in user. */
export async function createDesktopSession(userId: string): Promise<{ token: string; expires: Date }> {
  const token = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + DESKTOP_SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
  await getDb().insert(authSessions).values({ sessionToken: token, userId, expires });
  return { token, expires };
}

/** Resolve an `Authorization: Bearer <token>` desktop session to its user. */
export async function getUserFromBearer(token: string): Promise<SessionUser | null> {
  const [row] = await getDb()
    .select({ id: users.id, name: users.name, email: users.email, image: users.image })
    .from(authSessions)
    .innerJoin(users, eq(users.id, authSessions.userId))
    .where(and(eq(authSessions.sessionToken, token), gt(authSessions.expires, new Date())))
    .limit(1);
  return row ?? null;
}

/** Delete a desktop session (sign-out from the app). */
export async function revokeDesktopToken(token: string): Promise<void> {
  await getDb().delete(authSessions).where(eq(authSessions.sessionToken, token));
}

export function bearerFrom(header: string | null | undefined): string | null {
  const m = header?.match(/^Bearer\s+([A-Za-z0-9]{32,256})$/);
  return m ? m[1] : null;
}
