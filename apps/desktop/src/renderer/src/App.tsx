import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import type { AccountState } from '../../shared/ipc';
import { navigate, useLocation, useRefreshKey } from './router';
import { DesktopSessionProvider } from './shims/next-auth-react';
import { dictionaries } from './dictionaries';

// Shared with apps/web — the same components pickskill.ai renders.
import { Providers } from '@web/app/providers';
import { DictionaryProvider } from '@web/components/i18n/dictionary-provider';
import { LangSetter } from '@web/components/i18n/lang-setter';
import { UpgradeDialogProvider } from '@web/components/upgrade/upgrade-dialog-provider';
import { getLocalizedPath, readLocaleFromPath, stripLocalePrefix } from '@web/lib/i18n/paths';
import type { PlanId } from '@web/lib/plans';
import { SignInClient } from '@web/app/[lang]/sign-in/sign-in-client';

const PortfoliosClient = lazy(() => import('@web/app/[lang]/portfolios/portfolios-client').then((m) => ({ default: m.PortfoliosClient })));
const IndicatorsClient = lazy(() => import('@web/app/[lang]/indicators/indicators-client').then((m) => ({ default: m.IndicatorsClient })));
const MarketClient = lazy(() => import('@web/app/[lang]/market/market-client').then((m) => ({ default: m.MarketClient })));
const MemoryClient = lazy(() => import('@web/app/[lang]/memory/memory-client').then((m) => ({ default: m.MemoryClient })));
const FeedbackClient = lazy(() => import('@web/app/[lang]/feedback/feedback-client').then((m) => ({ default: m.FeedbackClient })));
const ChatRoute = lazy(() => import('@web/app/[lang]/chat/page'));

type PortfolioList = Parameters<typeof PortfoliosClient>[0]['initialPortfolios'];

export function App() {
  const [account, setAccount] = useState<AccountState | null>(null);

  useEffect(() => {
    void window.pickskill.account.get().then(setAccount);
    return window.pickskill.account.onChange(setAccount);
  }, []);

  if (!account) return null;
  return (
    <DesktopSessionProvider account={account}>
      <Providers>
        <Localized>{account.status === 'signed-in' ? <Routes plan={(account.plan ?? 'free') as PlanId} /> : <SignIn account={account} />}</Localized>
      </Providers>
    </DesktopSessionProvider>
  );
}

function Localized({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const locale = readLocaleFromPath(pathname);
  return (
    <DictionaryProvider locale={locale} dict={dictionaries[locale]}>
      <LangSetter locale={locale} />
      <UpgradeDialogProvider>{children}</UpgradeDialogProvider>
    </DictionaryProvider>
  );
}

/** Desktop stand-ins for web's server `page.tsx` files: fetch what SSR would have passed as props. */
function Routes({ plan }: { plan: PlanId }) {
  const { pathname } = useLocation();
  const locale = readLocaleFromPath(pathname);
  const path = stripLocalePrefix(pathname) || '/';

  useEffect(() => {
    if (path === '/') navigate(getLocalizedPath('/portfolios', locale), { replace: true });
  }, [path, locale]);

  let page: ReactNode = null;
  if (path === '/portfolios') page = <WithPortfolios>{(p) => <PortfoliosClient initialPortfolios={p} plan={plan} />}</WithPortfolios>;
  else if (path === '/indicators') page = <WithPortfolios>{(p) => <IndicatorsClient initialPortfolios={p} />}</WithPortfolios>;
  else if (path === '/market') page = <MarketClient />;
  else if (path === '/memory') page = <MemoryClient />;
  else if (path === '/feedback') page = <FeedbackClient />;
  else if (path === '/chat') page = <ChatRoute />;
  else if (path !== '/') page = <OpenOnWeb path={pathname} />;

  return <Suspense fallback={<Splash />}>{page}</Suspense>;
}

function WithPortfolios({ children }: { children: (p: PortfolioList) => ReactNode }) {
  const refreshKey = useRefreshKey();
  const [list, setList] = useState<PortfolioList | null>(null);
  useEffect(() => {
    let live = true;
    fetch('/api/portfolios', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : { portfolios: [] }))
      .then((d: { portfolios: PortfolioList }) => live && setList(d.portfolios))
      .catch(() => live && setList([]));
    return () => {
      live = false;
    };
  }, [refreshKey]);
  return list ? <>{children(list)}</> : <Splash />;
}

/** Account, pricing, blog… live on pickskill.ai; open them in the browser. */
function OpenOnWeb({ path }: { path: string }) {
  useEffect(() => {
    window.open(new URL(path, window.pickskill.apiBase).toString(), '_blank');
    window.history.length > 1 ? window.history.back() : navigate('/portfolios', { replace: true });
  }, [path]);
  return <Splash />;
}

function Splash() {
  return <div className="desktop-drag h-screen w-full bg-background" />;
}

/** web's own sign-in page (email + code); main turns the verified code into a desktop token. */
function SignIn({ account }: { account: AccountState }) {
  const { pathname } = useLocation();
  const locale = readLocaleFromPath(pathname);
  const dict = dictionaries[locale];
  return (
    <div className="desktop-signin">
      {account.error && (
        <div className="fixed inset-x-0 top-16 z-10 mx-auto w-fit rounded-md border border-border bg-muted px-3 py-1.5 text-sm text-muted-foreground">
          {account.error}
        </div>
      )}
      <SignInClient
        auth={dict.auth}
        languageLabel={dict.language.label}
        backToHome={dict.auth.backToHome}
        // Account state flips to signed-in before the form's post-verify
        // `location.href = callbackUrl`; '#' keeps that a same-document jump.
        callbackUrl="#"
        googleEnabled={false}
      />
    </div>
  );
}
