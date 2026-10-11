-- 0009_desktop_turns.sql — desktop chat turns, so the desktop app's turns are
-- quota-gated and metered like web turns. See src/db/schema/desktop-turns.ts.
-- Additive + idempotent.

CREATE TABLE IF NOT EXISTS "dexter_desktop_turns" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" text NOT NULL REFERENCES "dexter_users"("id") ON DELETE CASCADE,
  "agent_session_id" text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "metered_at" timestamptz,
  "completed_at" timestamptz
);

CREATE INDEX IF NOT EXISTS "dexter_desktop_turns_user_created_idx"
  ON "dexter_desktop_turns" ("user_id", "created_at");
