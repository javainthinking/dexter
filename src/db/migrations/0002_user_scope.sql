-- Migrate business tables from org_id to user_id (NOT NULL, FK to dexter_users
-- with ON DELETE CASCADE). Applied to Supabase via inline bun script;
-- this file is kept for replay / new-environment provisioning.

-- web_sessions: drop org_id, tighten user_id to NOT NULL + CASCADE
ALTER TABLE "dexter_web_sessions" DROP COLUMN "org_id";--> statement-breakpoint
ALTER TABLE "dexter_web_sessions" DROP CONSTRAINT "dexter_web_sessions_user_id_dexter_users_id_fk";--> statement-breakpoint
ALTER TABLE "dexter_web_sessions" ADD CONSTRAINT "dexter_web_sessions_user_id_dexter_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."dexter_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dexter_web_sessions" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint

-- memory_files: org_id → user_id (table is empty in production at this point)
DROP INDEX IF EXISTS "dexter_memory_files_org_path_uq";--> statement-breakpoint
ALTER TABLE "dexter_memory_files" DROP COLUMN "org_id";--> statement-breakpoint
ALTER TABLE "dexter_memory_files" ADD COLUMN "user_id" text NOT NULL REFERENCES "dexter_users"("id") ON DELETE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "dexter_memory_files_user_path_uq" ON "dexter_memory_files" USING btree ("user_id","path");--> statement-breakpoint

-- memory_chunks: same migration
DROP INDEX IF EXISTS "dexter_memory_chunks_hash_uq";--> statement-breakpoint
DROP INDEX IF EXISTS "dexter_memory_chunks_file_idx";--> statement-breakpoint
ALTER TABLE "dexter_memory_chunks" DROP COLUMN "org_id";--> statement-breakpoint
ALTER TABLE "dexter_memory_chunks" ADD COLUMN "user_id" text NOT NULL REFERENCES "dexter_users"("id") ON DELETE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "dexter_memory_chunks_hash_uq" ON "dexter_memory_chunks" USING btree ("user_id","content_hash");--> statement-breakpoint
CREATE INDEX "dexter_memory_chunks_file_idx" ON "dexter_memory_chunks" USING btree ("user_id","file_path");--> statement-breakpoint

-- cron_jobs: same migration
DROP INDEX IF EXISTS "dexter_cron_jobs_org_idx";--> statement-breakpoint
ALTER TABLE "dexter_cron_jobs" DROP COLUMN "org_id";--> statement-breakpoint
ALTER TABLE "dexter_cron_jobs" ADD COLUMN "user_id" text NOT NULL REFERENCES "dexter_users"("id") ON DELETE cascade;--> statement-breakpoint
CREATE INDEX "dexter_cron_jobs_user_idx" ON "dexter_cron_jobs" USING btree ("user_id");
