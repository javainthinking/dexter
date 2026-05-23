/**
 * Cross-page handoff for pre-filling the chat composer.
 *
 * Pattern: a source page (e.g., /indicators "Generate PPT") writes a
 * seed string here, then navigates to /chat. The chat page reads the
 * seed on mount, drops it into the composer, and clears the seed so
 * a subsequent visit starts blank.
 *
 * Why sessionStorage instead of the existing `?prompt=` URL pattern:
 * the export flows ship multi-KB JSON payloads. URL query params get
 * truncated by browsers and proxies in that size range, and exposing
 * the payload in URL history is noisy. sessionStorage holds arbitrary
 * length, is scoped to the tab, and gets cleared automatically on
 * tab close — exactly the lifecycle this use case wants.
 */

const STORAGE_KEY = 'pickskill-chat-seed';

/**
 * Stash a seed string for the next chat-page mount to consume.
 * Best-effort — silently swallows quota / blocked-storage errors
 * because the source page has no good UI recovery: if the seed
 * doesn't land, the user just sees an empty chat composer on
 * arrival, which is the same fallback you'd get without any seed
 * mechanism at all.
 */
export function writeChatSeed(content: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, content);
  } catch {
    /* swallow */
  }
}

/**
 * Read AND clear the seed in one atomic call — chat is the only
 * consumer and only on mount, so leaving the seed around invites
 * stale reads (e.g., back-button navigation re-mounting chat would
 * otherwise replay the previous export). Returns `null` if no seed
 * was set, sessionStorage is blocked, or we're running on the server.
 */
export function readAndClearChatSeed(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const v = window.sessionStorage.getItem(STORAGE_KEY);
    if (v != null) window.sessionStorage.removeItem(STORAGE_KEY);
    return v && v.length > 0 ? v : null;
  } catch {
    return null;
  }
}
