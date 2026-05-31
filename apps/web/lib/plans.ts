// Plan limits + Stripe price mapping — the single source of truth for
// enforcement (separate from lib/pricing.ts, which holds marketing display
// copy). Price IDs come from env so the same code works in test and live.

import type { PlanId } from './pricing';

export type { PlanId } from './pricing';
export type PaidPlan = Exclude<PlanId, 'free'>;
export type BillingInterval = 'month' | 'year';

/** Metered actions counted per calendar month (match dexter_usage.metric). */
export type UsageMetric = 'conversations' | 'deep_research' | 'files';

export interface PlanLimits {
  conversations: number; // monthly cap; Infinity = unlimited
  deepResearch: number;
  files: number;
  portfolios: number; // enforced in portfolio routes (not metered monthly)
  holdings: number; // per portfolio
}

export const PLAN_LIMITS: Record<PlanId, PlanLimits> = {
  free: { conversations: 30, deepResearch: 5, files: 2, portfolios: 1, holdings: 10 },
  starter: { conversations: 200, deepResearch: 50, files: 8, portfolios: 3, holdings: 25 },
  pro: { conversations: 1000, deepResearch: 300, files: 30, portfolios: 10, holdings: 50 },
  // Power is effectively unlimited until usage-overage billing ships; holdings
  // stay capped at 100 per the pricing page.
  power: {
    conversations: Number.POSITIVE_INFINITY,
    deepResearch: Number.POSITIVE_INFINITY,
    files: Number.POSITIVE_INFINITY,
    portfolios: Number.POSITIVE_INFINITY,
    holdings: 100,
  },
};

/** Map a usage metric to its PlanLimits field. */
export const LIMIT_FIELD: Record<UsageMetric, keyof PlanLimits> = {
  conversations: 'conversations',
  deep_research: 'deepResearch',
  files: 'files',
};

// (plan, interval) → Stripe Price ID, from env. Built eagerly so a missing
// id surfaces at call time with a clear error rather than a vague Stripe 400.
const PRICE_ID_ENV: Record<string, string | undefined> = {
  starter_month: process.env.STRIPE_PRICE_STARTER_MONTHLY,
  starter_year: process.env.STRIPE_PRICE_STARTER_YEARLY,
  pro_month: process.env.STRIPE_PRICE_PRO_MONTHLY,
  pro_year: process.env.STRIPE_PRICE_PRO_YEARLY,
  power_month: process.env.STRIPE_PRICE_POWER_MONTHLY,
  power_year: process.env.STRIPE_PRICE_POWER_YEARLY,
};

export function getStripePriceId(plan: PaidPlan, interval: BillingInterval): string {
  const id = PRICE_ID_ENV[`${plan}_${interval}`];
  if (!id) throw new Error(`Stripe price id for ${plan} ${interval} not configured`);
  return id;
}

/** Reverse lookup: Stripe price → (plan, interval). Used by the webhook sync. */
export function planFromStripePrice(
  priceId: string,
): { plan: PaidPlan; interval: BillingInterval } | null {
  for (const [key, id] of Object.entries(PRICE_ID_ENV)) {
    if (id && id === priceId) {
      const [plan, interval] = key.split('_') as [PaidPlan, BillingInterval];
      return { plan, interval };
    }
  }
  return null;
}
