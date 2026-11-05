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
 * Adapters are local: filesystem blob, env secrets, console
 * logger, disabled browser (CLI still uses the legacy Playwright path
 * through src/tools/browser/ until that tool is rewritten to consume
 * the BrowserDriver port).
 */
export async function composeCliPorts(options: CliPortsOptions = {}): Promise<CorePorts> {
  const blob = new LocalFsBlobStore();
  const secrets = new EnvSecretsVault();
  const logger = new ConsoleLogger({ minLevel: options.logLevel ?? 'info' });
  const browser = new DisabledBrowserDriver();
  const events: EventSink = options.events ?? createNoopEventSink();
  return {
    blob,
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
