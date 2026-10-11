// next/link for the desktop renderer: in-app paths go through ../router,
// external URLs fall through to the browser default (main opens them in
// the system browser).
import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from 'react';
import { isExternal, navigate } from '../router';

type Href = string | { pathname?: string; query?: Record<string, string>; hash?: string };

export interface LinkProps {
  href: Href;
  replace?: boolean;
  scroll?: boolean;
  prefetch?: boolean | null;
  shallow?: boolean;
  locale?: string | false;
}

type Props = LinkProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

function toString(href: Href): string {
  if (typeof href === 'string') return href;
  const q = href.query ? `?${new URLSearchParams(href.query)}` : '';
  return `${href.pathname ?? ''}${q}${href.hash ? `#${href.hash}` : ''}`;
}

const Link = forwardRef<HTMLAnchorElement, Props>(
  ({ href, replace, scroll: _scroll, prefetch: _prefetch, shallow: _shallow, locale: _locale, onClick, ...rest }, ref) => {
    const target = toString(href);
    const handle = (e: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (isExternal(target) || rest.target === '_blank' || rest.download != null) return;
      e.preventDefault();
      navigate(target, { replace });
    };
    return <a ref={ref} href={target} onClick={handle} {...rest} />;
  },
);
Link.displayName = 'Link';
export default Link;
