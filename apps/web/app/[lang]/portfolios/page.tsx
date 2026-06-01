import { redirect, notFound } from 'next/navigation';
import { isLocale } from '../../../lib/i18n/locales';
import { getLocalizedPath } from '../../../lib/i18n/paths';
import { getCurrentUser } from '../../../lib/auth/session';
import { listPortfolios } from '../../../lib/portfolios';
import { getUserPlan } from '../../../lib/billing';
import { PortfoliosClient } from './portfolios-client';

// Force a fresh DB read on every request. Without this, edge-cached SSR
// would happily serve an empty list to a user who created a portfolio
// on a different device — and the client doesn't auto-refetch on a
// soft-nav hit.
export const dynamic = 'force-dynamic';

export default async function PortfoliosPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const user = await getCurrentUser();
  if (!user) {
    redirect(
      `${getLocalizedPath('/sign-in', lang)}?callbackUrl=${encodeURIComponent(
        getLocalizedPath('/portfolios', lang),
      )}`,
    );
  }

  // Log SSR failures rather than silently rendering an empty page —
  // an unhandled DB error here used to look identical to "no portfolios"
  // from the user's perspective.
  let initial: Awaited<ReturnType<typeof listPortfolios>> = [];
  try {
    initial = await listPortfolios(user.id);
  } catch (err) {
    console.error('portfolios SSR list_failed:', err);
  }
  const { plan } = await getUserPlan(user.id);
  return <PortfoliosClient initialPortfolios={initial} plan={plan} />;
}
