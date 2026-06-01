'use client';

import * as React from 'react';
import Link from 'next/link';
import { Check, Minus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useLocale, useDictionary } from '../i18n/dictionary-provider';
import { getLocalizedPath } from '../../lib/i18n/paths';
import type { Locale } from '../../lib/i18n/locales';
import { planMeta, planIds, getPricingContent, type PlanId } from '../../lib/pricing';
import type { UpgradeMetric } from './upgrade-dialog-provider';

/** Maps the metered metric onto its localized reason-copy key. */
const REASON_KEY = {
  conversations: 'conversations',
  deep_research: 'deepResearch',
  files: 'files',
  portfolios: 'portfolios',
  holdings: 'holdings',
} as const satisfies Record<UpgradeMetric, string>;

export function UpgradeDialog({
  open,
  onOpenChange,
  plan = 'free',
  metric,
  limit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan?: PlanId;
  metric?: UpgradeMetric;
  limit?: number;
}) {
  const locale = useLocale();
  const dict = useDictionary();
  const u = dict.upgrade;
  const copy = getPricingContent(locale as Locale);
  const [busy, setBusy] = React.useState<string | null>(null);
  // Default to annual — the better deal, with the struck-through monthly
  // price making the saving obvious (mirrors the /pricing cards).
  const [annual, setAnnual] = React.useState(true);

  // Only the tiers strictly above the current plan, paid only.
  const idx = planIds.indexOf(plan);
  const base = idx >= 0 ? idx : 0;
  const tiers = planIds.slice(base + 1).filter((id) => id !== 'free');
  // Comparison columns: the current plan plus the tiers above it, so the
  // user sees what they have next to what they'd gain. `colIdx` indexes
  // into each row's value array (ordered free, starter, pro, power).
  const colIdx = planIds.map((_, i) => i).filter((i) => i >= base);

  const reason =
    metric && u.reasons[REASON_KEY[metric]]
      ? u.reasons[REASON_KEY[metric]].replace('{limit}', String(limit ?? ''))
      : u.subtitle;

  async function openPortal() {
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale }),
      });
      const data = (await res.json().catch(() => ({}))) as { url?: string };
      if (data.url) window.location.href = data.url;
    } catch {
      /* ignore */
    }
    setBusy(null);
  }

  // Same checkout flow as the pricing cards: 401 → sign-in, 409 (already
  // subscribed) → billing portal, otherwise redirect to Stripe Checkout.
  async function startCheckout(planId: string) {
    setBusy(planId);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId, interval: annual ? 'year' : 'month', locale }),
      });
      if (res.status === 401) {
        window.location.href = `/${locale}/sign-in?callbackUrl=${encodeURIComponent(`/${locale}/pricing`)}`;
        return;
      }
      if (res.status === 409) {
        await openPortal();
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { url?: string };
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setBusy(null);
    } catch {
      setBusy(null);
    }
  }

  const cols = tiers.length >= 3 ? 'sm:grid-cols-3' : tiers.length === 2 ? 'sm:grid-cols-2' : '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{u.title}</DialogTitle>
          <DialogDescription>{reason}</DialogDescription>
        </DialogHeader>

        {/* Monthly / annual toggle — annual selected by default. */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1 text-sm">
            <button
              type="button"
              onClick={() => setAnnual(false)}
              aria-pressed={!annual}
              className={`rounded-full px-3 py-1 font-medium transition-colors ${
                !annual ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {copy.billing.monthly}
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              aria-pressed={annual}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-medium transition-colors ${
                annual ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {copy.billing.annual}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                  annual
                    ? 'bg-background/20 text-background'
                    : 'bg-[color:var(--accent)]/15 text-[color:var(--accent)]'
                }`}
              >
                {copy.billing.save}
              </span>
            </button>
          </div>
        </div>

        <div className={`grid gap-3 ${cols}`}>
          {tiers.map((id) => {
            const meta = planMeta.find((p) => p.id === id);
            const pc = copy.plans[id];
            if (!meta) return null;
            return (
              <div
                key={id}
                className={`relative flex flex-col rounded-lg border p-4 ${
                  meta.featured ? 'border-[color:var(--accent)]' : 'border-border'
                }`}
              >
                {meta.featured && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    <Badge variant="accent" size="sm">
                      {copy.mostPopular}
                    </Badge>
                  </div>
                )}
                <h3 className="font-serif text-base font-semibold tracking-tight text-foreground">
                  {meta.name}
                </h3>
                <div className="mt-1 flex items-baseline gap-1.5">
                  {annual && meta.annualTotal && (
                    <span
                      className="font-serif text-base font-medium text-subtle line-through"
                      aria-hidden="true"
                    >
                      {meta.monthly}
                    </span>
                  )}
                  <span className="font-serif text-2xl font-semibold tracking-tight text-foreground">
                    {annual ? meta.annualMonthly : meta.monthly}
                  </span>
                  <span className="text-xs text-subtle">{copy.perMonth}</span>
                </div>
                <p className="mt-0.5 text-[11px] text-subtle">
                  {annual && meta.annualTotal
                    ? `${meta.annualTotal} ${copy.billing.billedAnnually}`
                    : pc.annualNote}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{pc.blurb}</p>
                <ul className="mt-3 flex-1 space-y-1.5">
                  {pc.features.slice(0, 4).map((f) => (
                    <li key={f} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-[color:var(--accent)]" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  type="button"
                  size="default"
                  variant={meta.featured ? 'default' : 'outline'}
                  className="mt-4"
                  disabled={busy !== null}
                  onClick={() => startCheckout(id)}
                >
                  {busy === id ? '…' : pc.cta}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Full feature comparison — current plan beside the upgrade tiers,
            the same matrix shown on /pricing. */}
        <div className="mt-2">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">
            {copy.comparisonHeading}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="w-2/5 py-2 pr-3 text-left font-medium text-subtle" />
                  {colIdx.map((i) => {
                    const m = planMeta[i];
                    if (!m) return null;
                    return (
                      <th
                        key={m.id}
                        className={`px-2 py-2 text-center font-serif text-sm font-semibold ${
                          m.featured ? 'text-[color:var(--accent)]' : 'text-foreground'
                        }`}
                      >
                        {m.name}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {copy.comparison.map((group) => (
                  <React.Fragment key={group.title}>
                    <tr>
                      <td
                        colSpan={colIdx.length + 1}
                        className="pt-4 pb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-subtle"
                      >
                        {group.title}
                      </td>
                    </tr>
                    {group.rows.map((row) => (
                      <tr key={row.label} className="border-b border-border/60">
                        <td className="py-2 pr-3 text-left text-muted-foreground">{row.label}</td>
                        {colIdx.map((i) => {
                          const value = row.values[i];
                          const m = planMeta[i];
                          return (
                            <td
                              key={m?.id ?? i}
                              className={`px-2 py-2 text-center ${m?.featured ? 'bg-muted/30' : ''}`}
                            >
                              {typeof value === 'boolean' ? (
                                value ? (
                                  <Check className="mx-auto size-3.5 text-[color:var(--accent)]" />
                                ) : (
                                  <Minus className="mx-auto size-3.5 text-subtle" />
                                )
                              ) : (
                                <span className="text-foreground">{value}</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <DialogFooter className="sm:justify-center">
          <Link
            href={getLocalizedPath('/pricing', locale)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            {u.comparePlans} →
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
