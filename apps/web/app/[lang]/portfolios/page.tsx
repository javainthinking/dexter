import { redirect, notFound } from 'next/navigation';
import { isLocale } from '../../../lib/i18n/locales';
import { getLocalizedPath } from '../../../lib/i18n/paths';
import { getCurrentUser } from '../../../lib/auth/session';
import { listPortfolios, MAX_PORTFOLIOS_PER_USER } from '../../../lib/portfolios';
import { PortfoliosClient } from './portfolios-client';

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

  const initial = await listPortfolios(user.id).catch(() => []);
  return <PortfoliosClient initialPortfolios={initial} maxPortfolios={MAX_PORTFOLIOS_PER_USER} />;
}
