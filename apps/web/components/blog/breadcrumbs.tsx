import { Fragment } from 'react';
import { ChevronRight } from 'lucide-react';
import { LocalizedLink } from '../i18n/localized-link';

/**
 * One breadcrumb entry. `href` is omitted for the current page; that
 * item renders as plain text with `aria-current="page"` per the
 * WAI-ARIA Breadcrumb pattern. `href` is a clean (unprefixed) path —
 * the underlying LocalizedLink prefixes the current locale itself.
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/**
 * Visible breadcrumb navigation for blog pages — and the place that
 * carries the matching `BreadcrumbList` JSON-LD schema, emitted by
 * the caller alongside this component. Together they satisfy both:
 *
 *   - Users / assistive tech: an `<ol>` inside `<nav aria-label>` with
 *     `aria-current="page"` on the leaf, standard ARIA Breadcrumb.
 *   - Search engines + AI overviews: structured BreadcrumbList JSON-LD
 *     so Google can render the breadcrumb path under the page title in
 *     SERPs, and AI crawlers can attribute the post to its section.
 *
 * Separator is a Lucide `ChevronRight` rather than a slash — slashes
 * are still announced as "slash" by some screen readers, while the
 * SVG carries `aria-hidden` and is skipped entirely.
 */
export function Breadcrumbs({
  items,
  ariaLabel,
  className,
}: {
  items: BreadcrumbItem[];
  ariaLabel: string;
  className?: string;
}) {
  return (
    <nav
      aria-label={ariaLabel}
      className={
        className ??
        'mb-8 font-mono text-[11px] uppercase tracking-[0.14em] text-subtle'
      }
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <Fragment key={`${i}-${item.label}`}>
              {i > 0 && (
                <ChevronRight
                  className="size-3 text-subtle"
                  aria-hidden="true"
                />
              )}
              <li className="inline-flex items-center">
                {item.href && !isLast ? (
                  <LocalizedLink
                    href={item.href}
                    className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:text-foreground"
                  >
                    {item.label}
                  </LocalizedLink>
                ) : (
                  <span
                    aria-current={isLast ? 'page' : undefined}
                    className="text-foreground"
                  >
                    {item.label}
                  </span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
