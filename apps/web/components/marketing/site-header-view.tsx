import Link from 'next/link';
import { Logo } from '../logo';
import { LanguageSwitcher } from '../i18n/language-switcher';
import { ThemeToggle } from '../theme-toggle';
import { UserMenu } from '../auth/user-menu';
import { MobileMenu } from './mobile-menu';
import { getLocalizedPath } from '../../lib/i18n/paths';
import type { Locale } from '../../lib/i18n/locales';
import type { Dictionary } from '../../app/[lang]/dictionaries';

/**
 * Markup of the shared site header, split from <SiteHeader> so it can also
 * render where no route params exist (the 404 page reads locale and
 * dictionary from context). Synchronous and import-light on purpose: it
 * must not pull the dictionary loader, which bundles every locale, into
 * client code. See site-header.tsx for layout notes.
 */
export function SiteHeaderView({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const homeHref = getLocalizedPath('/', lang);

  const navLinks = [
    { href: getLocalizedPath('/features', lang), label: dict.nav?.features ?? 'Features' },
    { href: getLocalizedPath('/stocks', lang), label: dict.nav?.stocks ?? 'Stocks' },
    { href: getLocalizedPath('/blog', lang), label: dict.nav?.blog ?? 'Blog' },
    { href: getLocalizedPath('/pricing', lang), label: dict.nav?.pricing ?? 'Pricing' },
    { href: getLocalizedPath('/download', lang), label: dict.download.nav },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="relative mx-auto flex h-14 max-w-6xl items-center justify-between px-5 lg:px-8">
        <Link
          href={homeHref}
          className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="PickSkill"
        >
          <Logo />
        </Link>
        {/* Absolutely centered so the nav sits in the middle of the header
            regardless of the (asymmetric) logo and control-cluster widths.
            Hidden below `lg` (five links in the longer locales would collide
            with the control cluster), where <MobileMenu> exposes them. */}
        <nav
          className="absolute inset-y-0 left-1/2 hidden -translate-x-1/2 items-center gap-5 lg:flex xl:gap-6"
          aria-label="Primary"
        >
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:underline"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
          <UserMenu />
          <MobileMenu links={navLinks} />
        </div>
      </div>
    </header>
  );
}
