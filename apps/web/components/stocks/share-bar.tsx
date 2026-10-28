'use client';

import * as React from 'react';
import { Check, Link2, MessageCircle, Send, Share2 } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Share row for the public stock pages. Plain intent URLs (no SDKs, no
 * third-party scripts), each tagged with utm_* so GA attributes the
 * visits each network sends back. The page's canonical tag ignores the
 * query string, so tagged links never fork the indexed URL.
 */

type Network = 'x' | 'linkedin' | 'facebook' | 'whatsapp' | 'telegram';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function tagged(url: string, source: string): string {
  const u = new URL(url);
  u.searchParams.set('utm_source', source);
  u.searchParams.set('utm_medium', 'social');
  u.searchParams.set('utm_campaign', 'stock_signals');
  return u.toString();
}

function intentUrl(network: Network, pageUrl: string, text: string): string {
  const url = encodeURIComponent(tagged(pageUrl, network));
  const t = encodeURIComponent(text);
  switch (network) {
    case 'x':
      return `https://twitter.com/intent/tweet?text=${t}&url=${url}`;
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    case 'whatsapp':
      return `https://wa.me/?text=${t}%20${url}`;
    case 'telegram':
      return `https://t.me/share/url?url=${url}&text=${t}`;
  }
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
    </svg>
  );
}

const NETWORKS: Array<{ id: Network; label: string; icon: React.ReactNode }> = [
  { id: 'x', label: 'X', icon: <XIcon /> },
  { id: 'linkedin', label: 'LinkedIn', icon: <LinkedInIcon /> },
  { id: 'facebook', label: 'Facebook', icon: <FacebookIcon /> },
  { id: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle className="size-4" /> },
  { id: 'telegram', label: 'Telegram', icon: <Send className="size-4" /> },
];

const BUTTON =
  'inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-border bg-card px-2.5 text-xs text-muted-foreground transition-colors hover:border-border-strong hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export function ShareBar({
  pageUrl,
  text,
  symbol,
  labels,
}: {
  /** Canonical absolute URL of the page. */
  pageUrl: string;
  /** Pre-filled share text (localised). */
  text: string;
  symbol: string;
  labels: { label: string; copy: string; copied: string; more: string };
}) {
  const [copied, setCopied] = React.useState(false);
  const [canNativeShare, setCanNativeShare] = React.useState(false);

  React.useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);

  const track = (method: string) => {
    window.gtag?.('event', 'share', { method, content_type: 'stock_signals', item_id: symbol });
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(tagged(pageUrl, 'copy'));
      setCopied(true);
      track('copy');
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — nothing useful to show */
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title: document.title, text, url: tagged(pageUrl, 'native') });
      track('native');
    } catch {
      /* user dismissed the sheet */
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">{labels.label}</span>
      {NETWORKS.map((n) => (
        <a
          key={n.id}
          href={intentUrl(n.id, pageUrl, text)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track(n.id)}
          className={cn(BUTTON, 'w-8 px-0')}
          aria-label={n.label}
          title={n.label}
        >
          {n.icon}
        </a>
      ))}
      <button type="button" onClick={copy} className={BUTTON}>
        {copied ? <Check className="size-3.5 text-up" /> : <Link2 className="size-3.5" />}
        <span aria-live="polite">{copied ? labels.copied : labels.copy}</span>
      </button>
      {canNativeShare && (
        <button type="button" onClick={nativeShare} className={BUTTON} aria-label={labels.more}>
          <Share2 className="size-3.5" />
          <span className="sm:hidden">{labels.more}</span>
        </button>
      )}
    </div>
  );
}
