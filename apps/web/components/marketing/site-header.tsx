import Link from 'next/link';
import { Logo } from '../logo';
import { LanguageSwitcher } from '../i18n/language-switcher';
import { ThemeToggle } from '../theme-toggle';
import { UserMenu } from '../auth/user-menu';
import { getLocalizedPath } from '../../lib/i18n/paths';
import type { Locale } from '../../lib/i18n/locales';
import { getDictionary } from '../../app/[lang]/dictionaries';

/**
 * Shared site header for public marketing surfaces (homepage, blog,
 * features, pricing). Distinct from <TopBar> which carries AppNav and
 * lives on signed-in app surfaces (chat / portfolios / indicators / …).
 *
 * Async server component: resolves the locale-aware logo link + nav
 * labels on the server. The only client behaviour comes from the three
 * control widgets (LanguageSwitcher / ThemeToggle / UserMenu), which
 * already manage their own client boundaries.
 *
 * Layout: Logo (links home) + primary nav (Features / Blog / Pricing) on
 * the left, control cluster on the right. Nav links are visible from the
 * `sm` breakpoint up; on mobile the same destinations live in the footer
 * (no client-side hamburger needed). Sticky so the brand + nav stay
 * accessible while reading a long blog post.
 */
export async function SiteHeader({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang);
  const homeHref = getLocalizedPath('/', lang);

  const navLinks = [
    { href: getLocalizedPath('/features', lang), label: dict.nav?.features ?? 'Features' },
    { href: getLocalizedPath('/blog', lang), label: dict.nav?.blog ?? 'Blog' },
    { href: getLocalizedPath('/pricing', lang), label: dict.nav?.pricing ?? 'Pricing' },
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
            Hidden below `sm`, where the footer carries the same links. */}
        <nav
          className="absolute inset-y-0 left-1/2 hidden -translate-x-1/2 items-center gap-6 sm:flex"
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
        </div>
      </div>
    </header>
  );
}
