/**
 * dexter_usage — per-user, per-period metered counters that back the plan
 * quotas (conversations / deep-research / files per month). One row per
 * (user, period_start, metric); incremented on each successful metered
 * action and checked against PLAN_LIMITS before the action runs.
 *
 * `period_start` is the first day of the calendar month (UTC) the usage
 * falls in, stored as a date string ('YYYY-MM-DD'). Resetting is implicit:
 * a new month means a new period_start, so counts start at zero without a
 * delete. (A cron can prune old rows later.)
 */

import { pgTable, text, integer, date, timestamp, bigserial, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from './auth.js';

export const usage = pgTable(
  'dexter_usage',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    /** First day of the billing/calendar month, 'YYYY-MM-DD' (UTC). */
    periodStart: date('period_start').notNull(),
    /** 'conversations' | 'deep_research' | 'files'. */
    metric: text('metric').notNull(),
    count: integer('count').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    userPeriodMetricUq: uniqueIndex('dexter_usage_user_period_metric_uq').on(
      t.userId,
      t.periodStart,
      t.metric,
    ),
  }),
);

export type UsageRow = typeof usage.$inferSelect;
export type UsageInsert = typeof usage.$inferInsert;
