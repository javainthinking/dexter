import { redirect, notFound } from 'next/navigation';
import { isLocale } from '../../../lib/i18n/locales';
import { getLocalizedPath } from '../../../lib/i18n/paths';
import { getCurrentUser } from '../../../lib/auth/session';
import { listPortfolios } from '../../../lib/portfolios';
import { IndicatorsClient } from './indicators-client';

// Always read portfolios fresh — otherwise edge-cached SSR can serve an
// empty list to a user who just created portfolios in another tab.
export const dynamic = 'force-dynamic';

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

  let initialPortfolios: Awaited<ReturnType<typeof listPortfolios>> = [];
  try {
    initialPortfolios = await listPortfolios(user.id);
  } catch (err) {
    console.error('indicators SSR list_failed:', err);
  }
  return <IndicatorsClient initialPortfolios={initialPortfolios} />;
}
