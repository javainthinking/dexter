'use client';

import * as React from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import type { PlanMeta, PricingContent } from '../../lib/pricing';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

/**
 * Interactive plan cards with a monthly/annual billing toggle.
 *
 * Client component because the toggle is stateful; all copy arrives
 * pre-localized via `copy` so this stays locale-agnostic. Annual mode
 * shows the per-month price when billed yearly plus the yearly total —
 * the toggle and "Save 20%" badge carry the discount story that used to
 * live only in fine print.
 *
 * Cards use CSS subgrid (parent defines header/button/features row tracks)
 * so every CTA lines up across cards no matter how the blurb or price
 * sub-line wraps per locale.
 */
export function PricingCards({
  plans,
  copy,
  chatHref,
  locale,
}: {
  plans: PlanMeta[];
  copy: PricingContent;
  chatHref: string;
  locale: string;
}) {
  // Default to annual: it's the better deal and the struck-through monthly
  // price makes the 20% saving obvious the moment the page loads.
  const [annual, setAnnual] = React.useState(true);
  const [busy, setBusy] = React.useState<string | null>(null);

  async function openPortal() {
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale }),
      });
      const data = (await res.json().catch(() => ({}))) as { url?: string };
      if (data.url) {
        window.location.href = data.url;
        return;
      }
    } catch {
      /* fall through */
    }
    setBusy(null);
  }

  // Paid CTA → Stripe Checkout. Signed out → sign-in; already subscribed
  // (409) → billing portal.
  async function startCheckout(planId: string) {
    setBusy(planId);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planId,
          interval: annual ? 'year' : 'month',
          locale,
          returnTo: window.location.pathname + window.location.search,
        }),
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

  return (
    <>
      {/* Billing toggle */}
      <div className="mb-8 flex justify-center">
        <div
          role="group"
          aria-label={copy.comparisonHeading}
          className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1 text-sm"
        >
          <button
            type="button"
            onClick={() => setAnnual(false)}
            aria-pressed={!annual}
            className={`rounded-full px-4 py-1.5 font-medium transition-colors ${
              !annual
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {copy.billing.monthly}
          </button>
          <button
            type="button"
            onClick={() => setAnnual(true)}
            aria-pressed={annual}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 font-medium transition-colors ${
              annual
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {copy.billing.annual}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                annual ? 'bg-background/20 text-background' : 'bg-[color:var(--accent)]/15 text-[color:var(--accent)]'
              }`}
            >
              {copy.billing.save}
            </span>
          </button>
        </div>
      </div>

      {/*
        Four shared subgrid row tracks — title / price / button / features —
        so every corresponding part lines up across cards in every locale.
        Each track auto-sizes to the tallest card (e.g. Japanese's 2-line
        blurb, German's 3-line annual note), so a wrapping blurb can't shove
        one card's price below the others. Below `lg` the cards stack.
      */}
      <div className="grid gap-4 lg:grid-cols-4 lg:grid-rows-[auto_auto_auto_1fr]">
        {plans.map((plan) => {
          const planCopy = copy.plans[plan.id];
          const amount = annual ? plan.annualMonthly : plan.monthly;
          // Annual mode: yearly total + "billed annually". Monthly mode (and
          // Free, which has no annual total): keep the per-plan annualNote.
          const subline =
            annual && plan.annualTotal
              ? `${plan.annualTotal} ${copy.billing.billedAnnually}`
              : planCopy.annualNote;
          return (
            <div
              key={plan.id}
              className={`relative flex flex-col gap-y-5 rounded-xl border bg-card p-6 lg:row-span-4 lg:grid lg:grid-rows-subgrid ${
                plan.featured ? 'border-[color:var(--accent)]' : 'border-border'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="accent" size="default">
                    {copy.mostPopular}
                  </Badge>
                </div>
              )}
              {/* Track 1 — title: name + blurb. */}
              <div>
                <h2 className="font-serif text-lg font-semibold tracking-tight text-foreground">
                  {plan.name}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{planCopy.blurb}</p>
              </div>
              {/* Track 2 — price + billing sub-line. In annual mode the
                  regular monthly price is struck through next to the lower
                  effective monthly price so the discount reads at a glance.
                  Only for paid plans (Free has no annual total / discount). */}
              <div>
                <div className="flex items-baseline gap-1.5">
                  {annual && plan.annualTotal && (
                    <span
                      className="font-serif text-xl font-medium text-subtle line-through"
                      aria-hidden="true"
                    >
                      {plan.monthly}
                    </span>
                  )}
                  <span className="font-serif text-4xl font-semibold tracking-tight text-foreground">
                    {amount}
                  </span>
                  <span className="text-sm text-subtle">{copy.perMonth}</span>
                </div>
                <p className="mt-1 text-xs text-subtle">{subline}</p>
              </div>
              {/* Track 3 — CTA. Free links to the app; paid tiers go through
                  Stripe Checkout (or the billing portal if already subscribed). */}
              {plan.id === 'free' ? (
                <Button asChild size="default" variant="outline">
                  <Link href={chatHref}>{planCopy.cta}</Link>
                </Button>
              ) : (
                <Button
                  type="button"
                  size="default"
                  variant={plan.featured ? 'default' : 'outline'}
                  disabled={busy !== null}
                  onClick={() => startCheckout(plan.id)}
                >
                  {busy === plan.id ? '…' : planCopy.cta}
                </Button>
              )}
              {/* Track 4 — feature list. */}
              <ul className="space-y-2.5">
                {planCopy.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-[color:var(--accent)]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </>
  );
}
