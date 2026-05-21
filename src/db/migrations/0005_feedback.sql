-- 0005_feedback.sql — user-submitted feedback with R2-hosted attachments.
-- See src/db/schema/feedback.ts for column rationale.

CREATE TABLE "dexter_feedback" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" text NOT NULL REFERENCES "dexter_users"("id") ON DELETE CASCADE,
  "type" text NOT NULL DEFAULT 'general',
  "subject" text,
  "message" text NOT NULL,
  "attachments" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "page_url" text,
  "user_agent" text,
  "status" text NOT NULL DEFAULT 'new',
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);--> statement-breakpoint

CREATE INDEX "dexter_feedback_status_created"
  ON "dexter_feedback" USING btree ("status", "created_at");--> statement-breakpoint

CREATE INDEX "dexter_feedback_user_created"
  ON "dexter_feedback" USING btree ("user_id", "created_at");
