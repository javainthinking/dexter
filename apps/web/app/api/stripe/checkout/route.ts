import { NextResponse, type NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { getDb } from '@dexter/core/db/client';
import { users } from '@dexter/core/db/schema/auth';
import { getCurrentUser } from '@/lib/auth/session';
import { ensureStripeCustomer, stripe, syncUserFromStripe } from '@/lib/stripe';
import {
  getStripePriceId,
  planFromStripePrice,
  isPlanUpgrade,
  type BillingInterval,
  type PaidPlan,
  type PlanId,
} from '@/lib/plans';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PAID = new Set(['starter', 'pro', 'power']);
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

/**
 * POST { plan, interval, locale } → Stripe Checkout Session URL.
 * 401 if signed out, 409 if already subscribed (client falls back to the
 * billing portal).
 */
export async function POST(request: NextRequest): Promise<Response> {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as {
    plan?: string;
    interval?: string;
    locale?: string;
    returnTo?: string;
  };
  const plan = body.plan as PaidPlan;
  const interval = (body.interval ?? 'month') as BillingInterval;
  const locale = body.locale && /^[a-zA-Z-]+$/.test(body.locale) ? body.locale : 'en';
  // Where to send the user if they hit "back"/cancel on Stripe's page —
  // the surface they launched checkout from. Same-origin relative path
  // only (leading single slash) to avoid an open redirect; falls back to
  // the pricing page.
  const returnTo =
    typeof body.returnTo === 'string' &&
    body.returnTo.startsWith('/') &&
    !body.returnTo.startsWith('//')
      ? body.returnTo
      : `/${locale}/pricing`;
  if (!PAID.has(plan) || !['month', 'year'].includes(interval)) {
    return NextResponse.json({ error: 'invalid plan/interval' }, { status: 400 });
  }

  const db = getDb();
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      stripeCustomerId: users.stripeCustomerId,
      stripeSubscriptionId: users.stripeSubscriptionId,
      stripeStatus: users.stripeStatus,
    })
    .from(users)
    .where(eq(users.id, sessionUser.id))
    .limit(1);
  if (!user) return NextResponse.json({ error: 'user not found' }, { status: 404 });

  // Already paying → don't create a parallel sub. Upgrade the existing one
  // in place when the requested change is an upgrade; otherwise (downgrade,
  // annual→monthly, or no change) send the client to the billing portal.
  if (user.stripeSubscriptionId && user.stripeStatus === 'active') {
    let sub: Awaited<ReturnType<typeof stripe.subscriptions.retrieve>>;
    try {
      sub = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
    } catch {
      return NextResponse.json({ error: 'already_subscribed', code: 'ALREADY_SUBSCRIBED' }, { status: 409 });
    }
    const item = sub.items.data[0];
    const parsed = item?.price?.id ? planFromStripePrice(item.price.id) : null;
    const currentPlan: PlanId = parsed?.plan ?? 'free';
    const currentInterval: BillingInterval =
      parsed?.interval ?? (item?.price?.recurring?.interval === 'year' ? 'year' : 'month');

    // Only true upgrades happen in place: a higher tier, or month→year.
    // Downgrades and annual→monthly are sent to the billing portal.
    if (!item || !isPlanUpgrade({ plan: currentPlan, interval: currentInterval }, { plan, interval })) {
      return NextResponse.json({ error: 'already_subscribed', code: 'ALREADY_SUBSCRIBED' }, { status: 409 });
    }

    const newPriceId = getStripePriceId(plan, interval);
    const upgradeCustomerId = await ensureStripeCustomer(user);

    // Primary: a Stripe-hosted confirmation scoped to exactly this price
    // change — it shows the prorated difference, collects payment (incl. any
    // SCA), updates the subscription, and returns to the account page.
    try {
      const flow = await stripe.billingPortal.sessions.create({
        customer: upgradeCustomerId,
        return_url: `${APP_URL}/${locale}/account?billing=success`,
        flow_data: {
          type: 'subscription_update_confirm',
          subscription_update_confirm: {
            subscription: sub.id,
            items: [{ id: item.id, price: newPriceId }],
          },
        },
      });
      return NextResponse.json({ url: flow.url });
    } catch {
      // Fallback (e.g. portal flow unavailable): invoice the prorated
      // difference to the card on file immediately, then land on /account.
      try {
        await stripe.subscriptions.update(sub.id, {
          items: [{ id: item.id, price: newPriceId }],
          proration_behavior: 'always_invoice',
          metadata: { userId: user.id, plan, interval },
        });
        await syncUserFromStripe(user.id);
        return NextResponse.json({ url: `${APP_URL}/${locale}/account?billing=success` });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'upgrade failed';
        return NextResponse.json({ error: 'upgrade_failed', message }, { status: 500 });
      }
    }
  }

  const customerId = await ensureStripeCustomer(user);
  const priceId = getStripePriceId(plan, interval);

  const checkout = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    // Success → account, where the freshly-synced plan + usage are shown.
    // Cancel → wherever they launched checkout from.
    success_url: `${APP_URL}/${locale}/account?billing=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${APP_URL}${returnTo}`,
    subscription_data: { metadata: { userId: user.id } },
    metadata: { userId: user.id, plan, interval },
  });

  return NextResponse.json({ url: checkout.url });
}
