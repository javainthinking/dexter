import { redirect, notFound } from 'next/navigation';
import { isLocale } from '../../../../lib/i18n/locales';
import { getLocalizedPath } from '../../../../lib/i18n/paths';
import { getCurrentUser } from '../../../../lib/auth/session';
import {
  createDesktopAuthCode,
  isValidCodeChallenge,
  isValidDesktopRedirect,
  isValidState,
} from '../../../../lib/auth/desktop';
import { getDictionary } from '../../dictionaries';
import { DesktopHandoff, DesktopGoogleStart } from './desktop-handoff';

/**
 * /desktop/authorize?state&code_challenge&code_challenge_method=S256&redirect_uri[&provider=google]
 *
 * Opened by the desktop app in the system browser (see lib/auth/desktop.ts).
 * With provider=google the page goes straight to Google's account picker —
 * even when the browser already has a web session, so the user picks the
 * account explicitly — then comes back here without `provider`. Once signed
 * in it mints a one-time code and redirects to the app's loopback
 * redirect_uri. Each render mints a fresh code (2-minute TTL).
 */

export const dynamic = 'force-dynamic';

const googleEnabled = () => !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;

export default async function DesktopAuthorizePage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{
    state?: string;
    code_challenge?: string;
    code_challenge_method?: string;
    redirect_uri?: string;
    provider?: string;
  }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const query = await searchParams;
  const dict = await getDictionary(lang);

  const valid =
    isValidState(query.state) &&
    isValidCodeChallenge(query.code_challenge) &&
    isValidDesktopRedirect(query.redirect_uri) &&
    (query.code_challenge_method ?? 'S256') === 'S256';
  if (!valid) {
    return <DesktopHandoff copy={dict.desktopAuth} redirectTo={null} />;
  }

  const self = `${getLocalizedPath('/desktop/authorize', lang)}?${new URLSearchParams({
    state: query.state!,
    code_challenge: query.code_challenge!,
    code_challenge_method: 'S256',
    redirect_uri: query.redirect_uri!,
  })}`;

  if (query.provider === 'google' && googleEnabled()) {
    return <DesktopGoogleStart label={dict.auth.continueWithGoogle} callbackUrl={self} />;
  }

  const user = await getCurrentUser();
  if (!user) {
    redirect(`${getLocalizedPath('/sign-in', lang)}?callbackUrl=${encodeURIComponent(self)}`);
  }

  const code = await createDesktopAuthCode(user.id, query.code_challenge!);
  const redirectTo = `${query.redirect_uri}?${new URLSearchParams({ code, state: query.state! })}`;
  return <DesktopHandoff copy={dict.desktopAuth} redirectTo={redirectTo} />;
}
