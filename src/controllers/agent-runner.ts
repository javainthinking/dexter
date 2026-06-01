import { Agent } from '../agent/agent.js';
import type { InMemoryChatHistory } from '../utils/in-memory-chat-history.js';
import { defaultQueue } from '../utils/message-queue.js';
import type {
  AgentConfig,
  AgentEvent,
  ApprovalDecision,
  DoneEvent,
} from '../agent/index.js';
import type { DisplayEvent, StreamMode } from '../agent/types.js';
import type { HistoryItem, HistoryItemStatus, WorkingState } from '../types.js';
import type { CorePorts, EventSink } from '../ports/index.js';
import { withMemory } from '../runtime/memory-context.js';
import {
  withOfficeRun,
  drainOfficeRun,
  peekTouchedFiles,
  restoreOfficeTouches,
  officeRunBlockedFileAttempt,
} from '../runtime/office-run.js';
import type { ContinuationSnapshot } from '../agent/agent.js';
import type { BaseMessage } from '@langchain/core/messages';

export interface TurnStats {
  turnStartMs: number;
  streamedChars: number;
  streamMode: StreamMode;
}

type ChangeListener = () => void;

export interface RunQueryResult {
  answer: string;
}

/**
 * Did this conversation history include a web/X search tool call? Used to
 * recover the deep-research signal in resume hops, where the search may have
 * fired in an earlier chunk. Scans the serialized messages for the tool name
 * tokens — robust to LangChain's exact serialized shape.
 */
function messagesUsedSearch(messages: BaseMessage[] | undefined): boolean {
  if (!messages?.length) return false;
  try {
    const blob = JSON.stringify(messages);
    return blob.includes('"web_search"') || blob.includes('"x_search"');
  } catch {
    return false;
  }
}

/**
 * Options for chunked agent execution. When provided, the controller
 * enables the time-budget gate in `Agent.runLoop`, emits a
 * `continuation_required` event when the budget is hit, and invokes
 * the caller-provided callbacks for persistence + final-answer
 * recording. CLI calls leave this undefined and run uninterrupted.
 */
export interface ChunkRunOpts {
  /** Job row in dexter_agent_jobs; required when chunking is enabled. */
  jobId: string;
  /** 0-indexed chunk number being served by this invocation. */
  chunkIndex?: number;
  /**
   * Set on every chunk after the first. The controller switches to
   * `Agent.runContinuation` and seeds the office-run scope with
   * `touchedFiles` from earlier chunks.
   */
  resume?: {
    messages: BaseMessage[];
    totalIterations: number;
    requiredNudges: number;
    lastApiInputTokens: number;
    originalStartTime: number;
    touchedFiles: string[];
  };
  /**
   * Called when `continuation_required` fires. The snapshot carries
   * everything needed to resume the next chunk. Failures inside the
   * callback are swallowed (logged by the caller) — the SSE stream
   * still closes cleanly so the client can re-issue.
   */
  onContinuation?: (
    snapshot: ContinuationSnapshot & { touchedFiles: string[] },
  ) => Promise<void>;
  /**
   * Called when the agent emits a terminal `done` event. `deliverableCount`
   * is the number of files produced this turn; `usedDeepResearch` is true
   * when the turn invoked a web/X search tool (a "deep-research turn") —
   * both feed usage metering.
   */
  onDone?: (
    finalAnswer: string,
    deliverableCount: number,
    usedDeepResearch: boolean,
    fileLimitHit: boolean,
  ) => Promise<void>;
}

/**
 * Optional bundle of runtime dependencies the controller delegates IO through.
 *
 * Phase 0: ports are accepted but the deeper `Agent` class still references
 * its own modules directly. Composition roots construct adapters and pass
 * them in so the seam is observable; Phase 2 will rewire `Agent` to consume
 * them as well, which is what unlocks Postgres/Vercel-Blob backed Web runs.
 */
