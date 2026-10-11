// next/navigation for the desktop renderer, backed by ../router.
import { useMemo } from 'react';
import { navigate, refresh, useLocation } from '../router';

const router = {
  push: (href: string) => navigate(href),
  replace: (href: string) => navigate(href, { replace: true }),
  back: () => window.history.back(),
  forward: () => window.history.forward(),
  refresh,
  prefetch: () => {},
};

export function useRouter() {
  return router;
}

export function usePathname(): string {
  return useLocation().pathname;
}

export function useSearchParams(): URLSearchParams {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export function redirect(href: string): never {
  navigate(href, { replace: true });
  throw new Error(`redirect: ${href}`);
}

export function notFound(): never {
  throw new Error('not found');
}
