/**
 * Ports — the dependency-inversion boundary between Dexter's agent core and
 * the runtime it executes in (CLI / WhatsApp Worker / Vercel Web).
 *
 * Rule: code under `src/agent/`, `src/controllers/`, `src/tools/`, `src/skills/`
 * may import from this file. It MUST NOT import anything from `src/adapters/`.
 * Composition roots under `src/entrypoints/<surface>/compose.ts` are the only
 * place that wires concrete adapters into the agent runner.
 */

export type { BlobStore, BlobPutOptions, BlobUrlOptions } from './blob.js';
export type { KvStore } from './kv.js';
export type { SessionMetaStore, SessionEntry } from './session-meta.js';
export type { CronStorage } from './cron-storage.js';
export type { Scheduler, SchedulerTickHandler } from './scheduler.js';
export type { SecretsVault, SecretName } from './secrets.js';
export type { EventSink } from './event-sink.js';
export type { Memory } from './memory.js';
export type { BrowserDriver, BrowserSnapshot } from './browser.js';
export type { Clock } from './clock.js';
export { systemClock } from './clock.js';
export type { Logger, LogLevel } from './logger.js';
export type {
  WebSessionStore,
  WebSessionRecord,
  WebChatTurn,
  WebSessionCreateOptions,
} from './web-session.js';

/**
 * Aggregate bundle that the AgentRunnerController constructor will accept.
 * Composition roots build one of these and pass it in.
 */
import type { BlobStore } from './blob.js';
import type { Memory } from './memory.js';
import type { EventSink } from './event-sink.js';
import type { SecretsVault } from './secrets.js';
import type { BrowserDriver } from './browser.js';
import type { Clock } from './clock.js';
import type { Logger } from './logger.js';

export interface CorePorts {
  blob: BlobStore;
  memory: Memory;
  events: EventSink;
  secrets: SecretsVault;
  browser: BrowserDriver;
  clock: Clock;
  logger: Logger;
}
