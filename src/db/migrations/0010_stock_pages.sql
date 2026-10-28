-- 0010_stock_pages.sql — on-demand public stock pages, listed in the sitemap.
-- See src/db/schema/stock-pages.ts. Additive; no existing table touched.

CREATE TABLE IF NOT EXISTS "dexter_stock_pages" (
  "slug" text PRIMARY KEY NOT NULL,
  "ticker" text NOT NULL,
  "market" text NOT NULL,
  "exchange" text NOT NULL,
  "name_en" text NOT NULL,
  "name_zh" text NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "dexter_stock_pages_created"
  ON "dexter_stock_pages" USING btree ("created_at");
