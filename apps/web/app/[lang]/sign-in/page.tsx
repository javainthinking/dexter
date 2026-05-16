import { redirect } from 'next/navigation';
import { isLocale } from '../../../lib/i18n/locales';
import { getCurrentUser } from '../../../lib/auth/session';
import { getLocalizedPath } from '../../../lib/i18n/paths';
import { getDictionary } from '../dictionaries';
import { SignInClient } from './sign-in-client';

export default async function SignInPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { lang } = await params;
  const { callbackUrl: rawCallback } = await searchParams;
  if (!isLocale(lang)) {
    redirect('/');
  }

  const user = await getCurrentUser();
  const fallbackTarget = getLocalizedPath('/chat', lang);
  if (user) {
    redirect(rawCallback || fallbackTarget);
  }

  const dict = await getDictionary(lang);
  return (
    <SignInClient
      auth={dict.auth}
      languageLabel={dict.language.label}
      backToHome={dict.auth.backToHome}
      callbackUrl={rawCallback || fallbackTarget}
      googleEnabled={!!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET}
    />
  );
}
