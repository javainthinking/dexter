/**
 * SseEventSink — pushes agent events to a Web ReadableStream as
 * Server-Sent Events. Consumed by the Vercel-hosted Next.js route that
 * proxies the agent stream to AI SDK / EventSource clients.
 *
 * Each agent event becomes one SSE record:
 *   event: <type>
 *   data: <JSON-serialised event>
 *
 * On flush() we send a final `event: close` and close the stream. The Web
 * Function returns the readable side; the agent loop pushes via this sink
 * on the server side.
 */

import type { EventSink } from '../../ports/event-sink.js';
import type { AgentEvent } from '../../agent/types.js';

export class SseEventSink implements EventSink {
  readonly readable: ReadableStream<Uint8Array>;
  private controller!: ReadableStreamDefaultController<Uint8Array>;
  private readonly encoder = new TextEncoder();
  private closed = false;

  constructor() {
    this.readable = new ReadableStream<Uint8Array>({
      start: (controller) => {
        this.controller = controller;
      },
      cancel: () => {
        this.closed = true;
      },
    });
  }

  emit(event: AgentEvent): void {
    if (this.closed) return;
    const payload = `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`;
    this.controller.enqueue(this.encoder.encode(payload));
  }

  async flush(): Promise<void> {
    if (this.closed) return;
    this.controller.enqueue(this.encoder.encode('event: close\ndata: {}\n\n'));
  }

  async close(): Promise<void> {
    if (this.closed) return;
    this.closed = true;
    try {
      this.controller.close();
    } catch {
      /* already closed */
    }
  }
}
