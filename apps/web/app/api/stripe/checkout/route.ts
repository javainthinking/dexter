import { NextResponse, type NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { getDb } from '@dexter/core/db/client';
import { users } from '@dexter/core/db/schema/auth';
import { getCurrentUser } from '@/lib/auth/session';
import { ensureStripeCustomer, stripe } from '@/lib/stripe';
import { getStripePriceId, type BillingInterval, type PaidPlan } from '@/lib/plans';

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

  // Already paying → Checkout would create a parallel sub. Send to portal.
  if (user.stripeSubscriptionId && user.stripeStatus === 'active') {
    return NextResponse.json({ error: 'already_subscribed', code: 'ALREADY_SUBSCRIBED' }, { status: 409 });
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
