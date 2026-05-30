-- 0006_web_message_deliverables.sql — persist agent-produced files per turn.
-- See src/db/schema/web-sessions.ts (StoredDeliverable) for the shape.
--
-- We store ONLY the R2 object key + display metadata, never the presigned
-- download URL (7-day max TTL — it would 403 once expired). Read paths
-- re-sign each key into a fresh URL via runtime/r2.ts#presignDownloadForKey.
--
-- Nullable + no default: existing rows stay NULL (they predate file
-- persistence and can't be back-filled — the keys were never captured),
-- and turns that produce no files also stay NULL. Additive and
-- backward-compatible; no data rewrite.

ALTER TABLE "dexter_web_messages"
  ADD COLUMN IF NOT EXISTS "deliverables" jsonb;
