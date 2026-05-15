/**
 * DisabledBrowserDriver — no-op driver that reports unavailability.
 *
 * Phase-0 Web SaaS MVP uses this so the `browser` tool degrades gracefully.
 * CLI/Worker continue to use the existing in-process Playwright code path.
 */

import type { BrowserDriver, BrowserSnapshot } from '../../ports/browser.js';

export class DisabledBrowserDriver implements BrowserDriver {
  isEnabled(): boolean {
    return false;
  }
  async fetch(_url: string): Promise<BrowserSnapshot> {
    throw new Error('Browser tool is not enabled in this runtime.');
  }
  async shutdown(): Promise<void> {
    /* nothing to clean up */
  }
}
