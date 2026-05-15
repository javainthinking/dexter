/**
 * EventSink — destination for AgentEvent streams.
 *
 * Each entrypoint has a different sink:
 *   - adapters/eventsink/ink         CLI Ink history renderer
 *   - adapters/eventsink/whatsapp    Buffers tokens, sends WhatsApp message on done
 *   - adapters/eventsink/sse         Web — pushes to a ReadableStream consumed
 *                                    by AI SDK / EventSource client
 *   - adapters/eventsink/memory      Tests — accumulates into an array
 */

import type { AgentEvent } from '../agent/types.js';

export interface EventSink {
  emit(event: AgentEvent): void;

  /**
   * Signal that the current turn is complete. Sinks that batch output
   * (WhatsApp) flush their accumulated state here.
   * Streaming sinks (SSE, Ink) may use this to close the stream.
   */
  flush(): Promise<void>;

  /** Tear down resources permanently. */
  close(): Promise<void>;
}
