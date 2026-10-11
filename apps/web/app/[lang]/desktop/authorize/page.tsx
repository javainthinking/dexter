import { redirect, notFound } from 'next/navigation';
import { isLocale } from '../../../../lib/i18n/locales';
import { getLocalizedPath } from '../../../../lib/i18n/paths';
import { getCurrentUser } from '../../../../lib/auth/session';
import {
  DESKTOP_REDIRECT_URI,
  createDesktopAuthCode,
  isValidCodeChallenge,
  isValidState,
} from '../../../../lib/auth/desktop';
import { getDictionary } from '../../dictionaries';
import { DesktopHandoff } from './desktop-handoff';

/**
 * /desktop/authorize?state=…&code_challenge=…&code_challenge_method=S256
 *
 * Opened by the desktop app in the system browser. After the normal web
 * sign-in, mints a one-time code and bounces back to pickskill://auth/callback.
 * Each render mints a fresh code (2-minute TTL), so a reload is harmless.
 */

export const dynamic = 'force-dynamic';

export default async function DesktopAuthorizePage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ state?: string; code_challenge?: string; code_challenge_method?: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const query = await searchParams;
  const dict = await getDictionary(lang);

  const valid =
    isValidState(query.state) &&
    isValidCodeChallenge(query.code_challenge) &&
    (query.code_challenge_method ?? 'S256') === 'S256';
  if (!valid) {
    return <DesktopHandoff copy={dict.desktopAuth} deepLink={null} />;
  }

  const user = await getCurrentUser();
  if (!user) {
    const self = `${getLocalizedPath('/desktop/authorize', lang)}?${new URLSearchParams({
      state: query.state!,
      code_challenge: query.code_challenge!,
      code_challenge_method: 'S256',
    })}`;
    redirect(`${getLocalizedPath('/sign-in', lang)}?callbackUrl=${encodeURIComponent(self)}`);
  }

  const code = await createDesktopAuthCode(user.id, query.code_challenge!);
  const deepLink = `${DESKTOP_REDIRECT_URI}?${new URLSearchParams({ code, state: query.state! })}`;
  return <DesktopHandoff copy={dict.desktopAuth} deepLink={deepLink} />;
}
