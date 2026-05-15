/**
 * Composition root for the CLI surface.
 *
 * Wires the "local" adapters together into a CorePorts bundle that the
 * AgentRunnerController can be initialised with. The CLI's Ink renderer
 * is already driven directly off the controller, so an EventSink is
 * optional here — callers that want event mirroring (e.g. recording an
 * Ink session for replay) can pass one in.
 *
 * Layering rule: this is the ONLY place inside the CLI entrypoint that
 * imports `src/adapters/*`. Everything else uses ports.
 */

import type { CorePorts, EventSink } from '../../ports/index.js';
import { systemClock } from '../../ports/index.js';
import { LocalFsBlobStore } from '../../adapters/blob/local-fs.js';
import { LocalMemoryAdapter } from '../../adapters/memory/local.js';
import { EnvSecretsVault } from '../../adapters/secrets/env.js';
import { ConsoleLogger } from '../../adapters/logger/console.js';
import { DisabledBrowserDriver } from '../../adapters/browser/disabled.js';

export interface CliPortsOptions {
  events?: EventSink;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}

/**
 * Build the CorePorts bundle for an interactive CLI session.
 *
 * Notes:
 *   - Memory uses the existing MemoryManager singleton (local SQLite vector
 *     index + markdown files under .dexter/memory/).
 *   - Browser is reported "disabled" by default. CLI still uses the legacy
 *     Playwright path through src/tools/browser/ until P-future when the
 *     tool is rewritten to consume the BrowserDriver port. Setting this to
 *     a Playwright adapter is a one-line swap at that point.
 *   - SecretsVault reads process.env (dotenv-loaded by src/index.tsx).
 */
export async function composeCliPorts(options: CliPortsOptions = {}): Promise<CorePorts> {
  const blob = new LocalFsBlobStore();
  const memory = await LocalMemoryAdapter.create();
  const secrets = new EnvSecretsVault();
  const logger = new ConsoleLogger({ minLevel: options.logLevel ?? 'info' });
  const browser = new DisabledBrowserDriver();
  const events: EventSink = options.events ?? createNoopEventSink();
  return {
    blob,
    memory,
    events,
    secrets,
    browser,
    clock: systemClock,
    logger,
  };
}

function createNoopEventSink(): EventSink {
  return {
    emit() {
      /* noop */
    },
    async flush() {
      /* noop */
    },
    async close() {
      /* noop */
    },
  };
}
