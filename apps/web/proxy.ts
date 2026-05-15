import { NextResponse, type NextRequest } from 'next/server';
import { defaultLocale, isLocale, locales } from './lib/i18n/locales';

/**
 * i18n proxy — Next.js 16 routing primitive for request interception,
 * rewrites, and redirects (introduced as the successor to the legacy
 * request-interceptor in v15).
 *
 * URL contract:
 *   /              → English content (rewrites to /en internally)
 *   /chat          → English chat   (rewrites to /en/chat)
 *   /fr            → French content (no rewrite, the [lang] segment matches)
 *   /fr/chat       → French chat
 *   /en, /en/chat  → permanent redirect to the unprefixed canonical form
 *   /api/*         → untouched
 *   /_next/*       → untouched
 *
 * Locale detection for the unprefixed root: read `dexter_lang` cookie, then
 * Accept-Language header, then fall back to `defaultLocale`. If the detected
 * locale is non-default we **redirect** to its prefixed URL so search engines
 * and analytics see one canonical URL per locale.
 */

const PUBLIC_FILE = /\.(?:.*)$/;

export function proxy(request: NextRequest): NextResponse {
  const { pathname, search } = request.nextUrl;

  // Skip API, Next internals, and static files.
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname === '/favicon.ico' ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];

  // /en or /en/<rest> → redirect to the canonical unprefixed form.
  if (first === defaultLocale) {
    const stripped = segments.slice(1).join('/');
    const url = request.nextUrl.clone();
    url.pathname = stripped ? `/${stripped}` : '/';
    url.search = search;
    return NextResponse.redirect(url, 308);
  }

  // /xx/* where xx is a known non-default locale → serve as-is.
  if (first && isLocale(first)) {
    return NextResponse.next();
  }

  // Unprefixed paths: pick a locale and either rewrite (default) or redirect.
  const target = detectLocale(request);
  if (target === defaultLocale) {
    // Rewrite /<path> → /en/<path> so the [lang] segment matches in the FS.
    const url = request.nextUrl.clone();
    url.pathname = pathname === '/' ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`;
    return NextResponse.rewrite(url);
  }

  // Redirect to the user's preferred locale (302 — preference may change).
  const url = request.nextUrl.clone();
  url.pathname = pathname === '/' ? `/${target}` : `/${target}${pathname}`;
  url.search = search;
  return NextResponse.redirect(url, 302);
}

function detectLocale(request: NextRequest): string {
  // Explicit cookie wins.
  const cookieLocale = request.cookies.get('dexter_lang')?.value;
  if (cookieLocale && isLocale(cookieLocale)) {
    return cookieLocale;
  }

  // Accept-Language header — match the best supported locale.
  const accept = request.headers.get('accept-language');
  if (accept) {
    // Parse `en-US,en;q=0.9,fr;q=0.8` → ordered list of bcp47 tags.
    const requested = accept
      .split(',')
      .map((part) => {
        const [tag, qPart] = part.trim().split(';q=');
        return { tag: tag.toLowerCase(), q: qPart ? Number(qPart) : 1 };
      })
      .sort((a, b) => b.q - a.q)
      .map((p) => p.tag);

    for (const tag of requested) {
      // Exact match first (case-insensitive).
      const exact = locales.find((l) => l.toLowerCase() === tag);
      if (exact) return exact;
      // Then primary-language match: `zh-tw` → `zh-TW`; `de-AT` → `de`.
      const primary = tag.split('-')[0];
      const region = tag.split('-')[1];
      if (region) {
        const regional = locales.find(
          (l) => l.toLowerCase() === `${primary}-${region}`,
        );
        if (regional) return regional;
      }
      const fallback = locales.find((l) => l.toLowerCase() === primary);
      if (fallback) return fallback;
    }
  }
  return defaultLocale;
}

export const config = {
  // Run on all paths except API + Next assets. The `matcher` syntax doesn't
  // support negative lookahead for query strings, so the body of the
  // middleware also guards.
  matcher: ['/((?!api|_next|_vercel|favicon.ico|.*\\..*).*)'],
};
