/**
 * dexter_web_sessions / dexter_web_messages — persists Web chat sessions
 * across cold starts and across function instances. Replaces the
 * module-scope `Map` that apps/web used in Phase 2.
 */

import { pgTable, uuid, text, timestamp, bigserial, integer, index, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import type { StoredDeliverable } from '../../agent/types.js';
import { users } from './auth.js';

export const webSessions = pgTable('dexter_web_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
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
    // Files the agent produced this turn (R2 keys + metadata). Null for
    // turns persisted before this column existed and for turns that
    // produced no files. Read paths re-sign each key into a download URL.
    deliverables: jsonb('deliverables').$type<StoredDeliverable[]>(),
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
