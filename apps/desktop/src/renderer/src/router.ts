import { useSyncExternalStore } from 'react';

/**
 * Minimal client-side router standing in for the Next.js App Router.
 * Paths keep web's shape (`/portfolios`, `/zh-CN/indicators`, …) so the
 * shared components' locale helpers and active-state checks work as-is.
 */

export interface Location {
  pathname: string;
  search: string;
}

type Listener = () => void;
const listeners = new Set<Listener>();
let current: Location = { pathname: window.location.pathname, search: window.location.search };

function emit(): void {
  current = { pathname: window.location.pathname, search: window.location.search };
  for (const l of listeners) l();
}

window.addEventListener('popstate', emit);
window.pickskill.onNavigate((path) => navigate(path));

export function isExternal(href: string): boolean {
  return /^([a-z][a-z0-9+.-]*:|\/\/)/i.test(href);
}

export function navigate(href: string, { replace = false } = {}): void {
  if (isExternal(href)) {
    // main routes window.open to the system browser.
    window.open(href, '_blank');
    return;
  }
  const url = new URL(href, window.location.href);
  if (replace) window.history.replaceState(null, '', url);
  else window.history.pushState(null, '', url);
  emit();
  if (!replace && !url.hash) window.scrollTo(0, 0);
}

function subscribe(l: Listener): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useLocation(): Location {
  return useSyncExternalStore(subscribe, () => current);
}

let refreshKey = 0;
const refreshListeners = new Set<Listener>();

/** Equivalent of `router.refresh()`: page loaders re-fetch their initial data. */
export function refresh(): void {
  refreshKey++;
  for (const l of refreshListeners) l();
}

export function useRefreshKey(): number {
  return useSyncExternalStore(
    (l) => {
      refreshListeners.add(l);
      return () => refreshListeners.delete(l);
    },
    () => refreshKey,
  );
}
