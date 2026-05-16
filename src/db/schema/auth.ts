/**
 * NextAuth v4 (Auth.js) tables for the Web SaaS surface.
 *
 * Four tables matching the standard NextAuth adapter contract, all
 * `dexter_` prefixed to coexist with other Supabase tenants:
 *
 *   dexter_users               canonical user records (one row per human)
 *   dexter_accounts            OAuth provider links (one per (provider, account))
 *   dexter_auth_sessions       NextAuth database-strategy sessions (cookie ↔ user)
 *   dexter_verification_tokens email codes / magic-link tokens (used for both
 *                              NextAuth's default flow and our 6-digit
 *                              passwordless code flow)
 *
 * The chat-history table `dexter_web_sessions` is conceptually different
 * — it tracks conversational sessions, not auth sessions — and keeps its
 * own table. Its `user_id` column is now a foreign key to `dexter_users.id`
 * (nullable so historical anonymous rows remain valid).
 */

import {
  pgTable,
  text,
  timestamp,
  integer,
  index,
  primaryKey,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgTable(
  'dexter_users',
  {
    id: text('id')
      .primaryKey()
      .default(sql`gen_random_uuid()::text`),
    name: text('name'),
    email: text('email'),
    emailVerified: timestamp('email_verified', { withTimezone: true, mode: 'date' }),
    image: text('image'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    emailUq: uniqueIndex('dexter_users_email_uq').on(t.email),
  }),
);

export const accounts = pgTable(
  'dexter_accounts',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.provider, t.providerAccountId] }),
    userIdx: index('dexter_accounts_user_idx').on(t.userId),
  }),
);

export const authSessions = pgTable(
  'dexter_auth_sessions',
  {
    sessionToken: text('session_token').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expires: timestamp('expires', { withTimezone: true }).notNull(),
  },
  (t) => ({
    userIdx: index('dexter_auth_sessions_user_idx').on(t.userId),
  }),
);

export const verificationTokens = pgTable(
  'dexter_verification_tokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { withTimezone: true }).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.identifier, t.token] }),
  }),
);

export type UserRow = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;
export type AccountRow = typeof accounts.$inferSelect;
export type AuthSessionRow = typeof authSessions.$inferSelect;
export type VerificationTokenRow = typeof verificationTokens.$inferSelect;
