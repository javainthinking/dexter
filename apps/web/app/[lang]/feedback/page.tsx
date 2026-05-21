import { redirect, notFound } from 'next/navigation';
import { isLocale } from '../../../lib/i18n/locales';
import { getLocalizedPath } from '../../../lib/i18n/paths';
import { getCurrentUser } from '../../../lib/auth/session';
import { FeedbackClient } from './feedback-client';

/**
 * /[lang]/feedback — the public-facing "send us feedback" surface.
 * Auth-gated so we can attribute reports + reply to a real user; an
 * anonymous version (for the marketing landing) can be a separate
 * surface later.
 */
export default async function FeedbackPage({
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
        getLocalizedPath('/feedback', lang),
      )}`,
    );
  }

  return <FeedbackClient />;
}
