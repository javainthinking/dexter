/**
 * dexter_feedback persistence layer.
 *
 * Web-only — depends on Drizzle + Postgres. Keeps DB access out of
 * the route handlers so the same logic can be reused by future admin
 * routes / cron triage.
 */

import { getDb } from '@dexter/core/db/client';
import {
  feedback,
  type FeedbackAttachment,
} from '@dexter/core/db/schema/feedback';

export interface CreateFeedbackInput {
  userId: string;
  type: 'bug' | 'feature' | 'general';
  subject: string | null;
  message: string;
  attachments: FeedbackAttachment[];
  pageUrl: string | null;
  userAgent: string | null;
}

export interface CreateFeedbackResult {
  id: string;
  createdAt: string;
}

/**
 * Persist one feedback row. Returns the new id + timestamp.
 */
export async function createFeedback(
  input: CreateFeedbackInput,
): Promise<CreateFeedbackResult> {
  const db = getDb();
  const [row] = await db
    .insert(feedback)
    .values({
      userId: input.userId,
      type: input.type,
      subject: input.subject,
      message: input.message,
      attachments: input.attachments,
      pageUrl: input.pageUrl,
      userAgent: input.userAgent,
    })
    .returning({ id: feedback.id, createdAt: feedback.createdAt });
  return { id: row.id, createdAt: row.createdAt.toISOString() };
}
