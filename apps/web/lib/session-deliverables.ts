/**
 * Re-sign persisted deliverable keys into fresh download URLs.
 *
 * Chat turns persist only the durable R2 object key + display metadata
 * (see StoredDeliverable). Presigned download URLs are short-lived
 * (7-day max TTL) and would 403 if we stored them verbatim, so the read
 * surfaces — /api/sessions/current and /api/sessions/switch — call this
 * to mint a fresh URL per key every time a past conversation is opened.
 *
 * Failures are swallowed per-deliverable: a since-deleted object or a
 * transient signing error drops that one chip rather than failing the
 * whole session load. When R2 isn't configured we return turns with
 * empty deliverable lists (no link is better than a broken one).
 */

import { presignDownloadForKey, isR2Configured } from '@dexter/core/runtime/r2';
import type { WebSessionRecord, WebChatTurn } from '@dexter/core/ports/web-session';

/** The download-ready shape the chat client renders as a download chip. */
export interface HydratedDeliverable {
  filename: string;
  downloadUrl: string;
  expiresAt: string;
  byteLength: number;
  key: string;
}

/** A turn as returned to the client, with re-signed download URLs. */
export interface HydratedTurn {
  turnIndex: number;
  query: string;
  answer: string | null;
  deliverables: HydratedDeliverable[];
}

export interface HydratedSession {
  sessionId: string;
  turns: HydratedTurn[];
}

async function presignTurn(turn: WebChatTurn): Promise<HydratedTurn> {
  const stored = turn.deliverables ?? [];
  let deliverables: HydratedDeliverable[] = [];
  if (stored.length > 0 && isR2Configured()) {
    const signed = await Promise.all(
      stored.map(async (d) => {
        try {
          const { downloadUrl, expiresAt } = await presignDownloadForKey(d.key);
          return {
            filename: d.filename,
            downloadUrl,
            expiresAt,
            byteLength: d.byteLength,
            key: d.key,
          };
        } catch {
          return null;
        }
      }),
    );
    deliverables = signed.filter((d): d is HydratedDeliverable => d !== null);
  }
  return {
    turnIndex: turn.turnIndex,
    query: turn.query,
    answer: turn.answer,
    deliverables,
  };
}

/**
 * Map a stored session record into the client-facing shape, re-signing
 * every turn's deliverable keys. Returns null for a null input so callers
 * can pass through a missing session unchanged.
 */
export async function hydrateSessionDeliverables(
  session: WebSessionRecord | null,
): Promise<HydratedSession | null> {
  if (!session) return null;
  const turns = await Promise.all(session.turns.map(presignTurn));
  // Drop incomplete orphan turns: a query that has neither a final answer
  // nor any deliverable never reached `done` (e.g. a chunked run that was
  // abandoned, or a legacy answerless row from before turns persisted only
  // on completion). Rendering them produced an empty assistant bubble. A
  // file-only turn (answer empty but deliverables present) is kept.
  const renderable = turns.filter(
    (t) => (t.answer != null && t.answer.length > 0) || t.deliverables.length > 0,
  );
  return { sessionId: session.sessionId, turns: renderable };
}
