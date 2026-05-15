/**
 * ControllerEventSink — adapter that forwards agent events into an existing
 * AgentRunnerController instance. Used by the CLI entrypoint so the new
 * port-based agent runner can drive the long-standing Ink UI without
 * changing how the renderer reads state.
 *
 * The CLI's AgentRunnerController owns its own event-to-display reduction
 * logic; this sink just gives the agent loop somewhere to push events.
 */

import type { EventSink } from '../../ports/event-sink.js';
import type { AgentEvent } from '../../agent/types.js';

export interface ControllerEventTarget {
  handleAgentEvent(event: AgentEvent): void | Promise<void>;
}

export class ControllerEventSink implements EventSink {
  constructor(private readonly target: ControllerEventTarget) {}

  emit(event: AgentEvent): void {
    void this.target.handleAgentEvent(event);
  }

  async flush(): Promise<void> {
    /* The controller drives its own lifecycle. */
  }

  async close(): Promise<void> {
    /* no-op */
  }
}
