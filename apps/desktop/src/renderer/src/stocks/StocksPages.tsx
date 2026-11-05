import { useEffect, useState, type ReactNode } from 'react';
import { navigate } from '../router';
import { useCachedJson, HttpError } from './cache';

// Shared with apps/web: the same views the public /stocks pages render.
import { Sidebar, type SessionSummary } from '@web/components/chat/sidebar';
import { TopBar } from '@web/components/nav/top-bar';
import { Breadcrumbs } from '@web/components/blog/breadcrumbs';
import { Skeleton } from '@web/components/ui/skeleton';
import { useDictionary, useLocale } from '@web/components/i18n/dictionary-provider';
import { StocksIndexView } from '@web/components/stocks/stocks-index-view';
import { StockDetailView, type StockDetailData } from '@web/components/stocks/stock-detail-view';
import { getLocalizedPath } from '@web/lib/i18n/paths';
import { getStockCopy, stockPageLang } from '@web/lib/stocks/copy';
import type { StockSnapshot } from '@web/lib/stocks/snapshot-core';
import { displaySymbol } from '@web/lib/stocks/universe';

/**
 * Desktop stand-ins for web's /stocks and /stocks/[slug] server pages:
 * the same views, fed from /api/stocks/view through the local
 * stale-while-revalidate cache, inside the app shell (chat sidebar +
 * top bar) instead of the marketing header and footer.
 */

export function StocksIndexPage() {
  const locale = useLocale();
  const dict = useDictionary();
  const copy = getStockCopy(stockPageLang(locale));
  const { data, error } = useCachedJson<{ snapshots: Record<string, StockSnapshot | null> }>(
    `/api/stocks/view?locale=${locale}`,
  );

  return (
    <StocksShell title={copy.breadcrumb}>
      {data ? (
        <StocksIndexView
          locale={locale}
          snapshots={data.snapshots}
          breadcrumbs={<Breadcrumbs ariaLabel="Breadcrumb" items={[{ label: dict.nav?.home ?? 'Home', href: '/' }, { label: copy.breadcrumb }]} />}
        />
      ) : error ? (
        <Message text={copy.unavailable} />
      ) : (
        <PageSkeleton />
      )}
    </StocksShell>
  );
}

export function StockDetailPage({ slug }: { slug: string }) {
  const locale = useLocale();
  const dict = useDictionary();
  const copy = getStockCopy(stockPageLang(locale));
  const { data, error } = useCachedJson<StockDetailData>(
    `/api/stocks/view?slug=${encodeURIComponent(slug)}&locale=${locale}`,
  );

  // `NVDA` → `nvda`, `700-hk` → `0700-hk`: switch to the canonical slug, as web redirects.
  const canonical = data?.stock.slug;
  useEffect(() => {
    if (canonical && canonical !== slug) navigate(getLocalizedPath(`/stocks/${canonical}`, locale), { replace: true });
  }, [canonical, slug, locale]);

  const symbol = data?.stock ? displaySymbol(data.stock) : slug.toUpperCase();
  const pageUrl = new URL(getLocalizedPath(`/stocks/${data?.stock.slug ?? slug}`, locale), window.pickskill.apiBase).toString();

  return (
    <StocksShell title={copy.breadcrumb} subtitle={symbol}>
      {data ? (
        <StockDetailView
          locale={locale}
          data={data}
          url={pageUrl}
          metricLabels={{
            latest: dict.indicators?.metrics?.latest ?? 'Last',
            change: dict.indicators?.metrics?.change ?? 'Chg %',
            fiveDayChange: dict.indicators?.metrics?.fiveDayChange ?? '5D %',
          }}
          breadcrumbs={
            <Breadcrumbs
              ariaLabel="Breadcrumb"
              items={[
                { label: dict.nav?.home ?? 'Home', href: '/' },
                { label: copy.breadcrumb, href: '/stocks' },
                { label: symbol },
              ]}
            />
          }
        />
      ) : error ? (
        <Message
          text={error instanceof HttpError && error.status === 404 ? `${slug.toUpperCase()} — 404` : copy.unavailable}
          back={{ label: copy.viewAll, href: getLocalizedPath('/stocks', locale) }}
        />
      ) : (
        <PageSkeleton />
      )}
    </StocksShell>
  );
}

/** Chat sidebar + top bar, as on every other in-app page. */
function StocksShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  const locale = useLocale();
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  useEffect(() => {
    let live = true;
    fetch('/api/sessions?size=50')
      .then((r) => (r.ok ? r.json() : { sessions: [] }))
      .then((d: { sessions?: SessionSummary[] }) => live && setSessions(d.sessions ?? []))
      .catch(() => {})
      .finally(() => live && setSessionsLoading(false));
    return () => {
      live = false;
    };
  }, []);

  const chat = getLocalizedPath('/chat', locale);
  return (
    <div className="flex h-svh w-full bg-background text-foreground">
      <Sidebar
        sessions={sessions}
        loading={sessionsLoading}
        onNew={() => navigate(chat)}
        onSwitch={(id) => navigate(`${chat}?session=${encodeURIComponent(id)}`)}
        onDelete={async (id) => {
          await fetch(`/api/sessions/${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => {});
          setSessions((prev) => prev.filter((s) => s.sessionId !== id));
        }}
      />
      <main className="flex min-w-0 flex-1 flex-col">
        <TopBar title={title} subtitle={subtitle} />
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">{children}</div>
      </main>
    </div>
  );
}

function Message({ text, back }: { text: string; back?: { label: string; href: string } }) {
  return (
    <div className="mx-auto max-w-xl px-5 py-20 text-center text-sm text-muted-foreground">
      <p>{text}</p>
      {back && (
        <button type="button" className="mt-4 underline hover:text-foreground" onClick={() => navigate(back.href)}>
          {back.label}
        </button>
      )}
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-5 py-10 lg:px-8">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
    </div>
  );
}
