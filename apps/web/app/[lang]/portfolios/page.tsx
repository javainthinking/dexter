import { redirect, notFound } from 'next/navigation';
import { isLocale } from '../../../lib/i18n/locales';
import { getLocalizedPath } from '../../../lib/i18n/paths';
import { getCurrentUser } from '../../../lib/auth/session';
import { listPortfolios } from '../../../lib/portfolios';
import { getUserPlan } from '../../../lib/billing';
import { tickerToSlug } from '../../../lib/stocks/universe';
import { PortfoliosClient, type PendingAdd } from './portfolios-client';

// Force a fresh DB read on every request. Without this, edge-cached SSR
// would happily serve an empty list to a user who created a portfolio
// on a different device — and the client doesn't auto-refetch on a
// soft-nav hit.
export const dynamic = 'force-dynamic';

/**
 * `?add=<ticker>&name=…&exchange=…` comes from the public stock pages'
 * "Add to portfolio" button. Only tickers that map to a stock page are
 * honoured; name / exchange are display-only and length-capped.
 */
function parsePendingAdd(q: Record<string, string | string[] | undefined>): PendingAdd | null {
  const one = (v: string | string[] | undefined) => (typeof v === 'string' ? v.trim() : '');
  const ticker = one(q.add).toUpperCase();
  if (!ticker || !tickerToSlug(ticker)) return null;
  return {
    ticker,
    name: one(q.name).slice(0, 120) || null,
    exchange: one(q.exchange).slice(0, 40) || null,
  };
}

export default async function PortfoliosPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const pendingAdd = parsePendingAdd(await searchParams);

  const user = await getCurrentUser();
  if (!user) {
    // Keep the pending ticker through sign-in / sign-up so the add
    // dialog is waiting when the user comes back.
    const back = getLocalizedPath('/portfolios', lang);
    const query = pendingAdd
      ? `?${new URLSearchParams({
          add: pendingAdd.ticker,
          ...(pendingAdd.name ? { name: pendingAdd.name } : {}),
          ...(pendingAdd.exchange ? { exchange: pendingAdd.exchange } : {}),
        })}`
      : '';
    redirect(`${getLocalizedPath('/sign-in', lang)}?callbackUrl=${encodeURIComponent(back + query)}`);
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
  return <PortfoliosClient initialPortfolios={initial} plan={plan} pendingAdd={pendingAdd} />;
}
