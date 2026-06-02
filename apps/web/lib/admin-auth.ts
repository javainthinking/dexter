import 'server-only';
import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Form-based auth for the /hello-pickskill admin console.
 *
 * Credentials live in ADMIN_NAME / ADMIN_PASSWORD (server-only env). On a
 * successful login the API route sets an httpOnly cookie holding a token
 * that is an HMAC over the credential pair, keyed by NEXTAUTH_SECRET. The
 * page recomputes the expected token on every request and compares in
 * constant time — so the cookie is unforgeable without the secret, and
 * changing the admin password (or the secret) invalidates every old cookie.
 *
 * No DB table: a single shared admin login doesn't need per-session state.
 */

export const ADMIN_COOKIE = 'dexter_admin';
const COOKIE_MAX_AGE = 60 * 60 * 12; // 12 hours

function secret(): string {
  // NEXTAUTH_SECRET is always set in this app; fall back to the password so
  // the token is still credential-bound if it were ever missing.
  return process.env.NEXTAUTH_SECRET || process.env.ADMIN_PASSWORD || 'dexter-admin';
}

/** The expected cookie value for the currently-configured credentials. */
export function expectedToken(): string {
  const user = process.env.ADMIN_NAME ?? '';
  const pass = process.env.ADMIN_PASSWORD ?? '';
  return createHmac('sha256', secret()).update(`${user}:${pass}`).digest('hex');
}

/** True when the admin console is usable (both credentials configured). */
export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_NAME && process.env.ADMIN_PASSWORD);
}

/** Constant-time check of a submitted username/password against the env. */
export function verifyCredentials(user: string, pass: string): boolean {
  if (!isAdminConfigured()) return false;
  return safeEqual(user, process.env.ADMIN_NAME ?? '') && safeEqual(pass, process.env.ADMIN_PASSWORD ?? '');
}

/** Read the admin cookie and verify it against the expected token. */
export async function isAdminAuthed(): Promise<boolean> {
  if (!isAdminConfigured()) return false;
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  return safeEqual(token, expectedToken());
}

export const ADMIN_COOKIE_MAX_AGE = COOKIE_MAX_AGE;

/** Length-independent constant-time string compare. */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  if (ab.length !== bb.length) {
    // Still run a compare to avoid a length-based early return timing signal.
    timingSafeEqual(ab, ab);
    return false;
  }
  return timingSafeEqual(ab, bb);
}
