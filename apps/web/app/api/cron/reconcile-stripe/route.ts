import { NextResponse, type NextRequest } from 'next/server';
import { isNotNull } from 'drizzle-orm';
import { getDb } from '@dexter/core/db/client';
import { users } from '@dexter/core/db/schema/auth';
import { syncUserFromStripe } from '@/lib/stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

/**
 * Daily reconciliation: re-pull every paying user's subscription from
 * Stripe and mirror it to the DB. Catches missed webhooks (rare but
 * inevitable). Authorized by the Vercel cron Bearer token.
 */
export async function GET(request: NextRequest): Promise<Response> {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const rows = await getDb()
    .select({ id: users.id })
    .from(users)
    .where(isNotNull(users.stripeCustomerId))
    .limit(500);

  let ok = 0;
  let failed = 0;
  for (const r of rows) {
    try {
      await syncUserFromStripe(r.id);
      ok += 1;
    } catch (err) {
      failed += 1;
      console.error(
        JSON.stringify({ level: 'error', route: '/api/cron/reconcile-stripe', userId: r.id, error: String(err) }),
      );
    }
  }

  return NextResponse.json({ reconciled: ok, failed });
}
