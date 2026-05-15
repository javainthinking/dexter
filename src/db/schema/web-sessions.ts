/**
 * dexter_web_sessions / dexter_web_messages — persists Web chat sessions
 * across cold starts and across function instances. Replaces the
 * module-scope `Map` that apps/web used in Phase 2.
 */

import { pgTable, uuid, text, timestamp, bigserial, integer, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const webSessions = pgTable('dexter_web_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  orgId: text('org_id'),               // Phase 4: tenant scope
  userId: text('user_id'),             // Phase 4: end-user (Clerk id, etc.)
  model: text('model'),                // last selected model
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

/**
 * dexter_web_messages — one row per conversational turn (user query +
 * assistant answer + summary), mirroring the InMemoryChatHistory.Message
 * shape used by the agent loop.
 */
export const webMessages = pgTable(
  'dexter_web_messages',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    sessionId: uuid('session_id')
      .notNull()
      .references(() => webSessions.id, { onDelete: 'cascade' }),
    turnIndex: integer('turn_index').notNull(),
    query: text('query').notNull(),
    answer: text('answer'),
    summary: text('summary'),
    tokenCount: integer('token_count'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (t) => ({
    sessionTimeline: index('dexter_web_messages_session_timeline').on(t.sessionId, t.turnIndex),
  }),
);

export type WebSessionRow = typeof webSessions.$inferSelect;
export type WebMessageRow = typeof webMessages.$inferSelect;
export type WebSessionInsert = typeof webSessions.$inferInsert;
export type WebMessageInsert = typeof webMessages.$inferInsert;
