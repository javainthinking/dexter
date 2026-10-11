/**
 * dexter_desktop_turns — one row per chat turn the desktop app runs on its
 * local agent. The desktop's LLM calls go through the PickSkill gateway, so
 * this is where its turns get the same quota treatment as web turns:
 *
 *   POST /api/desktop/turns   admits a turn (same quota gate as /api/agent)
 *   gateway LLM call          binds to an open turn by OpenCode session id;
 *                             the first successful call meters the turn as
 *                             one conversation (metered_at, at most once)
 *   POST /api/desktop/turns/:id/complete   closes it
 *
 * A turn left open stops admitting LLM calls after DESKTOP_TURN_TTL_MS.
 */

import { pgTable, uuid, text, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './auth.js';

export const desktopTurns = pgTable(
  'dexter_desktop_turns',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    /** OpenCode session (x-opencode-session-id) the turn runs in; bound on its first LLM call. */
    agentSessionId: text('agent_session_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    meteredAt: timestamp('metered_at', { withTimezone: true }),
    completedAt: timestamp('completed_at', { withTimezone: true }),
  },
  (t) => ({
    userCreatedIdx: index('dexter_desktop_turns_user_created_idx').on(t.userId, t.createdAt),
  }),
);

export type DesktopTurnRow = typeof desktopTurns.$inferSelect;
