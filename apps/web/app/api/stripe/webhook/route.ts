import { NextResponse, type NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import type Stripe from 'stripe';
import { getDb } from '@dexter/core/db/client';
import { users } from '@dexter/core/db/schema/auth';
import { stripe, syncUserFromStripe } from '@/lib/stripe';

// Stripe needs the raw request body to verify the signature, so read it as
// text. Node runtime (not edge).
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

const RELEVANT = new Set([
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.paid',
  'invoice.payment_failed',
]);

export async function POST(request: NextRequest): Promise<Response> {
  if (!WEBHOOK_SECRET) {
    console.error(JSON.stringify({ level: 'error', route: '/api/stripe/webhook', msg: 'no_webhook_secret' }));
    return NextResponse.json({ error: 'webhook not configured' }, { status: 500 });
  }

  const body = await request.text();
  const sig = request.headers.get('stripe-signature');
  if (!sig) return NextResponse.json({ error: 'missing signature' }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch (err) {
    console.error(
      JSON.stringify({ level: 'error', route: '/api/stripe/webhook', msg: 'bad_signature', error: String(err) }),
    );
    return NextResponse.json({ error: 'invalid signature' }, { status: 400 });
  }

  if (!RELEVANT.has(event.type)) return NextResponse.json({ ok: true, ignored: true });

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = (session.metadata?.userId as string) || null;
        if (userId) await syncUserFromStripe(userId);
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const userId = await userIdForSubscription(sub);
        if (userId) await syncUserFromStripe(userId);
        break;
      }
      case 'invoice.paid':
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;
        if (customerId) {
          const userId = await userIdForCustomer(customerId);
          if (userId) await syncUserFromStripe(userId);
        }
        break;
      }
    }
  } catch (err) {
    console.error(
      JSON.stringify({ level: 'error', route: '/api/stripe/webhook', type: event.type, msg: 'handler_failed', error: String(err) }),
    );
    return NextResponse.json({ error: 'handler failed' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

async function userIdForSubscription(sub: Stripe.Subscription): Promise<string | null> {
  const fromMeta = (sub.metadata?.userId as string) || null;
  if (fromMeta) return fromMeta;
  const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
  return userIdForCustomer(customerId);
}

async function userIdForCustomer(customerId: string): Promise<string | null> {
  const [u] = await getDb()
    .select({ id: users.id })
    .from(users)
    .where(eq(users.stripeCustomerId, customerId))
    .limit(1);
  return u?.id ?? null;
}
