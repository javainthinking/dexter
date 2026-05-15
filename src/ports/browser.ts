/**
 * BrowserDriver — minimal browser automation surface used by the `browser` tool.
 *
 * Adapters:
 *   - adapters/browser/playwright    Local Chromium via Playwright (CLI / Worker)
 *   - adapters/browser/sandbox       Vercel Sandbox spawning a headless Chromium
 *   - adapters/browser/browserbase   Managed remote browser service
 *   - adapters/browser/disabled      No-op for environments without browser support
 *                                     (Web SaaS MVP). Tool reports unavailable.
 *
 * Intentionally small. The browser tool itself owns higher-level workflows
 * (clicking, scraping). Adapters only need to provide a page-fetch primitive
 * plus optional richer ops.
 */

export interface BrowserSnapshot {
  url: string;
  title: string;
  html: string;
  /** Rendered text content (Readability-stripped where possible). */
  text: string;
}

export interface BrowserDriver {
  isEnabled(): boolean;

  /** Navigate, wait for load, return current page snapshot. */
  fetch(url: string, options?: { waitUntilSelector?: string; timeoutMs?: number }): Promise<BrowserSnapshot>;

  /** Tear down any persistent resources (browser process). */
  shutdown(): Promise<void>;
}
