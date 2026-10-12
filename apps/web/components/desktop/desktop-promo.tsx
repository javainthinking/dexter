'use client';

import * as React from 'react';
import { Download, X } from 'lucide-react';
import { LocalizedLink } from '../i18n/localized-link';
import { useDictionary } from '../i18n/dictionary-provider';
import { isDesktopApp } from '../../lib/desktop';

const DISMISS_KEY = 'pickskill-desktop-promo-dismissed';

/**
 * "PickSkill for Mac" card at the foot of the signed-in sidebar (chat,
 * portfolios, indicators, market, feedback). Links to /download, where
 * the install steps live. Dismissible per browser; never rendered inside
 * the desktop app itself, which shares this sidebar. Decided after mount
 * so server and client markup match.
 */
export function DesktopPromo() {
  const dict = useDictionary();
  const d = dict.download;
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    if (isDesktopApp()) return;
    let dismissed = false;
    try {
      dismissed = window.localStorage.getItem(DISMISS_KEY) === '1';
    } catch {}
    setShow(!dismissed);
  }, []);

  if (!show) return null;

  const dismiss = () => {
    setShow(false);
    try {
      window.localStorage.setItem(DISMISS_KEY, '1');
    } catch {}
  };

  return (
    <div className="shrink-0 border-t border-border p-3">
      <div className="relative overflow-hidden rounded-lg border border-border bg-card p-3">
        <div className="pointer-events-none absolute inset-0 blueprint-grid opacity-40" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_100%_0%,color-mix(in_oklch,var(--accent)_14%,transparent),transparent_60%)]" aria-hidden />
        <button
          type="button"
          onClick={dismiss}
          aria-label={d.dismiss}
          className="absolute top-2 right-2 z-10 rounded p-1 text-subtle transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
        <div className="relative">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-subtle">macOS</p>
          <p className="mt-1.5 font-serif text-base font-semibold tracking-tight text-foreground">{d.promoTitle}</p>
          <p className="mt-0.5 pr-4 text-xs leading-relaxed text-muted-foreground">{d.promoBody}</p>
          <LocalizedLink
            href="/download"
            className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Download className="size-3.5" />
            {d.promoCta}
          </LocalizedLink>
        </div>
      </div>
    </div>
  );
}
