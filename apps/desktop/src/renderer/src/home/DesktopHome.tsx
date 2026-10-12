import { useEffect, useState, type ReactNode } from 'react';

// Shared with apps/web — the homepage's own design-system pieces, so the
// desktop home reads as the same product as pickskill.ai.
import { Sidebar, type SessionSummary } from '@web/components/chat/sidebar';
import { TopBar } from '@web/components/nav/top-bar';
import { Badge } from '@web/components/ui/badge';
import { Button } from '@web/components/ui/button';
import { CornerMarks, FigTag } from '@web/components/marketing/blueprint';
import { HeroCarousel, type HeroSceneVariant, type HeroSlide } from '@web/components/marketing/hero-carousel';
import { LottieChart } from '@web/components/marketing/lottie-chart';
import { LocalizedLink } from '@web/components/i18n/localized-link';
import { useDictionary, useLocale } from '@web/components/i18n/dictionary-provider';
import { featureList, getFeaturesContent, type FeatureSlug } from '@web/lib/features';
import { getLocalizedPath } from '@web/lib/i18n/paths';
import { PLAN_LIMITS, type PlanId } from '@web/lib/plans';
import { planMeta } from '@web/lib/pricing';
import { writeLastActivePortfolioId } from '@web/lib/active-portfolio';

import { navigate, useRefreshKey } from '../router';
import { fmt, homeStrings } from './strings';

interface PortfolioListItem {
  id: string;
  name: string;
  description: string | null;
  holdingsCount: number;
  updatedAt?: string;
}

/**
 * Desktop home — the signed-in landing screen of the Mac app. It keeps the
 * app chrome (sessions sidebar + top bar) and fills the main pane with
 * pickskill.ai's homepage language: hairline "blueprint" bands with corner
 * crosses, a serif hero over an accent glow, the live product carousel,
 * an inverted-first metric strip, and Lottie market motifs.
 *
 * Unlike the marketing page, every number and link here is the user's own:
 * plan and limits, portfolio and holding counts, conversations stored on
 * this Mac, and one-click entry into each workspace surface.
 */
