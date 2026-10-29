-- 0011_gsc.sql — Google Search Console data for the SEO / GEO loop.
-- See src/db/schema/gsc.ts. Additive; no existing table touched.

CREATE TABLE IF NOT EXISTS "dexter_gsc_daily" (
  "id" bigserial PRIMARY KEY NOT NULL,
  "date" date NOT NULL,
  "page" text NOT NULL,
  "query" text NOT NULL,
  "country" text NOT NULL,
  "device" text NOT NULL,
  "clicks" integer DEFAULT 0 NOT NULL,
  "impressions" integer DEFAULT 0 NOT NULL,
  "ctr" double precision DEFAULT 0 NOT NULL,
  "position" double precision DEFAULT 0 NOT NULL,
  CONSTRAINT "dexter_gsc_daily_key" UNIQUE ("date", "page", "query", "country", "device")
);--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "dexter_gsc_daily_date" ON "dexter_gsc_daily" USING btree ("date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "dexter_gsc_daily_page" ON "dexter_gsc_daily" USING btree ("page");--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "dexter_gsc_totals_daily" (
  "id" bigserial PRIMARY KEY NOT NULL,
  "date" date NOT NULL,
  "page" text NOT NULL,
  "clicks" integer DEFAULT 0 NOT NULL,
  "impressions" integer DEFAULT 0 NOT NULL,
  "ctr" double precision DEFAULT 0 NOT NULL,
  "position" double precision DEFAULT 0 NOT NULL,
  CONSTRAINT "dexter_gsc_totals_daily_key" UNIQUE ("date", "page")
);--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "dexter_gsc_totals_daily_date" ON "dexter_gsc_totals_daily" USING btree ("date");
