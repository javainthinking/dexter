import Link from 'next/link';
import { Logo } from '../logo';
import { LanguageSwitcher } from '../i18n/language-switcher';
import { ThemeToggle } from '../theme-toggle';
import { UserMenu } from '../auth/user-menu';
import { getLocalizedPath } from '../../lib/i18n/paths';
import type { Locale } from '../../lib/i18n/locales';

/**
 * Shared site header for public marketing surfaces (homepage, blog).
 * Distinct from <TopBar> which carries AppNav and lives on signed-in
 * app surfaces (chat / portfolios / indicators / memory / feedback).
 *
 * Server component: locale-aware logo link is resolved on the server,
 * and the only client behaviour comes from the three control widgets
 * (LanguageSwitcher / ThemeToggle / UserMenu), which already manage
 * their own client boundaries.
 *
 * Layout: Logo (links home) on the left, control cluster on the right.
 * Sticky so the brand stays accessible while reading a long blog post.
 */
export function SiteHeader({ lang }: { lang: Locale }) {
  const homeHref = getLocalizedPath('/', lang);
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 lg:px-8">
        <Link
          href={homeHref}
          className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="PickSkill"
        >
          <Logo />
        </Link>
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
