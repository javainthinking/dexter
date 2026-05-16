import { NextResponse, type NextRequest } from 'next/server';
import { defaultLocale, isLocale, locales } from './lib/i18n/locales';

/**
 * i18n + auth proxy — Next.js 16 routing primitive.
 *
 * URL contract:
 *   /                    → English landing (rewrites to /en)
 *   /chat                → must be signed-in (rewrites to /en/chat or
 *                          redirects to /sign-in)
 *   /fr, /fr/chat        → French content, chat behind auth
 *   /en, /en/chat        → 308 redirect to canonical unprefixed form
 *   /sign-in, /<l>/sign-in → public
 *   /api/auth/*          → public (NextAuth handles cookies)
 *   /api/agent, /api/sessions(/*) → must be signed-in
 *   /_next/*, static files → untouched
 *
 * Auth check is cookie-presence only (cheap, fast, runs on every request).
 * The server pages and API routes re-validate the real session before any
 * user-scoped read or write — proxy is the perimeter, route handlers are
 * the lock.
 */

const PUBLIC_FILE = /\.(?:.*)$/;

const AUTH_COOKIE_NAMES = [
  'next-auth.session-token',
  '__Secure-next-auth.session-token',
];

/** Paths that require auth (after locale stripping). */
const PROTECTED_PREFIXES = ['/chat'];

/** API paths that require auth. */
const PROTECTED_API_PREFIXES = ['/api/agent', '/api/sessions'];

export function proxy(request: NextRequest): NextResponse {
  const { pathname, search } = request.nextUrl;

  // /api/auth/* — let NextAuth handle (sign-in callbacks, etc.).
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Other API: enforce auth for protected endpoints, pass everything else through.
  if (pathname.startsWith('/api')) {
    if (PROTECTED_API_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
      if (!hasAuthCookie(request)) {
        return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
      }
    }
    return NextResponse.next();
  }

  // Next internals + static files: untouched.
  if (
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

  // Auth gate for protected paths. We need to know both the locale and
  // the locale-stripped path. Locale-prefixed (e.g. /fr/chat) or unprefixed
  // (/chat) both flow through this branch.
  const isPrefixed = first && isLocale(first);
  const locale = isPrefixed ? first : detectLocale(request);
  const localeStripped = isPrefixed ? '/' + segments.slice(1).join('/') : pathname;
  const cleanPath = localeStripped === '' ? '/' : localeStripped;

  if (
    PROTECTED_PREFIXES.some((p) => cleanPath === p || cleanPath.startsWith(`${p}/`)) &&
    !hasAuthCookie(request)
  ) {
    const url = request.nextUrl.clone();
    url.pathname =
      locale === defaultLocale ? '/sign-in' : `/${locale}/sign-in`;
    url.searchParams.set(
      'callbackUrl',
      pathname + (search ? search : ''),
    );
    return NextResponse.redirect(url, 302);
  }

  // /xx/* where xx is a known non-default locale → serve as-is.
  if (isPrefixed) {
    return NextResponse.next();
  }

  // Unprefixed paths: pick a locale and either rewrite (default) or redirect.
  if (locale === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === '/' ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`;
    return NextResponse.rewrite(url);
  }
  const url = request.nextUrl.clone();
  url.pathname = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
  url.search = search;
  return NextResponse.redirect(url, 302);
}

function hasAuthCookie(request: NextRequest): boolean {
  return AUTH_COOKIE_NAMES.some((name) => !!request.cookies.get(name));
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
