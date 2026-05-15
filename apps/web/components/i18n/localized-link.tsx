'use client';

import * as React from 'react';
import Link, { type LinkProps } from 'next/link';
import { useLocale } from './dictionary-provider';
import { getLocalizedPath } from '../../lib/i18n/paths';

type AnchorProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>;

interface LocalizedLinkProps extends Omit<LinkProps, 'href'>, AnchorProps {
  href: string;
  children?: React.ReactNode;
}

/**
 * A next/link that automatically prefixes the current locale (except for
 * the default locale, which uses clean URLs). External `http(s)://` URLs
 * and mailto:/tel: links pass through untouched.
 */
export const LocalizedLink = React.forwardRef<HTMLAnchorElement, LocalizedLinkProps>(
  ({ href, children, ...props }, ref) => {
    const locale = useLocale();
    const isExternal = /^([a-z]+:|\/\/)/i.test(href);
    const localized = isExternal ? href : getLocalizedPath(href, locale);
    return (
      <Link href={localized} ref={ref} {...props}>
        {children}
      </Link>
    );
  },
);
LocalizedLink.displayName = 'LocalizedLink';