export interface AgentRunnerPorts extends Partial<CorePorts> {
  /** Optional sink that receives every AgentEvent the runner produces. */
  events?: EventSink;
}

export class AgentRunnerController {
  private historyValue: HistoryItem[] = [];
  private workingStateValue: WorkingState = { status: 'idle' };
  private errorValue: string | null = null;
  private pendingApprovalValue: { tool: string; args: Record<string, unknown> } | null = null;
  private turnStartMsValue: number | null = null;
  private streamedCharsValue = 0;
  private streamModeValue: StreamMode | null = null;
  private agentConfig: AgentConfig;
  private readonly inMemoryChatHistory: InMemoryChatHistory;
  private readonly onChange?: ChangeListener;
  private readonly ports: AgentRunnerPorts;
  private abortController: AbortController | null = null;
  private approvalResolve: ((decision: ApprovalDecision) => void) | null = null;
  private sessionApprovedTools = new Set<string>();
  /** Set true when a web/X search tool fires during the current run — the
   *  signal for a "deep-research turn". Reset at the start of each run. */
  private runUsedDeepResearch = false;

  constructor(
    agentConfig: AgentConfig,
    inMemoryChatHistory: InMemoryChatHistory,
    onChange?: ChangeListener,
    ports: AgentRunnerPorts = {},
  ) {
    this.agentConfig = agentConfig;
    this.inMemoryChatHistory = inMemoryChatHistory;
    this.onChange = onChange;
    this.ports = ports;
  }

  /** Inject or replace ports after construction (used by tests / composition roots). */
  setPorts(ports: AgentRunnerPorts): void {
    Object.assign(this.ports, ports);
  }

  /** Expose for surfaces that want direct access (Web SSE wiring, etc). */
  get runtimePorts(): Readonly<AgentRunnerPorts> {
    return this.ports;
  }

  get history(): HistoryItem[] {
    return this.historyValue;
  }

  get workingState(): WorkingState {
    return this.workingStateValue;
  }

  get error(): string | null {
    return this.errorValue;
  }

  get pendingApproval(): { tool: string; args: Record<string, unknown> } | null {
    return this.pendingApprovalValue;
  }

  get turnStats(): TurnStats | null {
    if (this.turnStartMsValue === null) return null;
    return {
      turnStartMs: this.turnStartMsValue,
      streamedChars: this.streamedCharsValue,
      streamMode: this.streamModeValue ?? 'requesting',
    };
  }

  get isProcessing(): boolean {
    return (
      this.historyValue.length > 0 && this.historyValue[this.historyValue.length - 1]?.status === 'processing'
    );
  }

  setError(error: string | null) {
    this.errorValue = error;
    this.emitChange();
  }

  get currentConfig(): Readonly<AgentConfig> {
    return this.agentConfig;
  }

  updateAgentConfig(config: Partial<Pick<AgentConfig, 'model' | 'modelProvider' | 'maxIterations'>>) {
    this.agentConfig = {
      ...this.agentConfig,
      ...config,
    };
  }

  respondToApproval(decision: ApprovalDecision) {
    if (!this.approvalResolve) {
      return;
    }
    this.approvalResolve(decision);
    this.approvalResolve = null;
    this.pendingApprovalValue = null;
    if (decision !== 'deny') {
      this.workingStateValue = { status: 'thinking' };
    }
    this.emitChange();
  }

