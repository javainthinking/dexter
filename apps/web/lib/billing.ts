import 'server-only';
import { and, eq, sql } from 'drizzle-orm';
import { getDb } from '@dexter/core/db/client';
import { users } from '@dexter/core/db/schema/auth';
import { usage } from '@dexter/core/db/schema/billing';
import { PLAN_LIMITS, LIMIT_FIELD, type PlanId, type UsageMetric } from './plans';

/**
 * Billing resolvers — read the user's entitlement (plan, mirrored from
 * Stripe) and the per-month metered usage that backs the quotas. The
 * webhook keeps `users.plan` correct (downgrades to 'free' on cancel), so
 * reads here are a single fast DB hit with no Stripe call.
 */

/** First day of the current calendar month, 'YYYY-MM-DD' (UTC). */
export function currentPeriodStart(now = new Date()): string {
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, '0');
  return `${y}-${m}-01`;
}

export interface UserPlan {
  plan: PlanId;
  status: string | null;
  periodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId: string | null;
}

export async function getUserPlan(userId: string): Promise<UserPlan> {
  const db = getDb();
  const [row] = await db
    .select({
      plan: users.plan,
      status: users.stripeStatus,
      periodEnd: users.stripeCurrentPeriodEnd,
      cancelAtPeriodEnd: users.stripeCancelAtPeriodEnd,
      stripeCustomerId: users.stripeCustomerId,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return {
    plan: (row?.plan ?? 'free') as PlanId,
    status: row?.status ?? null,
    periodEnd: row?.periodEnd ?? null,
    cancelAtPeriodEnd: row?.cancelAtPeriodEnd ?? false,
    stripeCustomerId: row?.stripeCustomerId ?? null,
  };
}

export async function getUsage(
  userId: string,
  metric: UsageMetric,
  period: string = currentPeriodStart(),
): Promise<number> {
  const db = getDb();
  const [row] = await db
    .select({ count: usage.count })
    .from(usage)
    .where(and(eq(usage.userId, userId), eq(usage.periodStart, period), eq(usage.metric, metric)))
    .limit(1);
  return row?.count ?? 0;
}

/** Atomic upsert: +by for (user, current period, metric). */
export async function incrementUsage(
  userId: string,
  metric: UsageMetric,
  by = 1,
  period: string = currentPeriodStart(),
): Promise<void> {
  const db = getDb();
  await db
    .insert(usage)
    .values({ userId, periodStart: period, metric, count: by })
    .onConflictDoUpdate({
      target: [usage.userId, usage.periodStart, usage.metric],
      set: { count: sql`${usage.count} + ${by}`, updatedAt: new Date() },
    });
}

export interface QuotaCheck {
  allowed: boolean;
  used: number;
  limit: number;
  plan: PlanId;
  metric: UsageMetric;
}

/** Is the user within their plan's monthly limit for this metric? */
export async function checkQuota(
  userId: string,
  plan: PlanId,
  metric: UsageMetric,
): Promise<QuotaCheck> {
  const limit = PLAN_LIMITS[plan][LIMIT_FIELD[metric]];
  if (!Number.isFinite(limit)) {
    return { allowed: true, used: 0, limit, plan, metric };
  }
  const used = await getUsage(userId, metric);
  return { allowed: used < limit, used, limit, plan, metric };
}
