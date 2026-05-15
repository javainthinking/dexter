/**
 * InMemoryEventSink — accumulates events into an array.
 *
 * Useful for tests and as the base building block for other sinks
 * (WhatsApp sink composes this + a flush callback).
 */

import type { EventSink } from '../../ports/event-sink.js';
import type { AgentEvent, DoneEvent } from '../../agent/types.js';

export class InMemoryEventSink implements EventSink {
  readonly events: AgentEvent[] = [];
  private closed = false;

  emit(event: AgentEvent): void {
    if (this.closed) return;
    this.events.push(event);
  }

  async flush(): Promise<void> {
    /* no-op */
  }

  async close(): Promise<void> {
    this.closed = true;
  }

  /** Convenience: pull the final answer if a done event was emitted. */
  getDoneAnswer(): string | undefined {
    const done = [...this.events].reverse().find((e): e is DoneEvent => e.type === 'done');
    return done?.answer;
  }
}
