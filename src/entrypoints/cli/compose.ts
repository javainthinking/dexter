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
import type { Memory } from '../../ports/memory.js';
import { systemClock } from '../../ports/index.js';
import { LocalFsBlobStore } from '../../adapters/blob/local-fs.js';
import { LocalMemoryAdapter } from '../../adapters/memory/local.js';
import { MemoryLakeAdapter } from '../../adapters/memory/memorylake.js';
import { EnvSecretsVault } from '../../adapters/secrets/env.js';
import { ConsoleLogger } from '../../adapters/logger/console.js';
import { DisabledBrowserDriver } from '../../adapters/browser/disabled.js';

export interface CliPortsOptions {
  events?: EventSink;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  /**
   * MemoryLake user_id when MemoryLake credentials are configured.
   * Defaults to env `DEXTER_USER_ID` or 'default' — CLI mode is a
   * single-developer session, not multi-tenant.
   */
  userId?: string;
}

/**
 * Build the CorePorts bundle for an interactive CLI session.
 *
 * Memory backend selection:
 *   - MEMORYLAKE_API_KEY + PROJECT_ID + BASE_URL set → MemoryLakeAdapter
 *     scoped to options.userId (or `DEXTER_USER_ID` env, or 'default').
 *     This is the preferred path so CLI and Web share the same memory
 *     pool when both are pointed at the same MemoryLake project.
 *   - Otherwise → LocalMemoryAdapter (markdown files under .dexter/memory/
 *     via the legacy MemoryManager).
 *
 * Other adapters stay local: filesystem blob, env secrets, console
 * logger, disabled browser (CLI still uses the legacy Playwright path
 * through src/tools/browser/ until that tool is rewritten to consume
 * the BrowserDriver port).
 */
export async function composeCliPorts(options: CliPortsOptions = {}): Promise<CorePorts> {
  const blob = new LocalFsBlobStore();
  const memory = await chooseMemoryAdapter(options);
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

async function chooseMemoryAdapter(options: CliPortsOptions): Promise<Memory> {
  const mlKey = process.env.MEMORYLAKE_API_KEY;
  const mlProject = process.env.MEMORYLAKE_PROJECT_ID;
  const mlBase = process.env.MEMORYLAKE_BASE_URL;
  if (mlKey && mlProject && mlBase) {
    const userId = options.userId ?? process.env.DEXTER_USER_ID ?? 'default';
    return new MemoryLakeAdapter({
      apiKey: mlKey,
      projectId: mlProject,
      baseUrl: mlBase,
      userId,
    });
  }
  return LocalMemoryAdapter.create();
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
