'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowUpRight, LineChart } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getLocalizedPath } from '../../lib/i18n/paths';
import type { Locale } from '../../lib/i18n/locales';
import { useLocale } from '../i18n/dictionary-provider';
import {
  DIMENSION_BUCKET_LABELS,
  DIMENSION_FALLBACK_LABEL,
  DIMENSION_KEYS,
} from '../../lib/indicators/labels';
import type { Bucket } from '../../lib/indicators/math';
import type {
  CardTone,
  IndicatorCardData,
  IndicatorCardResult,
} from '../../lib/stocks/indicator-card-types';

/**
 * Inline technical-indicator cards for the chat. Rendered where an
 * assistant answer contains an ```indicators block (one Yahoo ticker per
 * line). Each card shows the price curve with its 20-day average, the
 * day / 5-day move, and the latest signal of all 8 indicators with a
 * 5-day trail; the whole card links to the ticker's /stocks page.
 *
 * Data comes from /api/stocks/indicator-cards, which reads the same
 * cached snapshot as the /stocks pages, so card and page always agree.
 */

type CardLang = 'en' | 'zh-CN' | 'zh-TW';

const COPY: Record<
  CardLang,
  {
    heading: string;
    view: string;
    asOf: string;
    unavailable: string;
    bucket: Record<Bucket, string>;
  }
> = {
  en: {
    heading: 'Technical indicators',
    view: 'View indicators',
    asOf: 'As of',
    unavailable: 'Indicator data unavailable',
    bucket: { bullish: 'Bull', bearish: 'Bear', neutral: 'Neutral' },
  },
  'zh-CN': {
    heading: '技术指标',
    view: '查看指标',
    asOf: '数据日期',
    unavailable: '暂无指标数据',
    bucket: { bullish: '看多', bearish: '看空', neutral: '中性' },
  },
  'zh-TW': {
    heading: '技術指標',
    view: '查看指標',
    asOf: '資料日期',
    unavailable: '暫無指標資料',
    bucket: { bullish: '看多', bearish: '看空', neutral: '中性' },
  },
};

function cardLang(locale: Locale): CardLang {
  return locale === 'zh-CN' || locale === 'zh-TW' ? locale : 'en';
}

const TONE_CLASS: Record<CardTone, string> = {
  bullish: 'border-up/40 bg-up/10 text-up',
  bearish: 'border-down/40 bg-down/10 text-down',
  mixed: 'border-border bg-muted text-foreground',
  neutral: 'border-border bg-muted text-muted-foreground',
};

const BUCKET_TEXT: Record<Bucket, string> = {
  bullish: 'text-up',
  bearish: 'text-down',
  neutral: 'text-muted-foreground',
};

const BUCKET_DOT: Record<Bucket, string> = {
  bullish: 'bg-up',
  bearish: 'bg-down',
  neutral: 'bg-muted-foreground/40',
};

function formatSignedPct(v: number | null | undefined): string {
  if (v == null || !Number.isFinite(v)) return '—';
  return `${v > 0 ? '+' : ''}${v.toFixed(2)}%`;
}

function signClass(v: number | null | undefined): string {
  if (v == null || !Number.isFinite(v) || v === 0) return 'text-muted-foreground';
  return v > 0 ? 'text-up' : 'text-down';
}

function formatPrice(v: number | null): string {
  if (v == null || !Number.isFinite(v)) return '—';
  return v >= 1000 ? v.toFixed(0) : v.toFixed(2);
}

/**
 * Pull the tickers out of an ```indicators block body: one per line (commas
 * also accepted), uppercased, deduped, capped at 4 — the API's limit.
 */
export function parseIndicatorTickers(body: string): string[] {
  const out: string[] = [];
  for (const raw of body.split(/[\n,]/)) {
    const t = raw.trim().replace(/^[-*`\s]+|[`\s]+$/g, '').toUpperCase();
    if (/^[A-Z0-9][A-Z0-9.\-]{0,14}$/.test(t) && !out.includes(t)) out.push(t);
    if (out.length === 4) break;
  }
  return out;
}

// Module-level cache so remounts (session switches, re-renders of
// history) don't refetch the same tickers within a page lifetime.
const cache = new Map<string, Promise<IndicatorCardResult[]>>();

function loadCards(tickers: string[], locale: Locale): Promise<IndicatorCardResult[]> {
  const key = `${locale}|${tickers.join(',')}`;
  let p = cache.get(key);
  if (!p) {
    p = fetch(
      `/api/stocks/indicator-cards?tickers=${encodeURIComponent(tickers.join(','))}&locale=${encodeURIComponent(locale)}`,
    )
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as { results?: IndicatorCardResult[] };
        return json.results ?? [];
      })
      .catch((err) => {
        cache.delete(key);
        throw err;
      });
    cache.set(key, p);
  }
  return p;
}

export function IndicatorCards({ tickers }: { tickers: string[] }) {
  const locale = useLocale();
  const lang = cardLang(locale);
  const [results, setResults] = React.useState<IndicatorCardResult[] | null>(null);
  const [failed, setFailed] = React.useState(false);
  const key = tickers.join(',');

  React.useEffect(() => {
    let alive = true;
    setResults(null);
    setFailed(false);
    loadCards(tickers, locale)
      .then((r) => alive && setResults(r))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, locale]);

  if (tickers.length === 0) return null;
  // A failed request shows nothing: the cards are an enhancement on top
  // of a complete written answer, never the answer itself.
  if (failed) return null;

  const cards = results?.filter((r): r is IndicatorCardData => !('error' in r)) ?? null;
  if (results && cards && cards.length === 0) return null;

  return (
    <div className="not-prose my-4" aria-label={COPY[lang].heading}>
      <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <LineChart className="h-3.5 w-3.5" aria-hidden="true" />
        {COPY[lang].heading}
      </div>
      <div className={cn('grid gap-3', tickers.length > 1 && 'sm:grid-cols-2')}>
        {cards
          ? cards.map((c) => <IndicatorCard key={c.ticker} card={c} lang={lang} locale={locale} />)
          : tickers.map((t) => <CardSkeleton key={t} />)}
      </div>
    </div>
  );
}

