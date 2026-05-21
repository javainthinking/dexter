'use client';

import { Wallet, LineChart, MessageSquare, type LucideIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { LocalizedLink } from '../i18n/localized-link';
import { useDictionary } from '../i18n/dictionary-provider';
import { stripLocalePrefix } from '../../lib/i18n/paths';
import { cn } from '../../lib/utils';

/**
 * Top-right primary nav cluster. Replaces the bottom-of-sidebar block
 * that previously held the Portfolios / Indicators / Memory entries.
 *
 * Reasons for the move:
 *   - The sidebar's bottom area was getting crowded — user info, theme
 *     toggle, and the nav block all competed for the same footprint.
 *   - These three destinations are global app surfaces (not chat
 *     context), so they belong in the global app chrome alongside
 *     language / theme / user, not under "sessions."
 *   - Icon-only buttons keep the header from getting heavy, while the
 *     active-state pill makes the current page obvious at a glance.
 *
 * Active-state detection uses the same pathname-stripping helper the old
 * SidebarNav did, so behavior on /portfolios vs /portfolios/[id]-style
 * sub-routes (if added later) stays consistent.
 */

interface NavEntry {
  key: string;
  href: string;
  icon: LucideIcon;
  label: string;
  active: boolean;
}

export function AppNav() {
  const dict = useDictionary();
  const pathname = usePathname();
  const cleanPath = stripLocalePrefix(pathname) || '/';

  const entries: NavEntry[] = [
    {
      key: 'portfolios',
      href: '/portfolios',
      icon: Wallet,
      label: dict.nav?.portfolios ?? 'Portfolios',
      active: cleanPath === '/portfolios' || cleanPath.startsWith('/portfolios/'),
    },
    {
      key: 'indicators',
      href: '/indicators',
      icon: LineChart,
      label: dict.nav?.indicators ?? 'Indicators',
      active: cleanPath === '/indicators' || cleanPath.startsWith('/indicators/'),
    },
    // Memory entry intentionally absent — it's surfaced inside the
    // UserMenu dropdown (a personal-account surface), not as a
    // top-level section. See components/auth/user-menu.tsx.
    {
      key: 'feedback',
      href: '/feedback',
      icon: MessageSquare,
      label: dict.nav?.feedback ?? 'Feedback',
      active: cleanPath === '/feedback' || cleanPath.startsWith('/feedback/'),
    },
  ];

  return (
    <nav className="flex items-center gap-0.5" aria-label="Primary">
      {entries.map((e) => (
        <LocalizedLink
          key={e.key}
          href={e.href}
          title={e.label}
          aria-label={e.label}
          aria-current={e.active ? 'page' : undefined}
          className={cn(
            // Icon-only square on mobile, icon + label pill from md up.
            // Three labels (Portfolios/Indicators/Memory) translate to
            // longer strings in some locales (e.g. "Portefeuilles",
            // "Indikatoren"), so hiding text on small screens prevents
            // the header from wrapping or crowding the language/user
            // controls.
            'inline-flex items-center gap-1.5 rounded-md transition-colors text-sm font-medium',
            'h-9 px-2 md:px-2.5',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            e.active
              ? 'bg-muted text-[color:var(--accent)]'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
          )}
        >
          <e.icon className="size-4 shrink-0" />
          <span className="hidden md:inline">{e.label}</span>
        </LocalizedLink>
      ))}
    </nav>
  );
}
