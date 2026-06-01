import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Lock } from 'lucide-react';
import { isLocale, type Locale } from '../../../lib/i18n/locales';
import { getLocalizedPath } from '../../../lib/i18n/paths';
import { getDictionary } from '../dictionaries';
import { getCurrentUser } from '../../../lib/auth/session';
import { getUserPlan, getUsage, getResourceUsage } from '../../../lib/billing';
import { PLAN_LIMITS, type PlanId } from '../../../lib/plans';
import { planMeta, planIds } from '../../../lib/pricing';
import { Button } from '../../../components/ui/button';
import { SiteHeader } from '../../../components/marketing/site-header';
import { SiteFooter } from '../../../components/marketing/site-footer';
import { ManageSubscriptionButton } from '../../../components/account/manage-subscription-button';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  // Account is private — don't index it.
  return { title: dict.account.metaTitle, robots: { index: false, follow: false } };
}

function fmtDate(d: Date | null, locale: string): string {
  if (!d) return '';
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(d);
  } catch {
    return d.toISOString().slice(0, 10);
  }
}

function fmtNum(n: number, locale: string): string {
  try {
    return n.toLocaleString(locale);
  } catch {
    return String(n);
  }
}

export default async function AccountPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const user = await getCurrentUser();
  if (!user) redirect(getLocalizedPath('/sign-in', lang));

  const dict = await getDictionary(lang);
  const a = dict.account;
  const { plan, periodEnd, cancelAtPeriodEnd } = await getUserPlan(user.id);
  const planName = planMeta.find((p) => p.id === plan)?.name ?? plan;
  const limits = PLAN_LIMITS[plan as PlanId];

  // Live numbers for every quota: conversations / deep-research / files are
  // metered monthly counters; portfolios + holdings are current resource
  // counts (holdings = the fullest portfolio vs the per-portfolio cap).
  const [conversations, deepResearch, files, resources] = await Promise.all([
    getUsage(user.id, 'conversations'),
    getUsage(user.id, 'deep_research'),
    getUsage(user.id, 'files'),
    getResourceUsage(user.id),
  ]);

  // Every quota the plan defines, in the order the pricing cards present them.
  const quota: Array<{ field: keyof typeof limits; label: string; used: number }> = [
    { field: 'conversations', label: a.conversations, used: conversations },
    { field: 'deepResearch', label: a.deepResearch, used: deepResearch },
    { field: 'files', label: a.files, used: files },
    { field: 'portfolios', label: a.portfolios, used: resources.portfolios },
    { field: 'holdings', label: a.holdings, used: resources.maxHoldings },
  ];

  // Next tier up (free → starter → pro → power). Power has no higher tier.
  const idx = planIds.indexOf(plan as PlanId);
  const nextPlan = idx >= 0 && idx < planIds.length - 1 ? planIds[idx + 1] : null;
  const nextName = nextPlan ? planMeta.find((p) => p.id === nextPlan)?.name ?? nextPlan : null;
  const nextLimits = nextPlan ? PLAN_LIMITS[nextPlan] : null;

  // Locked rows: quotas where the next tier is strictly more generous.
  const unlockRows = nextLimits
    ? quota
        .filter((q) => {
          const cur = limits[q.field];
          const up = nextLimits[q.field];
          return up > cur; // Infinity > finite, Infinity > Infinity === false
        })
        .map((q) => ({
          label: q.label,
          value: Number.isFinite(nextLimits[q.field])
            ? fmtNum(nextLimits[q.field], lang)
            : a.unlimited,
        }))
    : [];

  const isPaid = plan !== 'free';
  const renewLine = isPaid && periodEnd
    ? (cancelAtPeriodEnd ? a.cancels : a.renews).replace('{date}', fmtDate(periodEnd, lang))
    : a.freeNote;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader lang={lang as Locale} />
      <section className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {a.title}
        </h1>

        {/* Plan */}
        <div className="mt-8 rounded-xl border border-border bg-card p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
            {a.planHeading}
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="font-serif text-2xl font-semibold tracking-tight text-foreground">
                {planName}
              </span>
              <p className="mt-1 text-sm text-muted-foreground">{renewLine}</p>
            </div>
            {isPaid ? (
              <ManageSubscriptionButton locale={lang} label={a.manage} />
            ) : (
              <Button asChild size="default" variant="default">
                <Link href={getLocalizedPath('/pricing', lang)}>{a.upgrade}</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Usage & limits — all five plan quotas. */}
        <div className="mt-6 rounded-xl border border-border bg-card p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
            {a.usageHeading}
          </p>
          <ul className="mt-4 space-y-5">
            {quota.map((q) => {
              const limit = limits[q.field];
              const unlimited = !Number.isFinite(limit);
              const pct = unlimited ? 0 : Math.min(100, Math.round((q.used / limit) * 100));
              return (
                <li key={q.field}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="text-foreground">{q.label}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {unlimited
                        ? `${fmtNum(q.used, lang)} · ${a.unlimited}`
                        : `${fmtNum(q.used, lang)} / ${fmtNum(limit, lang)}`}
                    </span>
                  </div>
                  {!unlimited && (
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-[color:var(--accent)]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="mt-5 text-xs text-subtle">{a.resets}</p>
        </div>

        {/* Unlock more — locked higher-tier quotas, nudging an upgrade. Hidden
            on the top tier (no higher plan to sell). */}
        {nextPlan && unlockRows.length > 0 && (
          <div className="mt-6 rounded-xl border border-dashed border-border bg-muted/30 p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
              {a.unlockHeading.replace('{plan}', nextName ?? '')}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{a.unlockNote}</p>
            <ul className="mt-4 space-y-3">
              {unlockRows.map((r) => (
                <li
                  key={r.label}
                  className="flex items-center justify-between text-sm text-subtle"
                >
                  <span className="flex items-center gap-2">
                    <Lock className="size-3.5 shrink-0" aria-hidden="true" />
                    {r.label}
                  </span>
                  <span className="font-mono text-xs">{r.value}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5">
              <Button asChild size="default" variant="default">
                <Link href={getLocalizedPath('/pricing', lang)}>{a.seePlans}</Link>
              </Button>
            </div>
          </div>
        )}
      </section>
      <SiteFooter lang={lang as Locale} dict={dict} />
    </div>
  );
}
