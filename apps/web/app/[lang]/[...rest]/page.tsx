import { notFound } from 'next/navigation';

/**
 * Catch-all for URLs no other route matches. The proxy rewrites every
 * page path under a locale (/foo → /en/foo), so landing here and calling
 * notFound() renders app/[lang]/not-found.tsx inside the localized layout
 * with a real 404 status, instead of Next's unstyled default.
 */
export default function CatchAll(): never {
  notFound();
}
