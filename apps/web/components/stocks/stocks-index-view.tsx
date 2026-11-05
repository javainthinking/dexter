import type { ReactNode } from 'react';
import type { Locale } from '../../lib/i18n/locales';
import { CornerMarks } from '../marketing/blueprint';
import { StockCard } from './stock-card';
import { StockSearch } from './stock-search';
import { getStockCopy, stockPageLang } from '../../lib/stocks/copy';
import type { StockSnapshot } from '../../lib/stocks/snapshot-core';
import { STOCKS, STOCK_MARKETS } from '../../lib/stocks/universe';

/**
 * Body of the /stocks index — search plus the curated tickers by market.
 * Rendered by the web server page and, from /api/stocks/view, by the
 * desktop app.
 */
export function StocksIndexView({
  locale,
  snapshots,
  breadcrumbs,
}: {
  locale: Locale;
  /** Keyed by ticker; null when that ticker's data is unavailable. */
  snapshots: Record<string, StockSnapshot | null>;
  breadcrumbs?: ReactNode;
}) {
  const lang = stockPageLang(locale);
  const copy = getStockCopy(lang);
  return (
    <>
      <section className="border-b border-border">
        <div className="relative mx-auto max-w-6xl border-border px-5 pt-8 lg:border-x lg:px-8">
          <CornerMarks />
          {breadcrumbs}
          <div className="pb-12 pt-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">{copy.index.eyebrow}</p>
            <h1 className="mt-3 max-w-3xl font-serif text-3xl font-semibold leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl">
              {copy.index.headline}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {copy.index.sub}
            </p>
            <StockSearch
              className="mt-8"
              locale={locale}
              lang={lang}
              labels={{ ...copy.search, markets: copy.market }}
            />
          </div>
        </div>
      </section>

      {STOCK_MARKETS.map((market) => (
        <section key={market} className="border-b border-border">
          <div className="relative mx-auto max-w-6xl border-border px-5 py-12 lg:border-x lg:px-8">
            <CornerMarks />
            <h2 className="font-serif text-2xl font-semibold tracking-tight">{copy.market[market]}</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {STOCKS.filter((s) => s.market === market).map((s) => (
                <StockCard
                  key={s.slug}
                  stock={s}
                  snapshot={snapshots[s.ticker] ?? null}
                  lang={lang}
                  locale={locale}
                  copy={copy}
                />
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="border-b border-border">
        <div className="relative mx-auto max-w-6xl border-border px-5 py-10 lg:border-x lg:px-8">
          <CornerMarks />
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">{copy.disclaimerTitle}.</span> {copy.disclaimer}
          </p>
        </div>
      </section>

    </>
  );
}
