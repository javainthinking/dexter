/**
 * dexter_cron_jobs — durable persistence of scheduled agent jobs.
 *
 * The full job definition lives in a single jsonb column to avoid lockstep
 * schema migrations every time CronJob shape evolves. The state column is
 * patched independently so updateState() doesn't need to read+write the
 * whole job row. Jobs are user-scoped (user_id FK → dexter_users.id,
 * ON DELETE CASCADE).
 */

import { pgTable, text, timestamp, boolean, jsonb, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import type { CronJob, CronJobState } from '../../cron/types.js';
import { users } from './auth.js';

export const cronJobs = pgTable(
  'dexter_cron_jobs',
  {
    id: text('id').primaryKey(),                  // matches CronJob.id
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    enabled: boolean('enabled').default(true).notNull(),
    definition: jsonb('definition').$type<Omit<CronJob, 'state'>>().notNull(),
    state: jsonb('state').$type<CronJobState>().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (t) => ({
    byUser: index('dexter_cron_jobs_user_idx').on(t.userId),
  }),
);

export type CronJobRow = typeof cronJobs.$inferSelect;
