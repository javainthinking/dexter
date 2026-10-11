import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth/session';
import { getUserPlan } from '../../../../lib/billing';

/** GET /api/desktop/me — who the desktop token belongs to, plus their plan. */

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(): Promise<Response> {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  const { plan } = await getUserPlan(user.id);
  return NextResponse.json({ user, plan });
}
