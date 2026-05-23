/**
 * Cross-page memory of the user's currently-active portfolio.
 *
 * When a user is viewing portfolio X on /portfolios and clicks
 * "Indicators" in the top nav, they expect to see indicators *for
 * portfolio X*, not whichever portfolio happens to be first in their
 * list. Same when the navigation goes the other way (or when they
 * return after a tab refresh).
 *
 * We persist the last-active portfolio id in localStorage. Both pages
 * read it on mount and write it whenever the user changes selection.
 * The id is validated against the user's current portfolio list
 * before use — a deleted portfolio's id falls through to the default
 * (first portfolio) without surfacing an error.
 *
 * localStorage was chosen over a URL query param because the top-nav
 * link is a generic <LocalizedLink href="/indicators">; threading
 * dynamic state through it would mean either re-implementing the nav
 * per page or making it page-aware. localStorage gives the same UX
 * with zero coupling between the nav component and the pages it
 * points at.
 */

const STORAGE_KEY = 'pickskill-active-portfolio-id';

/**
 * Read the last-active portfolio id. Returns `null` when:
 *   - running on the server (no `window`),
 *   - localStorage is blocked / quota-exceeded,
 *   - nothing has been stored yet.
 *
 * Callers are responsible for validating the returned id against
 * their current portfolio list — a portfolio could have been deleted
 * from another tab / device since this id was written.
 */
export function readLastActivePortfolioId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v && v.length > 0 ? v : null;
  } catch {
    return null;
  }
}

/**
 * Write the active portfolio id. Pass `null` to clear (e.g., when
 * the user deletes all their portfolios). Best-effort — silently
 * swallows localStorage errors since this is a UX-continuity hint,
 * not load-bearing data.
 */
export function writeLastActivePortfolioId(id: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (id == null || id.length === 0) {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, id);
    }
  } catch {
    /* swallow */
  }
}

/**
 * Resolve the initial active portfolio id for a page: prefer the
 * last-active stored value when it's still in the user's list,
 * otherwise fall back to the first portfolio (or null if none).
 *
 * Helper so each consuming page doesn't re-implement the same
 * validation gate.
 */
export function resolveInitialActivePortfolioId(
  portfolios: ReadonlyArray<{ id: string }>,
): string | null {
  const stored = readLastActivePortfolioId();
  if (stored && portfolios.some((p) => p.id === stored)) return stored;
  return portfolios[0]?.id ?? null;
}
