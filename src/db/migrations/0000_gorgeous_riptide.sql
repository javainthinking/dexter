CREATE TABLE "dexter_web_messages" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"session_id" uuid NOT NULL,
	"turn_index" integer NOT NULL,
	"query" text NOT NULL,
	"answer" text,
	"summary" text,
	"token_count" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dexter_web_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" text,
	"user_id" text,
	"model" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dexter_memory_chunks" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"org_id" text DEFAULT 'global' NOT NULL,
	"file_path" text NOT NULL,
	"start_line" integer NOT NULL,
	"end_line" integer NOT NULL,
	"content" text NOT NULL,
	"content_hash" text NOT NULL,
	"source" text DEFAULT 'memory' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dexter_memory_files" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"org_id" text DEFAULT 'global' NOT NULL,
	"path" text NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dexter_cron_jobs" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text DEFAULT 'global' NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"definition" jsonb NOT NULL,
	"state" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "dexter_web_messages" ADD CONSTRAINT "dexter_web_messages_session_id_dexter_web_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."dexter_web_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "dexter_web_messages_session_timeline" ON "dexter_web_messages" USING btree ("session_id","turn_index");--> statement-breakpoint
CREATE UNIQUE INDEX "dexter_memory_chunks_hash_uq" ON "dexter_memory_chunks" USING btree ("org_id","content_hash");--> statement-breakpoint
CREATE INDEX "dexter_memory_chunks_file_idx" ON "dexter_memory_chunks" USING btree ("org_id","file_path");--> statement-breakpoint
CREATE UNIQUE INDEX "dexter_memory_files_org_path_uq" ON "dexter_memory_files" USING btree ("org_id","path");--> statement-breakpoint
CREATE INDEX "dexter_cron_jobs_org_idx" ON "dexter_cron_jobs" USING btree ("org_id");