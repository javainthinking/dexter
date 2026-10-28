'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, Bot, Flag, Home, LayoutGrid, LineChart } from 'lucide-react';
import { SiteHeaderView } from '../marketing/site-header-view';
import { SiteFooter } from '../marketing/site-footer';
import { CornerMarks } from '../marketing/blueprint';
import { useDictionary, useLocale } from '../i18n/dictionary-provider';
import { getLocalizedPath } from '../../lib/i18n/paths';
import { displaySymbol, getStockBySlug, stockName } from '../../lib/stocks/universe';
import { StockSearch } from '../stocks/stock-search';

/**
 * Body of the localized 404 page. A client component because not-found
 * files receive no route params — the locale and dictionary come from the
 * providers the [lang] layout already mounts around it.
 */

const POPULAR = ['nvda', 'tsla', 'aapl', '0700-hk', '9988-hk', '600519-sh', '300750-sz'];

/** A price line that rallies, crashes and flatlines into the 404 marker. */
function CrashChart({ label }: { label: string }) {
  const pts = [
    [0, 150], [40, 138], [80, 144], [120, 120], [160, 126], [200, 102], [240, 110], [280, 84],
    [320, 92], [360, 66], [400, 74], [440, 52], [470, 58], [500, 196],
  ];
  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ');
  return (
    <svg viewBox="0 0 640 230" className="h-auto w-full" role="img" aria-label={label}>
      {[50, 100, 150, 200].map((y) => (
        <line key={y} x1="0" x2="640" y1={y} y2={y} stroke="currentColor" strokeOpacity="0.08" />
      ))}
      <path d={line} fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" className="text-foreground" />
      <path d="M500,196 L620,196" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="6 8" className="text-down" />
      <circle cx="500" cy="196" r="7" fill="currentColor" className="text-down" />
      <circle cx="620" cy="196" r="5" fill="currentColor" className="text-down" opacity="0.6" />
      <text x="620" y="182" textAnchor="end" fill="currentColor" className="text-down font-mono" fontSize="22" fontWeight="700">
        404
      </text>
    </svg>
  );
}

export function NotFoundView() {
  const dict = useDictionary();
  const locale = useLocale();
  const t = dict.notFound;
  const href = (path: string) => getLocalizedPath(path, locale);
  const nameLang = locale === 'zh-TW' || locale === 'zh-CN' ? locale : 'en';

  const links = [
    { key: 'home', path: '/', icon: Home },
    { key: 'stocks', path: '/stocks', icon: LineChart },
    { key: 'chat', path: '/chat', icon: Bot },
    { key: 'features', path: '/features', icon: LayoutGrid },
    { key: 'blog', path: '/blog', icon: BookOpen },
    { key: 'feedback', path: '/feedback', icon: Flag },
  ] as const;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeaderView lang={locale} dict={dict} />

      <main className="flex-1">
        <section className="border-b border-border">
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 border-border px-5 py-14 lg:grid-cols-[1.05fr_1fr] lg:border-x lg:px-8 lg:py-20">
            <CornerMarks />
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-down">{t.eyebrow}</p>
              <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
                {t.headline}
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">{t.sub}</p>

              <StockSearch
                className="mt-8"
                locale={locale}
                lang={nameLang}
                labels={{
                  label: t.searchLabel,
                  placeholder: t.searchPlaceholder,
                  button: t.searchButton,
                  generating: t.searchGenerating,
                  featured: t.searchFeatured,
                  empty: t.searchEmpty,
                  markets: t.markets,
                }}
              />

              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">{t.popular}</span>
                {POPULAR.map((slug) => {
                  const s = getStockBySlug(slug);
                  if (!s) return null;
                  const name = stockName(s, nameLang);
                  return (
                    <Link
                      key={slug}
                      href={href(`/stocks/${slug}`)}
                      className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
                    >
                      <span className="font-mono font-semibold text-foreground">{displaySymbol(s)}</span> {name}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="relative rounded-xl border border-border bg-card p-5 sm:p-7">
              <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
                <span>pickskill.ai</span>
                <span className="text-down">−100.00%</span>
              </div>
              <div className="mt-2 font-mono text-7xl font-semibold tracking-tight text-foreground sm:text-8xl">404</div>
              <div className="mt-4">
                <CrashChart label={t.chartLabel} />
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="relative mx-auto max-w-6xl border-border px-5 py-12 lg:border-x lg:px-8">
            <CornerMarks />
            <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-subtle">{t.linksHeading}</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {links.map(({ key, path, icon: Icon }) => (
                <Link
                  key={key}
                  href={href(path)}
                  className="group flex items-start gap-4 rounded-lg border border-border bg-card p-5 transition-colors hover:border-border-strong hover:bg-muted/40"
                >
                  <Icon className="mt-0.5 size-5 shrink-0 text-[color:var(--accent)]" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium text-foreground">{t.links[key].title}</span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">{t.links[key].desc}</span>
                  </span>
                  <ArrowRight className="mt-1 size-4 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter lang={locale} dict={dict} />
    </div>
  );
}
