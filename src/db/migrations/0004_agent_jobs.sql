-- 0004_agent_jobs.sql — durable per-chunk state for the chunked agent loop.
-- See src/db/schema/agent-jobs.ts for column-by-column rationale.
-- Each job is bounded in size (messages are jsonb with capped tool results)
-- and TTL-cleaned by /api/cron/cleanup-agent-jobs once a day.

CREATE TABLE "dexter_agent_jobs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" text NOT NULL REFERENCES "dexter_users"("id") ON DELETE CASCADE,
  "session_id" uuid REFERENCES "dexter_web_sessions"("id") ON DELETE CASCADE,
  "query" text NOT NULL,
  "model" text,
  "status" text NOT NULL DEFAULT 'running',
  "chunk_index" integer NOT NULL DEFAULT 0,
  "total_iterations" integer NOT NULL DEFAULT 0,
  "required_nudges" integer NOT NULL DEFAULT 0,
  "last_api_input_tokens" integer NOT NULL DEFAULT 0,
  "messages" jsonb,
  "touched_files" text[] NOT NULL DEFAULT '{}'::text[],
  "final_answer" text,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL,
  "expires_at" timestamptz NOT NULL DEFAULT (now() + interval '24 hours')
);--> statement-breakpoint

CREATE INDEX "dexter_agent_jobs_status_expiry"
  ON "dexter_agent_jobs" USING btree ("status", "expires_at");--> statement-breakpoint

CREATE INDEX "dexter_agent_jobs_user_status"
  ON "dexter_agent_jobs" USING btree ("user_id", "status");
