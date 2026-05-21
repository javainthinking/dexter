'use client';

import * as React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Logo } from '../logo';
import { LanguageSwitcher } from '../i18n/language-switcher';
import { ThemeToggle } from '../theme-toggle';
import { UserMenu } from '../auth/user-menu';
import { AppNav } from './app-nav';
import { useDictionary } from '../i18n/dictionary-provider';
import { cn } from '../../lib/utils';

/**
 * Shared top bar for every signed-in page. Replaces the four hand-rolled
 * `<header>` blocks that previously lived inline in chat/memory/portfolios/
 * indicators (plus the empty-headered feedback page).
 *
 * Layout: hamburger? + (logo OR title/subtitle) on the left;
 *         extraAction? + AppNav + sep + LangSwitcher + ThemeToggle + UserMenu on the right.
 *
 * Why every signed-in surface needs the right-side cluster:
 *   - AppNav is the global navigation between sections
 *   - LanguageSwitcher works at any point in a session
 *   - ThemeToggle is per-device; users expect it everywhere
 *   - UserMenu is the only way to sign out + open account; previously
 *     missing from Memory's desktop variant — that was a bug
 *
 * Visibility (e.g. mobile-only on Chat, where the sidebar carries the
 * desktop nav) is controlled by passing `className`. Two TopBar
 * instances can coexist on one page with different visibility classes
 * if a layout needs different content per breakpoint.
 */
export interface TopBarProps {
  /** Passes through to the `<header>` — e.g. "md:hidden" for mobile-only. */
  className?: string;
  /** Render a hamburger button (hidden on lg+) that calls this when clicked. */
  onOpenSidebar?: () => void;
  /** Show the brand Logo on the left side. Used by Chat; off elsewhere. */
  showLogo?: boolean;
  /** Page title shown to the right of the hamburger / logo slot. */
  title?: string;
  /** Subtitle below the title, hidden on small screens to save room. */
  subtitle?: string;
  /** Slot for an extra action button (e.g. Chat's "new conversation"). Renders before AppNav. */
  extraAction?: React.ReactNode;
}

export function TopBar({
  className,
  onOpenSidebar,
  showLogo,
  title,
  subtitle,
  extraAction,
}: TopBarProps) {
  const dict = useDictionary();
  return (
    <header
      className={cn(
        'flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border px-3 lg:px-5',
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        {onOpenSidebar && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onOpenSidebar}
            aria-label={dict.chat?.header?.openSidebar ?? 'Open sidebar'}
            className="lg:hidden"
          >
            <Menu className="size-4" />
          </Button>
        )}
        {showLogo && <Logo size="sm" />}
        {title && (
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold text-foreground">{title}</span>
            {subtitle && (
              <span className="hidden truncate text-xs text-muted-foreground sm:inline">
                {subtitle}
              </span>
            )}
          </div>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {extraAction}
        <AppNav />
        <Separator orientation="vertical" className="h-6" />
        <LanguageSwitcher />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
