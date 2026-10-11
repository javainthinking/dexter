import 'server-only';
import { getServerSession } from 'next-auth/next';
import type { Session } from 'next-auth';
import { headers } from 'next/headers';
import { authOptions } from './config';
import { bearerFrom, getUserFromBearer } from './desktop';

export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

/**
 * Read the current NextAuth session on the server. Returns null when no
 * user is signed in. The session cookie validation runs against
 * dexter_auth_sessions, so this works for both Google sign-ins and the
 * custom 6-digit email-code flow (which writes to the same table).
 *
 * The desktop app sends the same kind of session token as
 * `Authorization: Bearer <token>`; that header wins over cookies.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const bearer = bearerFrom((await headers()).get('authorization'));
  if (bearer) return getUserFromBearer(bearer);
  const session = (await getServerSession(authOptions)) as
    | (Session & { user?: SessionUser })
    | null;
  return session?.user ?? null;
}

/** Like getCurrentUser but throws — for guarded routes. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('UNAUTHENTICATED');
  }
  return user;
}

export async function getCurrentUserId(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.id ?? null;
}
