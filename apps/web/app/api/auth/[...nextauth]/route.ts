import NextAuth from 'next-auth';
import { authOptions } from '../../../../lib/auth/config';

/**
 * NextAuth v4 App Router catch-all. Handles:
 *   GET  /api/auth/session         current session JSON
 *   GET  /api/auth/csrf            CSRF token
 *   GET  /api/auth/providers       enabled providers
 *   GET  /api/auth/signin/:p       provider sign-in start
 *   POST /api/auth/signin/:p       provider sign-in callback
 *   GET  /api/auth/callback/:p     OAuth callback
 *   POST /api/auth/signout         destroy session
 */

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
