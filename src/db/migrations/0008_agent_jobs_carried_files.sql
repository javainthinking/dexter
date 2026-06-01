-- Carry office files across chunk boundaries. On Vercel each resume runs in
-- a fresh container with an empty /tmp, so a file created in an earlier chunk
-- is gone by the final drain. We now upload touched files to R2 at
-- continuation and store [{path, key}] here; the resume hop downloads them
-- back before continuing, so editing + the final deliverable upload still work.
ALTER TABLE "dexter_agent_jobs" ADD COLUMN IF NOT EXISTS "carried_files" jsonb;
