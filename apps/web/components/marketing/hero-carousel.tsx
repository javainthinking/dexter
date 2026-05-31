'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';

export type HeroSceneVariant = 'documents' | 'indicators' | 'analyst';

export interface HeroSceneLabels {
  generating: string;
  documentsPrompt: string;
  documentsCaption: string;
  indicatorsTrail: string;
  legendBull: string;
  legendNeutral: string;
  legendBear: string;
  analystPrompt: string;
  analystSourced: string;
  analystMemory: string;
}

export interface HeroSlide {
  variant: HeroSceneVariant;
  /** Feature name, localized. */
  title: string;
  /** One-line selling point, localized. */
  tagline: string;
  /** Link to the feature detail page. */
  href: string;
}

const ADVANCE_MS = 5000;

/**
 * Hero carousel — auto-rotating product scenes, one per feature. Each
 * scene is built from real DOM (not a baked image) so its text localizes
 * to all eight languages, stays crisp at any resolution, and is
 * theme-aware. Crossfade via grid-stacking (container sizes to the
 * tallest scene, so no layout jump on advance). Dot indicators,
 * hover/focus pause, prev/next on hover, and respects
 * prefers-reduced-motion. Client component (rotation is stateful);
 * all copy arrives pre-localized.
 */
export function HeroCarousel({
  slides,
  labels,
}: {
  slides: HeroSlide[];
  labels: HeroSceneLabels;
}) {
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const reduceMotion = React.useRef(false);

  React.useEffect(() => {
    reduceMotion.current =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  }, []);

  React.useEffect(() => {
    if (paused || reduceMotion.current || slides.length < 2) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % slides.length),
      ADVANCE_MS,
    );
    return () => window.clearInterval(id);
  }, [paused, slides.length]);

  const go = (i: number) => setActive(((i % slides.length) + slides.length) % slides.length);

  return (
    <div
      className="group relative mx-auto w-full max-w-md lg:max-w-none"
      role="region"
      aria-roledescription="carousel"
      aria-label="Product highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Frame */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
        {/* soft accent wash */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(120%_120%_at_85%_0%,color-mix(in_oklch,var(--accent)_16%,transparent),transparent_55%)]" />
        {/* Grid-stack scenes: container sizes to the tallest, children crossfade */}
        <div className="grid p-5 sm:p-6">
          {slides.map((slide, i) => (
            <div
              key={slide.variant}
              style={{ gridArea: '1 / 1' }}
              aria-hidden={i !== active}
              className={`transition-opacity duration-700 ease-out ${
                i === active ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              <Scene variant={slide.variant} labels={labels} />
            </div>
          ))}
        </div>

        {/* Prev / next — appear on hover */}
        <button
          type="button"
          onClick={() => go(active - 1)}
          aria-label="Previous"
          className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-border bg-background/80 p-1.5 text-foreground opacity-0 backdrop-blur-sm transition-opacity hover:bg-background focus-visible:opacity-100 group-hover:opacity-100"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => go(active + 1)}
          aria-label="Next"
          className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-border bg-background/80 p-1.5 text-foreground opacity-0 backdrop-blur-sm transition-opacity hover:bg-background focus-visible:opacity-100 group-hover:opacity-100"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* Caption + dots */}
      <div className="mt-4 flex items-start justify-between gap-4">
        <Link href={slides[active].href} className="group/cap min-w-0 flex-1">
          <p className="flex items-center gap-1 text-sm font-medium text-foreground">
            {slides[active].title}
            <ArrowUpRight className="size-3.5 text-subtle transition-transform group-hover/cap:translate-x-0.5 group-hover/cap:-translate-y-0.5" />
          </p>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {slides[active].tagline}
          </p>
        </Link>
        <div className="flex shrink-0 items-center gap-1.5 pt-1" role="tablist" aria-label="Choose slide">
          {slides.map((slide, i) => (
            <button
              key={slide.variant}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={slide.title}
              onClick={() => go(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === active
                  ? 'w-5 bg-[color:var(--accent)]'
                  : 'w-1.5 bg-border-strong hover:bg-subtle'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Scene({ variant, labels }: { variant: HeroSceneVariant; labels: HeroSceneLabels }) {
  if (variant === 'documents') return <DocumentsScene labels={labels} />;
  if (variant === 'indicators') return <IndicatorsScene labels={labels} />;
  return <AnalystScene labels={labels} />;
}

/** A faux prompt bar shared by scenes. */
function PromptBar({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5">
      <span className="font-mono text-xs text-[color:var(--accent)]">▸</span>
      <span className="truncate text-sm text-foreground">{text}</span>
    </div>
  );
}

function GeneratingRow({ label }: { label: string }) {
  return (
    <div className="my-3 flex items-center gap-2 pl-1">
      <span className="inline-flex gap-1">
        <span className="size-1 rounded-full bg-[color:var(--accent)] animate-pulse-soft" />
        <span className="size-1 rounded-full bg-[color:var(--accent)] animate-pulse-soft [animation-delay:150ms]" />
        <span className="size-1 rounded-full bg-[color:var(--accent)] animate-pulse-soft [animation-delay:300ms]" />
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">{label}</span>
    </div>
  );
}

function DocumentsScene({ labels }: { labels: HeroSceneLabels }) {
  return (
    <div className="relative">
      <PromptBar text={labels.documentsPrompt} />
      <GeneratingRow label={labels.generating} />
      <div className="grid grid-cols-3 gap-3">
        <FileCard tint="#d97706" label="deck.pptx">
          <div className="flex h-12 items-end gap-1">
            <span className="w-full rounded-sm bg-[color:var(--accent)]/35" style={{ height: '40%' }} />
            <span className="w-full rounded-sm bg-[color:var(--accent)]/55" style={{ height: '65%' }} />
            <span className="w-full rounded-sm bg-[color:var(--accent)]/80" style={{ height: '100%' }} />
          </div>
        </FileCard>
        <FileCard tint="#2563eb" label="report.docx">
          <div className="flex h-12 flex-col justify-center gap-1.5">
            <span className="h-1 w-full rounded-full bg-muted-foreground/30" />
            <span className="h-1 w-10/12 rounded-full bg-muted-foreground/30" />
            <span className="h-1 w-full rounded-full bg-muted-foreground/30" />
            <span className="h-1 w-8/12 rounded-full bg-muted-foreground/30" />
          </div>
        </FileCard>
        <FileCard tint="#16a34a" label="model.xlsx">
          <div className="grid h-12 grid-cols-3 grid-rows-3 gap-px overflow-hidden rounded-sm bg-border">
            {Array.from({ length: 9 }).map((_, idx) => (
              <span key={idx} className={idx % 4 === 0 ? 'bg-[color:var(--accent)]/25' : 'bg-card'} />
            ))}
          </div>
        </FileCard>
      </div>
      <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">
        {labels.documentsCaption}
      </p>
    </div>
  );
}

function FileCard({
  tint,
  label,
  children,
}: {
  tint: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-2.5">
      <div className="flex items-center gap-1.5">
        <span className="size-2 rounded-[2px]" style={{ backgroundColor: tint }} />
        <span className="truncate font-mono text-[9px] text-muted-foreground">{label}</span>
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

const BULL = 'var(--accent)';
const BEAR = '#dc2626';

function IndicatorsScene({ labels }: { labels: HeroSceneLabels }) {
  const cols = ['MACD', 'RSI', 'KDJ', 'ADX', 'VOL'];
  // signal per cell: 1 bull, 0 neutral, -1 bear
  const rows: { t: string; s: number[]; trail: number[] }[] = [
    { t: 'NVDA', s: [1, 1, 0, 1, 1], trail: [1, 1, 1, 1, 1] },
    { t: 'TSM', s: [1, 0, 1, 1, 0], trail: [0, 1, 1, 1, 1] },
    { t: 'AAPL', s: [-1, -1, 0, -1, 1], trail: [-1, -1, 0, -1, -1] },
    { t: 'AMD', s: [1, 1, 1, 0, 1], trail: [0, 0, 1, 1, 1] },
  ];
  const dot = (v: number, size = 'size-2') => (
    <span
      className={`${size} rounded-full`}
      style={{ backgroundColor: v === 1 ? BULL : v === -1 ? BEAR : undefined }}
      {...(v === 0 ? { 'data-neutral': true } : {})}
    />
  );
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      {/* header */}
      <div className="grid grid-cols-[2.4rem_repeat(5,1fr)_2.6rem] items-center gap-1 border-b border-border pb-2 font-mono text-[8px] uppercase tracking-wide text-subtle">
        <span />
        {cols.map((c) => (
          <span key={c} className="text-center">{c}</span>
        ))}
        <span className="text-right text-[7px]">{labels.indicatorsTrail}</span>
      </div>
      {/* rows */}
      <div className="mt-1.5 space-y-2">
        {rows.map((r) => (
          <div key={r.t} className="grid grid-cols-[2.4rem_repeat(5,1fr)_2.6rem] items-center gap-1">
            <span className="font-mono text-[10px] font-medium text-foreground">{r.t}</span>
            {r.s.map((v, i) => (
              <span key={i} className="flex justify-center">
                <span
                  className="size-2 rounded-full bg-muted-foreground/30"
                  style={v !== 0 ? { backgroundColor: v === 1 ? BULL : BEAR } : undefined}
                />
              </span>
            ))}
            <span className="flex justify-end gap-0.5">
              {r.trail.map((v, i) => (
                <span
                  key={i}
                  className="size-1 rounded-full bg-muted-foreground/30"
                  style={v !== 0 ? { backgroundColor: v === 1 ? BULL : BEAR } : undefined}
                />
              ))}
            </span>
          </div>
        ))}
      </div>
      {/* legend */}
      <div className="mt-3 flex items-center gap-3 border-t border-border pt-2 font-mono text-[8px] text-subtle">
        <span className="flex items-center gap-1">
          <span className="size-1.5 rounded-full" style={{ backgroundColor: BULL }} /> {labels.legendBull}
        </span>
        <span className="flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-muted-foreground/30" /> {labels.legendNeutral}
        </span>
        <span className="flex items-center gap-1">
          <span className="size-1.5 rounded-full" style={{ backgroundColor: BEAR }} /> {labels.legendBear}
        </span>
      </div>
    </div>
  );
}

function AnalystScene({ labels }: { labels: HeroSceneLabels }) {
  return (
    <div className="relative">
      <PromptBar text={labels.analystPrompt} />
      <GeneratingRow label={labels.generating} />
      <div className="rounded-lg border border-border bg-background p-3">
        {/* answer lines */}
        <div className="space-y-1.5">
          <span className="block h-1.5 w-11/12 rounded-full bg-muted-foreground/25" />
          <span className="block h-1.5 w-full rounded-full bg-muted-foreground/25" />
          <span className="block h-1.5 w-9/12 rounded-full bg-muted-foreground/25" />
        </div>
        {/* sourced chip */}
        <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-md border border-[color:var(--accent)]/40 bg-[color:var(--accent)]/10 px-2 py-1">
          <span className="size-1.5 rounded-full bg-[color:var(--accent)]" />
          <span className="font-mono text-[9px] text-foreground">{labels.analystSourced}</span>
        </div>
        {/* mini chart */}
        <div className="mt-3 flex h-10 items-end gap-1">
          {[35, 50, 42, 68, 60, 82, 100].map((h, i) => (
            <span key={i} className="w-full rounded-sm bg-[color:var(--accent)]/45" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
      {/* memory pill */}
      <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1">
        <span className="size-1.5 rounded-full bg-[color:var(--accent)] animate-pulse-soft" />
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
          {labels.analystMemory}
        </span>
      </div>
    </div>
  );
}
