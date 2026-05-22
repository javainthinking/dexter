import { redirect, notFound } from 'next/navigation';
import { isLocale } from '../../../lib/i18n/locales';
import { getLocalizedPath } from '../../../lib/i18n/paths';
import { getCurrentUser } from '../../../lib/auth/session';
import { MarketClient } from './market-client';

/**
 * Market section — pulled out of the Indicators view so cross-cutting
 * market-wide surfaces (gainers/losers, sector heatmap, breadth, etc.)
 * have a stable home that isn't gated behind picking a portfolio first.
 * The Indicators page now stays focused on per-watchlist technicals.
 *
 * Auth-gated like the rest of the in-app surfaces; redirects to
 * /sign-in with a callback so the user lands back here after auth.
 */
export const dynamic = 'force-dynamic';

export default async function MarketPage({
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
        getLocalizedPath('/market', lang),
      )}`,
    );
  }

  return <MarketClient />;
}