function IndicatorCard({ card, lang, locale }: { card: IndicatorCardData; lang: CardLang; locale: Locale }) {
  const copy = COPY[lang];
  const labelLang = lang === 'en' ? 'en' : 'zh';
  return (
    <Link
      href={getLocalizedPath(`/stocks/${card.slug}`, locale)}
      target="_blank"
      className="group flex flex-col gap-3 rounded-lg border border-border bg-card p-4 no-underline transition-colors hover:border-border-strong hover:bg-muted/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-mono text-sm font-semibold text-foreground">{card.symbol}</div>
          <div className="truncate text-xs text-muted-foreground">{card.name}</div>
        </div>
        <span
          className={cn('shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium', TONE_CLASS[card.tone])}
          title={card.tallyText}
        >
          {card.toneLabel}
        </span>
      </div>

      <div className="flex items-baseline gap-3 font-mono tabular-nums">
        <span className="text-lg font-semibold text-foreground">{formatPrice(card.close)}</span>
        <span className={cn('text-xs', signClass(card.changePct))}>{formatSignedPct(card.changePct)}</span>
        <span className={cn('text-xs', signClass(card.fiveDayChangePct))}>
          5D {formatSignedPct(card.fiveDayChangePct)}
        </span>
      </div>

      <PriceCurve closes={card.closes} />

      <div className="grid grid-cols-4 gap-1.5">
        {DIMENSION_KEYS.map((k) => {
          const d = card.dims[k];
          return (
            <div
              key={k}
              className="rounded-md border border-border/70 px-1.5 py-1"
              title={`${DIMENSION_FALLBACK_LABEL[k]} · ${DIMENSION_BUCKET_LABELS[k][d.bucket][labelLang]}`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-medium text-muted-foreground">{DIMENSION_FALLBACK_LABEL[k]}</span>
                <span className={cn('text-[10px] font-semibold', BUCKET_TEXT[d.bucket])}>{copy.bucket[d.bucket]}</span>
              </div>
              <div className="mt-1 flex gap-0.5" aria-hidden="true">
                {d.trail.map((b, i) => (
                  <span key={i} className={cn('h-1 flex-1 rounded-full', BUCKET_DOT[b])} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
        <span className="truncate">
          {copy.asOf} {card.asOf} · {card.tallyText}
        </span>
        <span className="flex shrink-0 items-center gap-0.5 font-medium text-foreground group-hover:underline">
          {copy.view}
          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

/** Close-price curve with a 20-day moving average, coloured by window direction. */
function PriceCurve({ closes }: { closes: Array<number | null> }) {
  const gradientId = React.useId();
  const pts = closes.map((c) => (c != null && Number.isFinite(c) ? c : null));
  const valid = pts.filter((c): c is number => c != null);
  if (valid.length < 2) return null;

  const ma: Array<number | null> = pts.map((_, i) => {
    if (i < 19) return null;
    const win = pts.slice(i - 19, i + 1);
    if (win.some((v) => v == null)) return null;
    return (win as number[]).reduce((a, b) => a + b, 0) / 20;
  });

  const W = 300;
  const H = 72;
  const all = [...valid, ...ma.filter((v): v is number => v != null)];
  const min = Math.min(...all);
  const max = Math.max(...all);
  const span = max - min || 1;
  const x = (i: number) => (i / (pts.length - 1)) * W;
  const y = (v: number) => H - 3 - ((v - min) / span) * (H - 6);

  const path = (series: Array<number | null>) => {
    let d = '';
    let pen = false;
    series.forEach((v, i) => {
      if (v == null) {
        pen = false;
        return;
      }
      d += `${pen ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`;
      pen = true;
    });
    return d;
  };

  const line = path(pts);
  const firstIdx = pts.findIndex((v) => v != null);
  let lastIdx = pts.length - 1;
  while (lastIdx > 0 && pts[lastIdx] == null) lastIdx--;
  const area = `${line}L${x(lastIdx).toFixed(1)},${H}L${x(firstIdx).toFixed(1)},${H}Z`;
  const up = valid[valid.length - 1] >= valid[0];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn('h-[72px] w-full', up ? 'text-up' : 'text-down')}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} stroke="none" />
      <path d={path(ma)} fill="none" className="stroke-muted-foreground/60" strokeWidth="1" strokeDasharray="3 2" vectorEffect="non-scaling-stroke" />
      <path d={line} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function CardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
      <div className="h-4 w-20 animate-pulse rounded bg-muted" />
      <div className="h-5 w-32 animate-pulse rounded bg-muted" />
      <div className="h-[72px] w-full animate-pulse rounded bg-muted" />
      <div className="grid grid-cols-4 gap-1.5">
        {DIMENSION_KEYS.map((k) => (
          <div key={k} className="h-8 animate-pulse rounded-md bg-muted" />
        ))}
      </div>
    </div>
  );
}
