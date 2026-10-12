import Link from 'next/link';
import type { ReactNode } from 'react';
import { Logo } from '../logo';
import { CornerMarks } from '../marketing/blueprint';

/**
 * Full-page frame for the browser steps of desktop sign-in (/desktop/authorize
 * hand-off and /desktop/done). Same blueprint language as the marketing
 * site: hairline panel with corner crosses on a faint grid, accent glow,
 * mono eyebrow and a serif headline, so leaving the app for the browser
 * still feels like PickSkill.
 */
export function DesktopAuthShell({
  eyebrow,
  icon,
  tone = 'accent',
  title,
  children,
  homeHref,
}: {
  eyebrow: string;
  icon?: ReactNode;
  tone?: 'accent' | 'negative' | 'muted';
  title?: string;
  children?: ReactNode;
  homeHref: string;
}) {
  const ring =
    tone === 'negative'
      ? 'bg-[color:var(--negative)]/12 text-[color:var(--negative)]'
      : tone === 'muted'
        ? 'bg-muted text-muted-foreground'
        : 'bg-[color:var(--accent)]/15 text-[color:var(--accent)]';
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background text-foreground">
      <div aria-hidden className="pointer-events-none absolute inset-0 blueprint-grid opacity-50" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_0%,color-mix(in_oklch,var(--accent)_14%,transparent),transparent_60%)]"
      />
      <header className="relative flex h-14 items-center border-b border-border bg-background/70 px-5 backdrop-blur lg:px-8">
        <Link href={homeHref} aria-label="PickSkill" className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Logo />
        </Link>
      </header>
      <main className="relative flex flex-1 items-center justify-center px-5 py-16">
        <div className="relative w-full max-w-md border border-border bg-background/90 px-8 py-10 text-center shadow-[0_24px_60px_-30px_color-mix(in_oklch,var(--foreground)_30%,transparent)] backdrop-blur">
          <CornerMarks className="!block" />
          {icon && <div className={`mx-auto flex size-12 items-center justify-center rounded-full ${ring}`}>{icon}</div>}
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">{eyebrow}</p>
          {title && <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-foreground">{title}</h1>}
          {children}
        </div>
      </main>
      <footer className="relative border-t border-border px-5 py-4 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-subtle lg:px-8">
        pickskill.ai
      </footer>
    </div>
  );
}
