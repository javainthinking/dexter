import { NextResponse, type NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { getDb } from '@dexter/core/db/client';
import { users } from '@dexter/core/db/schema/auth';
import { getCurrentUser } from '@/lib/auth/session';
import { stripe } from '@/lib/stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

/** POST { locale } → Stripe Billing Portal URL (manage / cancel / switch). */
export async function POST(request: NextRequest): Promise<Response> {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as { locale?: string };
  const locale = body.locale && /^[a-zA-Z-]+$/.test(body.locale) ? body.locale : 'en';

  const [user] = await getDb()
    .select({ stripeCustomerId: users.stripeCustomerId })
    .from(users)
    .where(eq(users.id, sessionUser.id))
    .limit(1);
  if (!user?.stripeCustomerId) {
    return NextResponse.json({ error: 'no_customer' }, { status: 400 });
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${APP_URL}/${locale}/pricing`,
  });

  return NextResponse.json({ url: portal.url });
}
