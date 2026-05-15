/**
 * WhatsAppEventSink — buffers an agent run and emits a single WhatsApp
 * message on flush.
 *
 * The WhatsApp surface is request/response, not streaming — users see one
 * message per turn. We accumulate the final `done` event and let the
 * existing WhatsApp gateway code do the actual sending. The sink is
 * intentionally thin so tests can drop in a stub `send` callback.
 */

import type { EventSink } from '../../ports/event-sink.js';
import type { AgentEvent, DoneEvent } from '../../agent/types.js';

export type WhatsAppSendFn = (text: string) => Promise<void>;

export interface WhatsAppEventSinkOptions {
  send: WhatsAppSendFn;
  /** Optional pre-processor (e.g. cleanMarkdownForWhatsApp). */
  postprocess?: (text: string) => string;
  /** Fallback message when the agent did not produce an answer. */
  fallback?: string;
}

export class WhatsAppEventSink implements EventSink {
  private lastAnswer: string | undefined;
  private flushed = false;

  constructor(private readonly options: WhatsAppEventSinkOptions) {}

  emit(event: AgentEvent): void {
    if (event.type === 'done') {
      const done = event as DoneEvent;
      this.lastAnswer = done.answer;
    }
  }

  async flush(): Promise<void> {
    if (this.flushed) return;
    this.flushed = true;
    const raw = this.lastAnswer ?? this.options.fallback ?? '';
    if (!raw) return;
    const text = this.options.postprocess ? this.options.postprocess(raw) : raw;
    await this.options.send(text);
  }

  async close(): Promise<void> {
    /* no-op */
  }
}
