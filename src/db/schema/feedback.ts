/**
 * dexter_feedback — user-submitted feedback (bug reports, feature
 * requests, general comments).
 *
 * Attachments are uploaded directly browser→R2 via presigned PUT URLs
 * (apps/web/app/api/feedback/upload-url/route.ts). Only the resulting
 * object keys land here; the binary lives in R2 under
 *   feedback/<userId>/<YYYY-MM-DD>/<ts>-<random>-<filename>
 * which keeps a per-user partition for cleanup + audit and a date
 * partition for browsing.
 *
 * `status` is a soft enum the admin side can advance through. Keeping
 * it as text rather than a Postgres enum so we can add states without
 * a schema migration.
 */

import { pgTable, uuid, text, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
import { users } from './auth.js';

/**
 * Shape of one attachment in the jsonb array. Stored as plain JSON
 * for flexibility — Drizzle's $type<>() gives us autocomplete on the
 * read side without locking the column.
 */
export interface FeedbackAttachment {
  /** R2 object key — `feedback/<userId>/<date>/<ts>-<rand>-<name>`. */
  key: string;
  /** Browser-reported MIME type (e.g. `image/png`). */
  contentType: string;
  /** Size in bytes, validated against 10 MB cap before upload. */
  byteLength: number;
  /** Original filename from the user's file picker, for display. */
  originalName: string;
}

export const feedback = pgTable(
  'dexter_feedback',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    /** 'bug' | 'feature' | 'general' — soft enum, validated at API edge. */
    type: text('type').notNull().default('general'),
    /** Optional one-line subject. */
    subject: text('subject'),
    /** Required free-form message body. */
    message: text('message').notNull(),
    /** Up to 3 attachments. See FeedbackAttachment for shape. */
    attachments: jsonb('attachments').$type<FeedbackAttachment[]>().notNull().default([]),
    /** URL of the page the user was on when submitting (diagnostic). */
    pageUrl: text('page_url'),
    /** User-Agent string at submission time (diagnostic). */
    userAgent: text('user_agent'),
    /**
     * 'new' (default) → 'triaged' → 'resolved' | 'dismissed'.
     * Soft enum so we can add states without migrating.
     */
    status: text('status').notNull().default('new'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    // Admin queue: "show me all new feedback, newest first."
    statusCreatedIdx: index('dexter_feedback_status_created').on(t.status, t.createdAt),
    // Per-user lookups: "show me this user's submissions."
    userCreatedIdx: index('dexter_feedback_user_created').on(t.userId, t.createdAt),
  }),
);

export type FeedbackRow = typeof feedback.$inferSelect;
export type FeedbackInsert = typeof feedback.$inferInsert;