  cancelExecution() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    if (this.approvalResolve) {
      this.approvalResolve('deny');
      this.approvalResolve = null;
      this.pendingApprovalValue = null;
    }
    this.markLastProcessing('interrupted');
    this.workingStateValue = { status: 'idle' };
    this.resetTurnStats();
    this.emitChange();
  }

  async runQuery(
    query: string,
    chunkOpts?: ChunkRunOpts,
  ): Promise<RunQueryResult | undefined> {
    // Enter the Memory scope so memory_* tools that run inside this turn
    // pick up the injected port (MemoryLake for cloud Web, LocalMemoryAdapter
    // for CLI). When no Memory port is injected (legacy callers) the scope
    // is skipped and tools fall back to the local default.
    // Outer scope is the office-run touch tracker. The Agent's office
    // tool calls record file mutations into this scope; when the agent
    // emits its 'done' event we drain the set, upload to R2, and attach
    // the resulting download URLs to the event before forwarding it.
    // Nested under withMemory because both scopes must be active for the
    // duration of any tool that reads either.
    const wrapped = () => {
      // On resume, seed the office-run scope with files touched in
      // previous chunks so the final drain still uploads them.
      if (chunkOpts?.resume?.touchedFiles?.length) {
        restoreOfficeTouches(chunkOpts.resume.touchedFiles);
      }
      if (this.ports.memory) {
        return withMemory(this.ports.memory, () => this.runQueryInner(query, chunkOpts));
      }
      return this.runQueryInner(query, chunkOpts);
    };
    return withOfficeRun(wrapped, {
      fileGenerationBlocked: this.agentConfig.disableFileGeneration ?? false,
    });
  }

  private async runQueryInner(
    query: string,
    chunkOpts?: ChunkRunOpts,
  ): Promise<RunQueryResult | undefined> {
    this.abortController = new AbortController();
    this.runUsedDeepResearch = false;
    let finalAnswer: string | undefined;

    const startTime = Date.now();
    const item: HistoryItem = {
      id: String(startTime),
      query,
      events: [],
      answer: '',
      status: 'processing',
      startTime,
    };
    this.historyValue = [...this.historyValue, item];
    this.inMemoryChatHistory.saveUserQuery(query);
    this.errorValue = null;
    this.workingStateValue = { status: 'thinking' };
    this.turnStartMsValue = startTime;
    this.streamedCharsValue = 0;
    this.streamModeValue = 'requesting';
    this.emitChange();

    try {
      const agent = await Agent.create({
        ...this.agentConfig,
        signal: this.abortController.signal,
        requestToolApproval: this.requestToolApproval,
        sessionApprovedTools: this.sessionApprovedTools,
        messageQueue: defaultQueue,
      });
      // Choose the entrypoint: fresh run for chunk 0 (or non-chunked
      // CLI calls), `runContinuation` when resuming from a prior chunk.
      const stream = chunkOpts?.resume
        ? agent.runContinuation({
            jobId: chunkOpts.jobId!,
            query,
            messages: chunkOpts.resume.messages,
            totalIterations: chunkOpts.resume.totalIterations,
            requiredNudges: chunkOpts.resume.requiredNudges,
            lastApiInputTokens: chunkOpts.resume.lastApiInputTokens,
            originalStartTime: chunkOpts.resume.originalStartTime,
            chunkIndex: chunkOpts.chunkIndex ?? 0,
          })
        : agent.run(query, this.inMemoryChatHistory, {
            jobId: chunkOpts?.jobId,
            chunkIndex: chunkOpts?.chunkIndex,
          });
      for await (const event of stream) {
        if (event.type === 'continuation_required') {
          // Snapshot agent state + office-run touches and hand them off
          // to the route handler via the onContinuation callback. The
          // route persists to dexter_agent_jobs and closes the SSE
          // stream. We deliberately do NOT drain — touched files are
          // carried forward into the next chunk's drain via
          // restoreOfficeTouches() above.
          const snapshot = agent.consumeContinuationSnapshot();
          if (snapshot && chunkOpts?.onContinuation) {
            try {
              await chunkOpts.onContinuation({
                ...snapshot,
                touchedFiles: peekTouchedFiles(),
              });
            } catch {
              /* persistence failure is logged by the callback */
            }
          }
          await this.handleEvent(event);
          // Returning here closes the SSE stream cleanly; the client's
          // auto-resume kicks off a fresh function invocation.
          return undefined;
        }
        if (event.type === 'done') {
          finalAnswer = (event as DoneEvent).answer;
          // Drain the office-run touch set: upload every non-empty file
          // the agent touched to R2 in one batch and attach the
          // resulting deliverables to the event. drainOfficeRun is a
          // no-op when no scope is active or no files were touched, so
          // this stays safe for non-office runs.
          let deliverables: DoneEvent['deliverables'] = [];
          try {
            deliverables = await drainOfficeRun();
          } catch {
            // Best-effort delivery — if uploads fail, the answer still
            // ships without download chips. drainOfficeRun already
            // logged the individual failures.
          }
          const finalEvent = { ...event, deliverables } as DoneEvent;
          if (chunkOpts?.onDone) {
            // Deep-research signal: a search this invocation, OR one in an
            // earlier chunk (the rehydrated history carries prior tool
            // calls, so a search in chunk 0 still counts when the turn
            // completes in a resume hop).
            const usedDeepResearch =
              this.runUsedDeepResearch || messagesUsedSearch(chunkOpts.resume?.messages);
            const fileLimitHit = officeRunBlockedFileAttempt();
            try {
              await chunkOpts.onDone(
                finalEvent.answer,
                deliverables.length,
                usedDeepResearch,
                fileLimitHit,
              );
            } catch {
              /* persistence failure shouldn't block delivery */
            }
          }
          await this.handleEvent(finalEvent);
        } else {
          await this.handleEvent(event);
        }
      }

      // Post-run: if messages arrived after the agent's last drain, start a new turn
      if (!defaultQueue.isEmpty()) {
        const remaining = defaultQueue.dequeueAll();
        const mergedText = remaining.map(m => m.text).join('\n\n');
        return this.runQuery(mergedText);
      }

      if (finalAnswer) {
        return { answer: finalAnswer };
      }
      return undefined;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        this.markLastProcessing('interrupted');
        this.workingStateValue = { status: 'idle' };
        this.resetTurnStats();
        this.emitChange();
        return undefined;
      }
      const message = error instanceof Error ? error.message : String(error);
      this.errorValue = message;
      this.markLastProcessing('error');
      this.workingStateValue = { status: 'idle' };
      this.resetTurnStats();
      this.emitChange();
      return undefined;
    } finally {
      this.abortController = null;
      // Let WhatsApp / SSE sinks flush whatever they buffered for this turn.
      // Failures are swallowed so a broken sink can't poison the agent loop.
      if (this.ports.events) {
        try {
          await this.ports.events.flush();
        } catch {
          /* swallow */
        }
      }
    }
  }

  private resetTurnStats() {
    this.turnStartMsValue = null;
    this.streamedCharsValue = 0;
    this.streamModeValue = null;
  }

  private requestToolApproval = (request: { tool: string; args: Record<string, unknown> }) => {
    return new Promise<ApprovalDecision>((resolve) => {
      this.approvalResolve = resolve;
      this.pendingApprovalValue = request;
      this.workingStateValue = { status: 'approval', toolName: request.tool };
      this.emitChange();
    });
  };

  private async handleEvent(event: AgentEvent) {
    // Fan out to any injected EventSink (Web SSE, WhatsApp, test collector).
    // CLI Ink renderer still consumes the reduced history below.
    try {
      this.ports.events?.emit(event);
    } catch {
      /* sink failures must never break the agent loop */
    }
    switch (event.type) {
      case 'thinking':
        this.workingStateValue = { status: 'thinking' };
        this.pushEvent({
          id: `thinking-${Date.now()}`,
          event,
          completed: true,
        });
        break;
      case 'tool_start': {
        const toolId = event.toolCallId ?? `tool-${event.tool}-${Date.now()}`;
        // A web/X search invocation marks this turn as deep research.
        if (event.tool === 'web_search' || event.tool === 'x_search') {
          this.runUsedDeepResearch = true;
        }
        this.workingStateValue = { status: 'tool', toolName: event.tool };
        this.updateLastItem((last) => ({
          ...last,
          activeToolId: toolId,
          events: [
            ...last.events,
            {
              id: toolId,
              event,
              completed: false,
            } as DisplayEvent,
          ],
        }));
        break;
      }
      case 'tool_progress':
        this.updateLastItem((last) => ({
          ...last,
          events: last.events.map((entry) =>
            entry.id === last.activeToolId ? { ...entry, progressMessage: event.message } : entry,
          ),
        }));
        break;
      case 'tool_end': {
        const endToolId = event.toolCallId ?? this.getLastItem()?.activeToolId;
        this.updateLastItem((last) => ({
          ...last,
          events: last.events.map((entry) =>
            entry.id === endToolId ? { ...entry, completed: true, endEvent: event } : entry,
          ),
        }));
        this.workingStateValue = { status: 'thinking' };
        break;
      }
      case 'tool_error': {
        const errToolId = event.toolCallId ?? this.getLastItem()?.activeToolId;
        this.updateLastItem((last) => ({
          ...last,
          events: last.events.map((entry) =>
            entry.id === errToolId ? { ...entry, completed: true, endEvent: event } : entry,
          ),
        }));
        this.workingStateValue = { status: 'thinking' };
        break;
      }
      case 'tool_approval':
        this.pushEvent({
          id: `approval-${event.tool}-${Date.now()}`,
          event,
          completed: true,
        });
        break;
      case 'tool_denied':
        this.pushEvent({
          id: `denied-${event.tool}-${Date.now()}`,
          event,
          completed: true,
        });
        break;
      case 'tool_limit':
      case 'context_cleared':
      case 'compaction':
      case 'microcompact':
      case 'queue_drain':
        this.pushEvent({
          id: `${event.type}-${Date.now()}`,
          event,
          completed: true,
        });
        break;
      case 'stream_progress':
        // Update accumulators without firing onChange — the working indicator
        // pulls turnStats on its own spinner tick. Avoids a per-chunk emitChange
        // storm that stutters input.
        this.streamedCharsValue += event.charDelta;
        this.streamModeValue = event.mode;
        return;
      case 'done': {
        const done = event as DoneEvent;
        if (done.answer) {
          await this.inMemoryChatHistory.saveAnswer(done.answer).catch(() => {});
        }
        // Attach this turn's files to history so they persist alongside the
        // answer. Store only the durable subset (key + metadata) — the
        // presigned URL is re-minted on read. No-op when there are none.
        if (done.deliverables && done.deliverables.length > 0) {
          this.inMemoryChatHistory.saveDeliverables(
            done.deliverables.map((d) => ({
              filename: d.filename,
              key: d.key,
              byteLength: d.byteLength,
            })),
          );
        }
        this.updateLastItem((last) => ({
          ...last,
          answer: done.answer,
          status: 'complete',
          duration: done.totalTime,
          tokenUsage: done.tokenUsage,
          tokensPerSecond: done.tokensPerSecond,
        }));
        this.workingStateValue = { status: 'idle' };
        this.resetTurnStats();
        break;
      }
    }
    this.emitChange();
  }

  private pushEvent(displayEvent: DisplayEvent) {
    this.updateLastItem((last) => ({ ...last, events: [...last.events, displayEvent] }));
  }

  private getLastItem(): HistoryItem | undefined {
    return this.historyValue[this.historyValue.length - 1];
  }

  private updateLastItem(updater: (item: HistoryItem) => HistoryItem) {
    const last = this.historyValue[this.historyValue.length - 1];
    if (!last || last.status !== 'processing') {
      return;
    }
    const next = updater(last);
    this.historyValue = [...this.historyValue.slice(0, -1), next];
  }

  private markLastProcessing(status: HistoryItemStatus) {
    const last = this.historyValue[this.historyValue.length - 1];
    if (!last || last.status !== 'processing') {
      return;
    }
    this.historyValue = [...this.historyValue.slice(0, -1), { ...last, status }];
  }

  private emitChange() {
    this.onChange?.();
  }
}