export function DesktopHome({ plan, userName }: { plan: PlanId; userName: string | null }) {
  const dict = useDictionary();
  const locale = useLocale();
  const s = homeStrings[locale];
  const refreshKey = useRefreshKey();
  const href = (p: string) => getLocalizedPath(p, locale);

  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [portfolios, setPortfolios] = useState<PortfolioListItem[] | null>(null);

  useEffect(() => {
    let live = true;
    fetch('/api/sessions?size=50', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : { sessions: [] }))
      .then((d: { sessions?: SessionSummary[] }) => live && setSessions(d.sessions ?? []))
      .catch(() => {})
      .finally(() => live && setSessionsLoading(false));
    fetch('/api/portfolios', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : { portfolios: [] }))
      .then((d: { portfolios?: PortfolioListItem[] }) => live && setPortfolios(d.portfolios ?? []))
      .catch(() => live && setPortfolios([]));
    return () => {
      live = false;
    };
  }, [refreshKey]);

  const onDeleteSession = async (id: string) => {
    await fetch(`/api/sessions/${encodeURIComponent(id)}`, { method: 'DELETE' }).catch(() => {});
    setSessions((prev) => prev.filter((x) => x.sessionId !== id));
  };

  const firstName = userName?.trim().split(/\s+/)[0] ?? '';
  const hour = new Date().getHours();
  const greet = hour < 5 ? s.greetEvening : hour < 12 ? s.greetMorning : hour < 18 ? s.greetAfternoon : s.greetEvening;

  return (
    <div className="flex h-svh w-full bg-background text-foreground">
      <Sidebar
        sessions={sessions}
        loading={sessionsLoading}
        onNew={() => navigate(href('/chat'))}
        onSwitch={(id) => navigate(`${href('/chat')}?session=${encodeURIComponent(id)}`)}
        onDelete={onDeleteSession}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <TopBar title={dict.nav.home} subtitle={s.badge} />

        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
          <Hero
            greeting={firstName ? `${greet}, ${firstName}.` : `${s.welcomeBack}.`}
            locale={locale}
            href={href}
          />
          <WorkspaceBand plan={plan} portfolios={portfolios} conversations={sessionsLoading ? null : sessions.length} />
          <LaunchGrid href={href} />
          <RecentPortfolios portfolios={portfolios} href={href} />
          <p className="mx-auto max-w-6xl px-8 py-8 font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
            PickSkill · {dict.landing.footer.disclaimer}
          </p>
        </div>
      </main>
    </div>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────

const SCENES: { variant: HeroSceneVariant; slug: FeatureSlug }[] = [
  { variant: 'documents', slug: 'research-documents' },
  { variant: 'indicators', slug: 'portfolio-indicators' },
  { variant: 'analyst', slug: 'ai-analyst' },
];

function Hero({
  greeting,
  locale,
  href,
}: {
  greeting: string;
  locale: ReturnType<typeof useLocale>;
  href: (p: string) => string;
}) {
  const dict = useDictionary();
  const s = homeStrings[locale];
  const features = getFeaturesContent(locale);

  // Same carousel as the web hero. Both the scene and its caption open the
  // live surface in-app; the marketing /features pages only exist on the web.
  const slides: HeroSlide[] = SCENES.map(({ variant, slug }) => {
    const meta = featureList.find((f) => f.slug === slug)!;
    return {
      variant,
      title: features.items[slug].name,
      tagline: features.items[slug].tagline,
      href: href(meta.ctaHref),
      ctaHref: href(meta.ctaHref),
    };
  });

  // Short "try it" seeds — chat loads them into the composer (it never auto-sends).
  const samples = [dict.landing.samples.quickDcf, dict.landing.samples.comparable, dict.landing.samples.thesis];

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_85%_-10%,color-mix(in_oklch,var(--accent)_16%,transparent),transparent_55%)]"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 border-border px-8 pt-12 pb-14 lg:border-x xl:grid-cols-[1.05fr_1fr] xl:gap-10">
        <CornerMarks />
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="accent" size="default">
              <span className="size-1.5 rounded-full bg-[color:var(--accent)] animate-pulse-soft" />
              {s.badge}
            </Badge>
            <span className="text-xs tabular-nums text-subtle">{dict.landing.version}</span>
          </div>
          <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-foreground 2xl:text-5xl">
            {greeting}
            <br />
            <span className="text-muted-foreground">{s.headline}</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">{dict.landing.hero.subtitle}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" variant="default">
              <LocalizedLink href="/chat">
                {dict.landing.hero.primaryCta}
                <Arrow />
              </LocalizedLink>
            </Button>
            <Button asChild size="lg" variant="outline">
              <LocalizedLink href="/portfolios">{dict.portfolios.yours}</LocalizedLink>
            </Button>
          </div>

          <p className="mt-9 font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">{dict.landing.samples.eyebrow}</p>
          <ul className="mt-3 space-y-2">
            {samples.map((prompt) => (
              <li key={prompt}>
                <a
                  href={`${href('/chat')}?prompt=${encodeURIComponent(prompt)}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`${href('/chat')}?prompt=${encodeURIComponent(prompt)}`);
                  }}
                  className="group flex items-center gap-3 rounded-md border border-border bg-card/60 px-3 py-2 text-sm text-foreground transition-colors hover:border-border-strong hover:bg-card"
                >
                  <span className="size-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
                  <span className="min-w-0 flex-1 truncate">{prompt}</span>
                  <Arrow className="text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <HeroCarousel slides={slides} labels={dict.landing.heroScenes} />
      </div>
    </section>
  );
}

// ─── Workspace metric strip (web's StatsBand, with the user's numbers) ──

function WorkspaceBand({
  plan,
  portfolios,
  conversations,
}: {
  plan: PlanId;
  portfolios: PortfolioListItem[] | null;
  conversations: number | null;
}) {
  const locale = useLocale();
  const s = homeStrings[locale];
  const limits = PLAN_LIMITS[plan];
  const planName = planMeta.find((p) => p.id === plan)?.name ?? plan;
  const holdings = portfolios?.reduce((sum, p) => sum + p.holdingsCount, 0) ?? null;
  const dash = '—';

  const cells = [
    {
      label: s.statPlan,
      value: planName,
      detail: Number.isFinite(limits.conversations)
        ? fmt(s.planConversations, { n: limits.conversations.toLocaleString(locale) })
        : s.planUnlimited,
    },
    {
      label: s.statPortfolios,
      value: portfolios ? String(portfolios.length) : dash,
      detail: Number.isFinite(limits.portfolios) ? fmt(s.portfoliosOf, { limit: limits.portfolios }) : s.portfoliosUnlimited,
    },
    { label: s.statHoldings, value: holdings === null ? dash : String(holdings), detail: s.holdingsDetail },
    { label: s.statConversations, value: conversations === null ? dash : String(conversations), detail: s.conversationsDetail },
  ];

  return (
    <Band label={s.workspace}>
      <div className="grid grid-cols-2 gap-px bg-border xl:grid-cols-4">
        {cells.map((c, i) => (
          <div key={c.label} className={`px-7 py-7 ${i === 0 ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
            <p
              className={`font-mono text-[9px] uppercase tracking-[0.2em] ${i === 0 ? 'text-primary-foreground/60' : 'text-subtle'}`}
            >
              {c.label}
            </p>
            <p className="mt-2 font-serif text-3xl font-semibold tracking-tight tabular-nums">{c.value}</p>
            <p
              className={`mt-1 font-mono text-[10px] leading-relaxed ${i === 0 ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}
            >
              {c.detail}
            </p>
          </div>
        ))}
      </div>
    </Band>
  );
}

// ─── Launch grid — one tile per workspace surface ──────────────────────

function LaunchGrid({ href }: { href: (p: string) => string }) {
  const dict = useDictionary();
  const locale = useLocale();
  const s = homeStrings[locale];
  const features = getFeaturesContent(locale);

  const tiles = [
    { path: '/chat', name: dict.chat.sidebar.workbench, body: features.items['ai-analyst'].tagline, lottie: '/lottie/market-line.json' },
    { path: '/portfolios', name: dict.nav.portfolios, body: dict.portfolios.subtitle, lottie: '/lottie/bars.json' },
    { path: '/indicators', name: dict.nav.indicators, body: dict.indicators.subtitle, lottie: '/lottie/candles.json' },
    { path: '/market', name: dict.nav.market, body: dict.market.subtitle, lottie: '/lottie/market-line.json' },
  ];

  return (
    <section className="border-b border-border">
      <div className="relative mx-auto max-w-6xl border-border px-8 py-16 lg:border-x">
        <CornerMarks />
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">{s.launchEyebrow}</p>
        <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-foreground">{s.launchTitle}</h2>

        <div className="relative mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border xl:grid-cols-4">
          {tiles.map((t, i) => (
            <a
              key={t.path}
              href={href(t.path)}
              onClick={(e) => {
                e.preventDefault();
                navigate(href(t.path));
              }}
              className="group relative flex flex-col bg-background p-5 transition-colors hover:bg-card"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.18em] text-subtle">0{i + 1}</span>
                <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.16em] text-subtle opacity-0 transition-opacity group-hover:opacity-100">
                  {s.open}
                  <Arrow />
                </span>
              </div>
              <div className="relative mt-4 h-24 overflow-hidden rounded-md border border-border bg-card">
                <div className="pointer-events-none absolute inset-0 blueprint-grid opacity-60" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_80%_0%,color-mix(in_oklch,var(--accent)_12%,transparent),transparent_60%)]" />
                <LottieChart src={t.lottie} className="relative h-full w-full" />
                <FigTag label={`Fig. 0${i + 1}`} />
              </div>
              <h3 className="mt-5 font-serif text-xl font-semibold tracking-tight text-foreground">{t.name}</h3>
              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Recent portfolios ─────────────────────────────────────────────────

function RecentPortfolios({
  portfolios,
  href,
}: {
  portfolios: PortfolioListItem[] | null;
  href: (p: string) => string;
}) {
  const dict = useDictionary();
  const locale = useLocale();
  const s = homeStrings[locale];
  if (!portfolios) return null;

  const recent = [...portfolios].sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? '')).slice(0, 5);
  const open = (id?: string) => {
    if (id) writeLastActivePortfolioId(id);
    navigate(href('/portfolios'));
  };

  return (
    <section className="border-b border-border">
      <div className="relative mx-auto max-w-6xl border-border px-8 py-16 lg:border-x">
        <CornerMarks />
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">{dict.nav.portfolios}</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-foreground">{s.recentTitle}</h2>
          </div>
          {recent.length > 0 && (
            <Button variant="outline" size="default" onClick={() => open()}>
              {s.viewAll}
              <Arrow />
            </Button>
          )}
        </div>

        {recent.length === 0 ? (
          <div className="relative mt-8 overflow-hidden rounded-xl border border-dashed border-border-strong px-6 py-10 text-center">
            <div className="pointer-events-none absolute inset-0 blueprint-grid opacity-40" />
            <p className="relative font-serif text-lg font-medium text-foreground">{dict.portfolios.emptyTitle}</p>
            <p className="relative mx-auto mt-2 max-w-md text-sm text-muted-foreground">{dict.portfolios.emptyHint}</p>
            <Button className="relative mt-6" variant="default" size="default" onClick={() => open()}>
              {dict.portfolios.newPortfolio}
              <Arrow />
            </Button>
          </div>
        ) : (
          <ul className="mt-8 divide-y divide-border overflow-hidden rounded-xl border border-border">
            {recent.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => open(p.id)}
                  className="group flex w-full items-center gap-4 bg-background px-5 py-4 text-left transition-colors hover:bg-card"
                >
                  <span className="size-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-foreground">{p.name}</span>
                    {p.description && <span className="block truncate text-sm text-muted-foreground">{p.description}</span>}
                  </span>
                  <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">
                    {fmt(s.tickers, { n: p.holdingsCount })}
                  </span>
                  <span className="w-24 shrink-0 text-right font-mono text-[11px] tabular-nums text-subtle">
                    {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString(locale, { month: 'short', day: 'numeric' }) : ''}
                  </span>
                  <Arrow className="text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

// ─── Primitives ────────────────────────────────────────────────────────

/** A hairline band with corner crosses and a mono eyebrow, like the web homepage sections. */
function Band({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="border-b border-border">
      <div className="relative mx-auto max-w-6xl border-border lg:border-x">
        <CornerMarks />
        <p className="border-b border-border px-7 py-2.5 font-mono text-[9px] uppercase tracking-[0.2em] text-subtle">{label}</p>
        {children}
      </div>
    </section>
  );
}

/** lucide's ArrowRight, inlined: the renderer only resolves npm packages imported from apps/web. */
function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`size-4 shrink-0 ${className}`}
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
