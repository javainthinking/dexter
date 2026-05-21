/**
 * POST /api/feedback
 *
 * Request:
 *   {
 *     type: 'bug' | 'feature' | 'general',
 *     subject?: string,
 *     message: string,
 *     attachments?: Array<{ key, contentType, byteLength, originalName }>,
 *     pageUrl?: string,
 *     userAgent?: string,
 *   }
 *
 * Response: { id, createdAt }
 *
 * Validates the attachment keys belong to this user's prefix (defence
 * against a client passing keys it doesn't own), then persists the row.
 * Does NOT re-verify each object exists in R2 — that would double the
 * tail latency for the average submission. If a user fakes a key they
 * just submit a feedback that references a missing object; admin UI
 * will surface it as a broken thumbnail.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUser } from '../../../lib/auth/session';
import { createFeedback } from '../../../lib/feedback-store';
import type { FeedbackAttachment } from '@dexter/core/db/schema/feedback';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const ALLOWED_TYPES = new Set(['bug', 'feature', 'general']);
const MAX_MESSAGE_LEN = 8000;
const MAX_SUBJECT_LEN = 200;
const MAX_ATTACHMENTS = 3;
const MAX_FILE_BYTES = 10 * 1024 * 1024;

interface FeedbackRequest {
  type?: string;
  subject?: string;
  message?: string;
  attachments?: Array<{
    key?: string;
    contentType?: string;
    byteLength?: number;
    originalName?: string;
  }>;
  pageUrl?: string;
  userAgent?: string;
}

export async function POST(request: NextRequest): Promise<Response> {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  }

  let body: FeedbackRequest;
  try {
    body = (await request.json()) as FeedbackRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const type = (body.type ?? 'general').toLowerCase();
  if (!ALLOWED_TYPES.has(type)) {
    return NextResponse.json({ error: 'invalid_type' }, { status: 400 });
  }
  const message = (body.message ?? '').trim();
  if (!message) {
    return NextResponse.json({ error: 'missing_message' }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE_LEN) {
    return NextResponse.json(
      { error: 'message_too_long', max: MAX_MESSAGE_LEN },
      { status: 400 },
    );
  }
  const subject = (body.subject ?? '').trim().slice(0, MAX_SUBJECT_LEN) || null;

  // Validate attachment metadata. The critical check is the key
  // prefix — `feedback/<userId>/...` — which prevents a client from
  // referencing keys it doesn't own. The user_id segment is escaped
  // the same way the upload-url route escapes it, so both ends
  // produce identical prefixes.
  const safeUserId = user.id.replace(/[^A-Za-z0-9_-]/g, '_');
  const expectedPrefix = `feedback/${safeUserId}/`;

  const rawAttachments = body.attachments ?? [];
  if (rawAttachments.length > MAX_ATTACHMENTS) {
    return NextResponse.json(
      { error: 'too_many_attachments', max: MAX_ATTACHMENTS },
      { status: 400 },
    );
  }
  const attachments: FeedbackAttachment[] = [];
  for (const a of rawAttachments) {
    if (!a.key || typeof a.key !== 'string' || !a.key.startsWith(expectedPrefix)) {
      return NextResponse.json(
        { error: 'invalid_attachment_key' },
        { status: 400 },
      );
    }
    if (!a.contentType || typeof a.contentType !== 'string') {
      return NextResponse.json(
        { error: 'invalid_attachment_content_type' },
        { status: 400 },
      );
    }
    if (
      typeof a.byteLength !== 'number' ||
      a.byteLength <= 0 ||
      a.byteLength > MAX_FILE_BYTES
    ) {
      return NextResponse.json(
        { error: 'invalid_attachment_size' },
        { status: 400 },
      );
    }
    const originalName =
      typeof a.originalName === 'string' && a.originalName.length > 0
        ? a.originalName.slice(0, 200)
        : 'image';
    attachments.push({
      key: a.key,
      contentType: a.contentType,
      byteLength: a.byteLength,
      originalName,
    });
  }

  const pageUrl =
    typeof body.pageUrl === 'string' && body.pageUrl.length > 0
      ? body.pageUrl.slice(0, 2000)
      : null;
  const userAgent =
    typeof body.userAgent === 'string' && body.userAgent.length > 0
      ? body.userAgent.slice(0, 500)
      : request.headers.get('user-agent')?.slice(0, 500) ?? null;

  try {
    const result = await createFeedback({
      userId: user.id,
      type: type as 'bug' | 'feature' | 'general',
      subject,
      message,
      attachments,
      pageUrl,
      userAgent,
    });
    console.log(
      JSON.stringify({
        level: 'info',
        surface: 'web',
        route: '/api/feedback',
        userId: user.id,
        feedbackId: result.id,
        type,
        attachmentCount: attachments.length,
        msg: 'feedback_received',
      }),
    );
    return NextResponse.json({ id: result.id, createdAt: result.createdAt });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      JSON.stringify({
        level: 'error',
        surface: 'web',
        route: '/api/feedback',
        userId: user.id,
        msg: 'persist_failed',
        error: message,
      }),
    );
    return NextResponse.json({ error: 'persist_failed' }, { status: 500 });
  }
}
