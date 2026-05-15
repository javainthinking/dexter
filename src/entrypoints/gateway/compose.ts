/**
 * Composition root for the WhatsApp Worker (gateway) surface.
 *
 * Same local-adapter set as CLI, with two differences:
 *   1. EventSink defaults to a WhatsApp-flushing sink so each agent turn
 *      produces exactly one outbound message (call site provides the
 *      `send` callback bound to the right Baileys socket + chat JID).
 *   2. Cron storage + scheduler are constructed here so the long-running
 *      Worker can host the timer loop alongside its WhatsApp socket. The
 *      existing src/gateway/gateway.ts will continue to start the cron
 *      runner directly until P-future; this compose() exposes the seam.
 *
 * Layering rule: only this file imports adapters/ inside the gateway
 * entrypoint.
 */

import type { CorePorts } from '../../ports/index.js';
import { systemClock } from '../../ports/index.js';
import { LocalFsBlobStore } from '../../adapters/blob/local-fs.js';
import { LocalMemoryAdapter } from '../../adapters/memory/local.js';
import { EnvSecretsVault } from '../../adapters/secrets/env.js';
import { ConsoleLogger } from '../../adapters/logger/console.js';
import { DisabledBrowserDriver } from '../../adapters/browser/disabled.js';
import { JsonCronStorage } from '../../adapters/storage/json/cron-storage.js';
import { JsonSessionMetaStore } from '../../adapters/storage/json/session-meta.js';
import { LocalScheduler } from '../../adapters/scheduler/local.js';
import {
  WhatsAppEventSink,
  type WhatsAppSendFn,
} from '../../adapters/eventsink/whatsapp.js';
import { cleanMarkdownForWhatsApp } from '../../gateway/utils.js';

export interface GatewayPortsOptions {
  /** Bound send function targeting a specific chat. Required for live use. */
  send?: WhatsAppSendFn;
  agentId: string;
  fallbackMessage?: string;
}

export interface GatewayPorts extends CorePorts {
  cronStorage: JsonCronStorage;
  sessionMeta: JsonSessionMetaStore;
  scheduler: LocalScheduler;
}

export async function composeGatewayPorts(options: GatewayPortsOptions): Promise<GatewayPorts> {
  const blob = new LocalFsBlobStore();
  const memory = await LocalMemoryAdapter.create();
  const secrets = new EnvSecretsVault();
  const logger = new ConsoleLogger({ baseFields: { surface: 'gateway' } });
  const browser = new DisabledBrowserDriver();
  const cronStorage = new JsonCronStorage();
  const sessionMeta = new JsonSessionMetaStore({ agentId: options.agentId });
  const scheduler = new LocalScheduler();

  const events = options.send
    ? new WhatsAppEventSink({
        send: options.send,
        postprocess: cleanMarkdownForWhatsApp,
        fallback: options.fallbackMessage,
      })
    : {
        emit() {},
        async flush() {},
        async close() {},
      };

  return {
    blob,
    memory,
    events,
    secrets,
    browser,
    clock: systemClock,
    logger,
    cronStorage,
    sessionMeta,
    scheduler,
  };
}
