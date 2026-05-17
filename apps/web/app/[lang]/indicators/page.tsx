import { redirect, notFound } from 'next/navigation';
import { isLocale } from '../../../lib/i18n/locales';
import { getLocalizedPath } from '../../../lib/i18n/paths';
import { getCurrentUser } from '../../../lib/auth/session';
import { getHoldings } from '../../../lib/holdings';
import { IndicatorsClient } from './indicators-client';

export default async function IndicatorsPage({
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
        getLocalizedPath('/indicators', lang),
      )}`,
    );
  }

  // Pre-resolve holdings so the client doesn't flash an empty state on first
  // render — if the user already has a saved portfolio, the page lands
  // straight on charts.
  const initialHoldings = await getHoldings(user.id).catch(() => ({
    tickers: [] as string[],
    updatedAt: null as string | null,
    memoryId: null as string | null,
  }));

  return <IndicatorsClient initialTickers={initialHoldings.tickers} />;
}
