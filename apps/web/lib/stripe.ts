import 'server-only';
import Stripe from 'stripe';
import { eq } from 'drizzle-orm';
import { getDb } from '@dexter/core/db/client';
import { users } from '@dexter/core/db/schema/auth';
import { planFromStripePrice } from './plans';

/**
 * Stripe client + entitlement sync. Stripe is the source of truth; every
 * subscription change funnels through syncUserFromStripe(), which pulls the
 * live state and mirrors it onto the user row (read on every metered
 * request via lib/billing). apiVersion is left at the SDK default so it
 * always matches the installed `stripe` package.
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_live_stub', {
  typescript: true,
  appInfo: { name: 'PickSkill', version: '1.0.0' },
});

if (!process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV === 'production') {
  console.warn('STRIPE_SECRET_KEY is not set — billing endpoints will fail');
}

interface UserBillingRow {
  id: string;
  email: string | null;
  name: string | null;
  stripeCustomerId: string | null;
}

/** Find or create the Stripe Customer for a user; persist the id. */
export async function ensureStripeCustomer(user: UserBillingRow): Promise<string> {
  if (user.stripeCustomerId) return user.stripeCustomerId;
  const customer = await stripe.customers.create({
    email: user.email ?? undefined,
    name: user.name ?? undefined,
    metadata: { userId: user.id },
  });
  await getDb().update(users).set({ stripeCustomerId: customer.id }).where(eq(users.id, user.id));
  return customer.id;
}

/**
 * Pull the latest subscription state for a user from Stripe and write it to
 * the DB. Resets to the Free plan when there is no live subscription.
 * Idempotent — safe to call from any webhook event or the reconcile cron.
 */
export async function syncUserFromStripe(userId: string): Promise<Stripe.Subscription | null> {
  const db = getDb();
  const [user] = await db
    .select({ stripeCustomerId: users.stripeCustomerId })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!user?.stripeCustomerId) return null;

  const subs = await stripe.subscriptions.list({
    customer: user.stripeCustomerId,
    status: 'all',
    expand: ['data.items.data.price'],
    limit: 5,
  });

  const active =
    subs.data.find((s) => ['active', 'trialing', 'past_due'].includes(s.status)) ??
    subs.data[0] ??
    null;

  if (!active) {
    await db
      .update(users)
      .set({
        plan: 'free',
        billingInterval: null,
        stripeSubscriptionId: null,
        stripePriceId: null,
        stripeStatus: null,
        stripeCurrentPeriodEnd: null,
        stripeCancelAtPeriodEnd: false,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
    return null;
  }

  const item = active.items.data[0];
  const priceId = item?.price?.id ?? '';
  const mapped = planFromStripePrice(priceId);
  // current_period_end has lived on both the sub and the item across API
  // versions — read defensively.
  const periodEndUnix =
    (item as unknown as { current_period_end?: number }).current_period_end ??
    (active as unknown as { current_period_end?: number }).current_period_end;
  const periodEnd = periodEndUnix ? new Date(periodEndUnix * 1000) : null;

  await db
    .update(users)
    .set({
      plan: mapped?.plan ?? 'free',
      billingInterval: mapped?.interval ?? null,
      stripeSubscriptionId: active.id,
      stripePriceId: priceId,
      stripeStatus: active.status,
      stripeCurrentPeriodEnd: periodEnd,
      stripeCancelAtPeriodEnd: active.cancel_at_period_end ?? false,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  return active;
}
