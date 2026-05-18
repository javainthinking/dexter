-- 0003_portfolios.sql — user-managed equity portfolios for /indicators.
-- Two tables, both prefixed `dexter_`, both ON DELETE CASCADE from
-- dexter_users so deactivating an account also cleans up portfolios.

CREATE TABLE "dexter_portfolios" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" text NOT NULL REFERENCES "dexter_users"("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "description" text,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);--> statement-breakpoint

CREATE INDEX "dexter_portfolios_user_idx" ON "dexter_portfolios" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "dexter_portfolios_user_name_uniq" ON "dexter_portfolios" USING btree ("user_id","name");--> statement-breakpoint

CREATE TABLE "dexter_portfolio_holdings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "portfolio_id" uuid NOT NULL REFERENCES "dexter_portfolios"("id") ON DELETE CASCADE,
  "ticker" text NOT NULL,
  "display_name" text,
  "exchange" text,
  "weight" numeric(7, 4),
  "position" integer DEFAULT 0 NOT NULL,
  "added_at" timestamptz DEFAULT now() NOT NULL
);--> statement-breakpoint

CREATE INDEX "dexter_portfolio_holdings_portfolio_idx" ON "dexter_portfolio_holdings" USING btree ("portfolio_id");--> statement-breakpoint
CREATE UNIQUE INDEX "dexter_portfolio_holdings_pt_uniq" ON "dexter_portfolio_holdings" USING btree ("portfolio_id","ticker");
