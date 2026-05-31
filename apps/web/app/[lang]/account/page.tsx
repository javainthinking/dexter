import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { isLocale, type Locale } from '../../../lib/i18n/locales';
import { getLocalizedPath } from '../../../lib/i18n/paths';
import { getDictionary } from '../dictionaries';
import { getCurrentUser } from '../../../lib/auth/session';
import { getUserPlan, getUsage } from '../../../lib/billing';
import { PLAN_LIMITS, type PlanId } from '../../../lib/plans';
import { planMeta } from '../../../lib/pricing';
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

  const [conversations, files] = await Promise.all([
    getUsage(user.id, 'conversations'),
    getUsage(user.id, 'files'),
  ]);

  const meters = [
    { label: a.conversations, used: conversations, limit: limits.conversations },
    { label: a.files, used: files, limit: limits.files },
  ];

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

        {/* Usage */}
        <div className="mt-6 rounded-xl border border-border bg-card p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
            {a.usageHeading}
          </p>
          <ul className="mt-4 space-y-5">
            {meters.map((m) => {
              const unlimited = !Number.isFinite(m.limit);
              const pct = unlimited ? 0 : Math.min(100, Math.round((m.used / m.limit) * 100));
              return (
                <li key={m.label}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="text-foreground">{m.label}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {unlimited ? `${m.used} · ${a.unlimited}` : `${m.used} / ${m.limit}`}
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
      </section>
      <SiteFooter lang={lang as Locale} dict={dict} />
    </div>
  );
}
