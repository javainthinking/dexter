import Link from 'next/link';
import { Logo } from '../logo';
import { getLocalizedPath } from '../../lib/i18n/paths';
import type { Locale } from '../../lib/i18n/locales';
import type { Dictionary } from '../../app/[lang]/dictionaries';

/**
 * Shared footer for marketing + blog surfaces. Same instance lives on
 * the homepage and on every blog page (index + posts).
 *
 * Columns:
 *   1. Brand  — logo + tagline. Sets context for first-time visitors.
 *   2. Product — links into the core app sections.
 *   3. Resources — Blog (the entry-point asked for) + Feedback.
 *
 * Bottom row: copyright + investment-advice disclaimer. The disclaimer
 * is load-bearing for compliance — must appear on every page that
 * publishes finance content, not only on the chat surface.
 */
export function SiteFooter({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();
  const copyright =
    dict.footer?.copyright?.replace('{year}', String(year)) ??
    `© ${year} PickSkill`;

  const productLinks = [
    { href: '/chat', label: dict.footer?.product?.chat ?? 'Chat' },
    { href: '/portfolios', label: dict.footer?.product?.portfolios ?? 'Portfolios' },
    { href: '/indicators', label: dict.footer?.product?.indicators ?? 'Indicators' },
    { href: '/pricing', label: dict.footer?.product?.pricing ?? 'Pricing' },
  ];
  const resourceLinks = [
    { href: '/blog', label: dict.footer?.resources?.blog ?? 'Blog' },
    { href: '/feedback', label: dict.footer?.resources?.feedback ?? 'Feedback' },
  ];

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand column — wider on lg so the tagline can breathe. */}
          <div className="lg:col-span-5">
            <Link
              href={getLocalizedPath('/', lang)}
              className="inline-flex rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="PickSkill"
            >
              <Logo size="sm" />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {dict.footer?.tagline ??
                'AI analyst for retail investors. Research, valuation, and portfolio work in plain English.'}
            </p>
          </div>

          {/* Product col */}
          <FooterColumn
            heading={dict.footer?.product?.heading ?? 'Product'}
            links={productLinks.map((l) => ({
              ...l,
              href: getLocalizedPath(l.href, lang),
            }))}
            className="lg:col-span-3"
          />

          {/* Resources col — contains the Blog entry link */}
          <FooterColumn
            heading={dict.footer?.resources?.heading ?? 'Resources'}
            links={resourceLinks.map((l) => ({
              ...l,
              href: getLocalizedPath(l.href, lang),
            }))}
            className="lg:col-span-4"
          />
        </div>

        {/* Bottom row: legal line. Disclaimer is finance-compliance
            critical — keep it visible on every page, not just /chat. */}
        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono uppercase tracking-[0.16em] text-subtle">
            {copyright}
          </p>
          <p className="max-w-md sm:text-right">
            {dict.footer?.disclaimer ??
              dict.landing?.footer?.disclaimer ??
              'Not investment advice. For research and education only.'}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  heading,
  links,
  className,
}: {
  heading: string;
  links: { href: string; label: string }[];
  className?: string;
}) {
  return (
    <div className={className}>
      <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
        {heading}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:underline"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
