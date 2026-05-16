import { redirect, notFound } from 'next/navigation';
import { isLocale } from '../../../lib/i18n/locales';
import { getLocalizedPath } from '../../../lib/i18n/paths';
import { getCurrentUser } from '../../../lib/auth/session';
import { MemoryClient } from './memory-client';

export default async function MemoryPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const user = await getCurrentUser();
  if (!user) {
    redirect(`${getLocalizedPath('/sign-in', lang)}?callbackUrl=${encodeURIComponent(getLocalizedPath('/memory', lang))}`);
  }

  return <MemoryClient />;
}
