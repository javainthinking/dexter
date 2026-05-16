import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { getDb } from '@dexter/core/db/client';
import {
  users,
  accounts,
  authSessions,
  verificationTokens,
} from '@dexter/core/db/schema/auth';

/**
 * NextAuth v4 configuration.
 *
 * Strategy: database sessions (server-validated cookie ↔ dexter_auth_sessions
 * row). Better suited to a multi-tenant SaaS than JWT: revocation works
 * server-side, no token bloat, and the row can carry per-user state if
 * we add columns later.
 *
 * Google is the only OAuth provider — we add another by dropping its
 * Provider() factory into the `providers` array. The custom 6-digit email
 * code flow lives at /api/auth/email/{send,verify} and writes directly
 * to dexter_auth_sessions so NextAuth's getServerSession() picks it up.
 */

const hasGoogleCreds = !!(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);

export const authOptions: NextAuthOptions = {
  // The Drizzle adapter expects the schema to expose specific table names;
  // we pass the explicit mapping because we ship `authSessions` (not
  // `sessions`) to avoid colliding with `dexter_web_sessions`.
  adapter: DrizzleAdapter(getDb(), {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: authSessions,
    verificationTokensTable: verificationTokens,
  }),
  session: { strategy: 'database' },
  providers: hasGoogleCreds
    ? [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          authorization: {
            params: {
              // Always show the account picker so users explicitly choose
              // which Google identity they want — kills the "wrong account"
              // class of bugs when a browser is signed into several.
              prompt: 'select_account',
              access_type: 'offline',
              response_type: 'code',
            },
          },
          // Google verifies the email server-side, and `prompt=select_account`
          // means the user explicitly picks the identity. Without this, a
          // pre-existing user row (e.g. created by the email-code flow)
          // would block the first Google sign-in for that address with
          // OAuthAccountNotLinked.
          allowDangerousEmailAccountLinking: true,
        }),
      ]
    : [],
  pages: {
    signIn: '/sign-in',
  },
  callbacks: {
    async session({ session, user }) {
      // Expose the user id on the session object so server components can
      // read `session.user.id` without re-querying.
      if (session?.user && user) {
        (session.user as typeof session.user & { id: string }).id = user.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
