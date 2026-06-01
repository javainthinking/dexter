'use client';

import * as React from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
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

  // Only the tiers strictly above the current plan, paid only.
  const idx = planIds.indexOf(plan);
  const tiers = (idx >= 0 ? planIds.slice(idx + 1) : planIds).filter((id) => id !== 'free');

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
        body: JSON.stringify({ plan: planId, interval: 'month', locale }),
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
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{u.title}</DialogTitle>
          <DialogDescription>{reason}</DialogDescription>
        </DialogHeader>

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
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="font-serif text-2xl font-semibold tracking-tight text-foreground">
                    {meta.monthly}
                  </span>
                  <span className="text-xs text-subtle">{copy.perMonth}</span>
                </div>
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

        <DialogFooter className="sm:justify-center">
          <Link
            href={getLocalizedPath('/pricing', locale)}
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            {u.comparePlans} →
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
