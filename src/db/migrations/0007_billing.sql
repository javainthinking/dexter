-- 0007_billing.sql — Stripe subscription state on users + per-period usage.
-- See src/db/schema/auth.ts (users billing columns) and
-- src/db/schema/billing.ts (dexter_usage). Stripe is the source of truth;
-- these columns are mirrored via the webhook. Additive + idempotent.

ALTER TABLE "dexter_users"
  ADD COLUMN IF NOT EXISTS "plan" text NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS "billing_interval" text,
  ADD COLUMN IF NOT EXISTS "stripe_customer_id" text,
  ADD COLUMN IF NOT EXISTS "stripe_subscription_id" text,
  ADD COLUMN IF NOT EXISTS "stripe_price_id" text,
  ADD COLUMN IF NOT EXISTS "stripe_status" text,
  ADD COLUMN IF NOT EXISTS "stripe_current_period_end" timestamptz,
  ADD COLUMN IF NOT EXISTS "stripe_cancel_at_period_end" boolean NOT NULL DEFAULT false;

-- Unique per Stripe id. NULLs are allowed to repeat (existing free users),
-- so this only constrains real customer/subscription ids.
CREATE UNIQUE INDEX IF NOT EXISTS "dexter_users_stripe_customer_uq"
  ON "dexter_users" ("stripe_customer_id");
CREATE UNIQUE INDEX IF NOT EXISTS "dexter_users_stripe_subscription_uq"
  ON "dexter_users" ("stripe_subscription_id");

-- Metered usage counters, one row per (user, month, metric).
CREATE TABLE IF NOT EXISTS "dexter_usage" (
  "id" bigserial PRIMARY KEY,
  "user_id" text NOT NULL REFERENCES "dexter_users"("id") ON DELETE CASCADE,
  "period_start" date NOT NULL,
  "metric" text NOT NULL,
  "count" integer NOT NULL DEFAULT 0,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS "dexter_usage_user_period_metric_uq"
  ON "dexter_usage" ("user_id", "period_start", "metric");
