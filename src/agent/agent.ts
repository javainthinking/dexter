import { AIMessage, AIMessageChunk, SystemMessage, HumanMessage, ToolMessage, type BaseMessage } from '@langchain/core/messages';
import { StructuredToolInterface } from '@langchain/core/tools';
import { callLlmWithMessages, streamLlmWithMessages } from '../model/llm.js';
import { getTools, getToolConcurrencyMap } from '../tools/registry.js';
import { buildSystemPrompt, loadSoulDocument, loadRulesDocument } from './prompts.js';
import { extractTextContent, hasToolCalls } from '../utils/ai-message.js';
import { InMemoryChatHistory } from '../utils/in-memory-chat-history.js';
import { estimateTokens, getAutoCompactThreshold, KEEP_TOOL_USES } from '../utils/tokens.js';
import { exceedsSizeCap, persistLargeResult, buildPersistedContent } from '../utils/tool-result-storage.js';
import { enforceResultBudget } from '../utils/tool-result-budget.js';
import { formatUserFacingError, isContextOverflowError } from '../utils/errors.js';
import type { AgentConfig, AgentEvent, CompactionEvent, ContextClearedEvent, MicrocompactEvent, QueueDrainEvent, StreamMode, StreamProgressEvent, TokenUsage } from '../agent/types.js';
import type { MessageQueue } from '../utils/message-queue.js';
import { compactContext, MAX_CONSECUTIVE_COMPACTION_FAILURES, MIN_TOOL_RESULTS_FOR_COMPACTION } from './compact.js';
import { microcompactMessages } from './microcompact.js';
import { createRunContext, type RunContext } from './run-context.js';
import { AgentToolExecutor } from './tool-executor.js';
import { MemoryManager } from '../memory/index.js';
import { runMemoryFlush, shouldRunMemoryFlush } from '../memory/flush.js';
import { resolveProvider } from '../providers.js';


const DEFAULT_MODEL = 'gpt-5.5';
// 30 because multi-phase tool chains (e.g. OfficeCLI authoring a
// designed deck: create → set /theme → batch slides → view issues →
// validate → screenshot) already consume 6-10 before any upstream
// research / portfolio / memory calls. The previous 10 cap was tight
// enough to truncate otherwise-correct workflows. The executor's
// no-progress halt + the model's own answer-signalling still bound
// runaway loops well below this cap.
const DEFAULT_MAX_ITERATIONS = 30;
const MAX_OVERFLOW_RETRIES = 2;
const OVERFLOW_KEEP_ROUNDS = 3;

/**
 * Per-chunk wall-clock budget. When the agent is invoked under a
 * chunked job (jobId provided), every iteration checks the elapsed
 * time at the top of the loop and yields `continuation_required` if
 * we've passed this threshold.
 *
 * Vercel functions cap at 300 s. We want margin for:
 *   - the final LLM call in this chunk to complete
 *   - the SSE close + state persistence to Postgres (~1 s)
 *   - the client's auto-resume POST to start the next chunk
 *
 * The headroom MUST cover the worst-case in-flight LLM call — not
 * just the typical one. Long structured-output generations (e.g.,
 * multi-KB OfficeCLI batch payloads) can take 75-115 s; the original
 * 230 s budget left only 70 s of headroom and timed out when an
 * iteration boundary landed deep into the budget AND the next LLM
 * call was a heavy one. 200 s gives 100 s of headroom which covers
 * ~95 s LLM calls — sufficient for the structured-output cases we've
 * observed in production.
 *
 * If you see fresh 300 s timeouts in production, the next step is to
 * track the max LLM-call duration observed in this chunk and yield
 * continuation when `elapsed + observed_max > 280_000`, instead of
 * the fixed threshold here. See chat with user 2026-05-23 for context.
 *
 * For non-chunked runs (jobId not provided), this is ignored — the
 * agent runs until completion or maxIterations regardless.
 */
const CHUNK_BUDGET_MS = 200_000;

/**
 * Hard cap across all chunks of a single agent task. Stops runaway
 * loops without limiting any single chunk. Each chunk respects
 * DEFAULT_MAX_ITERATIONS for that chunk; total iterations track across
 * chunks via the persisted ctx.iteration.
 */
const TOTAL_ITERATION_CAP = 60;
/**
 * How many times we'll refuse to exit the loop because the agent
 * hasn't produced a deliverable yet. Bumped from 2 → 4 after observing
 * cases where the model takes 3+ tries to stop renaming sheets and
 * actually insert data. Beyond 4 the loop exits so a genuinely stuck
 * workflow can't burn the whole 30-iteration budget.
 */
const MAX_REQUIRED_NUDGES = 4;

/**
 * Scan a tool message for an unsatisfied `_required` directive. Tolerates
 * both the new top-level shape (`{ _required: {...}, data: {...} }`) and
 * the legacy nested shape (`{ data: { _required: {...} } }`).
 */
function toolMessageHasRequired(m: ToolMessage): boolean {
  const content = typeof m.content === 'string' ? m.content : JSON.stringify(m.content);
  if (!content.includes('"_required"')) return false;
  try {
    const parsed = JSON.parse(content);
    if (parsed && typeof parsed === 'object') {
      if ('_required' in parsed) return true;
      const data = (parsed as { data?: unknown }).data;
      if (data && typeof data === 'object' && '_required' in data) return true;
    }
  } catch {
    return true;
  }
  return false;
}

/**
 * The decisive "agent must keep going" check.
 *
 * Invariant: if any `office_edit` call ran, the MOST RECENT `office_edit`
 * tool result must NOT be marked `fileIsEmpty: true` and must not carry
 * an unsatisfied `_required` directive. The office tool attaches
 * `fileIsEmpty` to every successful content-producing edit by measuring
 * file size against a per-extension floor; an empty file means the agent
 * has not actually added content yet.
 *
 * R2 uploads now happen ONCE at end-of-run (see runtime/office-run.ts),
 * so a `delivery.downloadUrl` won't be visible inline anymore — we use
 * `fileIsEmpty` as the in-loop proxy for "real artefact exists".
 *
 * Returns true when a nudge is warranted.
 */
function needsContinuation(messages: BaseMessage[]): boolean {
  let lastEdit: ToolMessage | null = null;
  for (const m of messages) {
    if (m instanceof ToolMessage && m.name === 'office_edit') {
      lastEdit = m;
    }
  }
  if (!lastEdit) return false;
  const content = typeof lastEdit.content === 'string' ? lastEdit.content : JSON.stringify(lastEdit.content);
  // A bona-fide tool failure (binary missing, bad argv) shouldn't loop
  // forever — the agent needs to be allowed to surrender.
  if (/"error"\s*:/.test(content) && !content.includes('"_required"')) return false;
  // Strong signal: tool explicitly marked the file empty after the edit.
  if (/"fileIsEmpty"\s*:\s*true/.test(content)) return true;
  // Or the tool returned a _required directive (covers create/new too).
  if (toolMessageHasRequired(lastEdit)) return true;
  // Last office_edit had content-bearing result (fileIsEmpty:false or no
  // emptiness check ran) AND no unfinished directive — agent may exit.
  return false;
}

function buildNudgePrompt(nudgeNumber: number): string {
  if (nudgeNumber === 1) {
    return (
      'STOP — do not respond to the user yet. The work is not complete. ' +
      'Either (a) your most recent tool result includes a `_required` directive ' +
      'whose steps are not yet finished, OR (b) you called `office_edit` but the ' +
      'response was marked `fileIsEmpty: true` — meaning no real content was added. ' +
      'Re-read the last `office_edit` result now and your next action MUST be a tool ' +
      'call that adds real content (e.g. `office_edit subcommand=batch` with slide ops, ' +
      '`office_edit subcommand=add` with `type=row` + `values=[...]`, or ' +
      '`office_edit subcommand=import` for CSV/TSV data). Renaming sheets, setting ' +
      'layouts, or running read calls is NOT adding content. Only when the next ' +
      '`office_edit` returns `fileIsEmpty: false` may you write a final answer.'
    );
  }
  // Escalated message — model has already ignored the first nudge.
  return (
    'CRITICAL — you are about to lie to the user. You have failed to add real content ' +
    `to the file ${nudgeNumber} time(s) in a row, yet you keep trying to declare the ` +
    'task done. The chat UI WILL NOT show the user any download link because R2 ' +
    'upload only runs at end-of-run for files with real content — your "file is ready" ' +
    'message would be a falsehood. Your next action MUST be either: (1) an ' +
    '`office_edit` call that inserts actual data (cells, rows, slides with text, ' +
    'paragraphs) and produces `fileIsEmpty: false` in the response, OR (2) an honest ' +
    'user-facing message admitting you could not produce the artefact and explaining ' +
    'why (e.g. missing source data, ambiguous request). DO NOT pretend the file ' +
    'exists with content when it does not.'
  );
}

/**
 * The core agent class that handles the agent loop and tool execution.
 *
 * Architecture:
 * - Growing message array with full reasoning continuity
 * - Concurrent execution for read-only tools
 * - Streaming LLM responses with fallback to blocking
 * - Per-turn microcompact + threshold-based full compaction
 */
/**
 * Snapshot of the agent's working state captured just before yielding
 * `continuation_required`. The controller reads this via
 * `Agent.consumeContinuationSnapshot()` and persists it to
 * `dexter_agent_jobs`. Each Agent instance is per-request, so storing
 * this on the instance is safe — no cross-request leakage.
 */
export interface ContinuationSnapshot {
  messages: BaseMessage[];
  iteration: number;
  requiredNudges: number;
  lastApiInputTokens: number;
}

export class Agent {
  private readonly model: string;
  private readonly maxIterations: number;
  private readonly tools: StructuredToolInterface[];
  private readonly toolMap: Map<string, StructuredToolInterface>;
  private readonly toolExecutor: AgentToolExecutor;
  private readonly systemPrompt: string;
  private readonly signal?: AbortSignal;
  private readonly memoryEnabled: boolean;
  private readonly messageQueue?: MessageQueue;
  private compactionFailures: number = 0;
  /**
   * Set by `runLoop` immediately before yielding `continuation_required`.
   * The controller reads this synchronously after seeing the event and
   * uses it to write the job row. Cleared on read so a single snapshot
   * can't be re-consumed.
   */
  private continuationSnapshot: ContinuationSnapshot | null = null;

  private constructor(
    config: AgentConfig,
    tools: StructuredToolInterface[],
    systemPrompt: string,
    concurrencyMap: Map<string, boolean>,
  ) {
    this.model = config.model ?? DEFAULT_MODEL;
    this.maxIterations = config.maxIterations ?? DEFAULT_MAX_ITERATIONS;
    this.tools = tools;
    this.toolMap = new Map(tools.map(t => [t.name, t]));
    this.toolExecutor = new AgentToolExecutor(
      this.toolMap,
      concurrencyMap,
      config.signal,
      config.requestToolApproval,
      config.sessionApprovedTools,
    );
    this.systemPrompt = systemPrompt;
    this.signal = config.signal;
    this.memoryEnabled = config.memoryEnabled ?? true;
    this.messageQueue = config.messageQueue;
  }

  static async create(config: AgentConfig = {}): Promise<Agent> {
    const model = config.model ?? DEFAULT_MODEL;
    // Over the file quota → withhold the document-mutation tool so no new
    // file can be produced this turn. office_read (read-only) stays.
    const tools = config.disableFileGeneration
      ? getTools(model).filter((t) => t.name !== 'office_edit')
      : getTools(model);
    const concurrencyMap = getToolConcurrencyMap(model);
    const soulContent = await loadSoulDocument();
    const rulesContent = await loadRulesDocument();
    let memoryFiles: string[] = [];
    let memoryContext: string | null = null;

    if (config.memoryEnabled !== false) {
      const memoryManager = await MemoryManager.get();
      memoryFiles = await memoryManager.listFiles();
      const session = await memoryManager.loadSessionContext();
      if (session.text.trim()) {
        memoryContext = session.text;
      }
    }

    let systemPrompt = buildSystemPrompt(
      model,
      soulContent,
      config.channel,
      config.groupContext,
      memoryFiles,
      memoryContext,
      rulesContent,
    );
    if (config.disableFileGeneration) {
      systemPrompt +=
        '\n\n## File generation unavailable\n' +
        "The user has reached their monthly document-generation limit on their current plan, so the PowerPoint/Word/Excel generation tool is disabled for this turn. Answer the rest of the request normally. If the user asked you to create or edit a document or file, briefly tell them they've hit their monthly file limit and can upgrade their plan to generate more — do not attempt to produce the file.";
    }
    return new Agent(config, tools, systemPrompt, concurrencyMap);
  }

  /**
   * Read and clear the continuation snapshot captured by `runLoop`.
   * Returns `null` if the most recent run didn't hit the time budget
   * (or never ran at all). The controller calls this *after* the
   * `continuation_required` event has been yielded.
   */
  consumeContinuationSnapshot(): ContinuationSnapshot | null {
    const snap = this.continuationSnapshot;
    this.continuationSnapshot = null;
    return snap;
  }

  /**
   * Run the agent from a fresh query. Builds the initial message array
   * (system prompt + history + user query) and hands off to `runLoop`.
   *
   * `chunkOpts` is supplied by the chunked-agent controller (web only)
   * so the time-budget gate inside `runLoop` is active from chunk 0.
   * CLI calls leave it undefined and the loop runs uninterrupted.
   */
  async *run(
    query: string,
    inMemoryHistory?: InMemoryChatHistory,
    chunkOpts?: { jobId?: string; chunkIndex?: number },
  ): AsyncGenerator<AgentEvent> {
    const startTime = Date.now();

    if (this.tools.length === 0) {
      yield { type: 'done', answer: 'No tools available. Please check your API key configuration.', toolCalls: [], iterations: 0, totalTime: Date.now() - startTime };
      return;
    }

    const ctx = createRunContext(query);
    const memoryFlushState = { alreadyFlushed: false };

    // Build initial message array
    const historyMessages = inMemoryHistory?.getRecentTurnsAsMessages() ?? [];
    const messages: BaseMessage[] = [
      new SystemMessage(this.systemPrompt),
      ...historyMessages,
      new HumanMessage(query),
    ];

    yield* this.runLoop({
      messages,
      ctx,
      memoryFlushState,
      query,
      jobId: chunkOpts?.jobId,
      chunkIndex: chunkOpts?.chunkIndex,
    });
  }

  /**
   * Resume an agent run from a previously-persisted chunk. The caller
   * (the /api/agent/resume route) has already:
   *   - rehydrated `messages` from the job row via deserializeMessages
   *   - re-entered withUser / withMemory / withOfficeRun scopes
   *   - restored touchedFiles into the office-run scope
   *
   * We rebuild a RunContext seeded from the saved counters so F6
   * (requiredNudges), microcompact (lastApiInputTokens), and total-time
   * accounting (originalStartTime) all remain coherent across chunks.
   *
   * Does NOT re-prepend the system prompt or re-fetch history — both
   * are already inside `messages` from the original run.
   */
  async *runContinuation(opts: {
    jobId: string;
    query: string;
    messages: BaseMessage[];
    totalIterations: number;
    requiredNudges: number;
    lastApiInputTokens: number;
    /** When the original (chunk-0) run started, so totalTime stays accurate. */
    originalStartTime: number;
    /** 0-indexed chunk number being served. */
    chunkIndex: number;
  }): AsyncGenerator<AgentEvent> {
    if (this.tools.length === 0) {
      const totalTime = Date.now() - opts.originalStartTime;
      yield { type: 'done', answer: 'No tools available.', toolCalls: [], iterations: opts.totalIterations, totalTime };
      return;
    }

    const ctx = createRunContext(opts.query);
    ctx.startTime = opts.originalStartTime;
    ctx.iteration = opts.totalIterations;
    ctx.requiredNudges = opts.requiredNudges;
    ctx.lastApiInputTokens = opts.lastApiInputTokens;
    const memoryFlushState = { alreadyFlushed: true }; // Memory was flushed on the original run

    yield* this.runLoop({
      messages: [...opts.messages],
      ctx,
      memoryFlushState,
      query: opts.query,
      jobId: opts.jobId,
      chunkIndex: opts.chunkIndex,
    });
  }

  /**
   * Core agent loop. Iterates until one of:
   *   - the LLM emits no tool calls and F6 doesn't nudge → final answer
   *   - tool execution is denied or LLM errors → terminal done
   *   - maxIterations (per-chunk) is reached → done with "max reached" msg
   *   - TOTAL_ITERATION_CAP across chunks is hit → done (runaway guard)
   *   - jobId is set AND elapsed wall-clock > CHUNK_BUDGET_MS → yields
   *     continuation_required and returns (state persisted by caller)
   */
  private async *runLoop(opts: {
    messages: BaseMessage[];
    ctx: ReturnType<typeof createRunContext>;
    memoryFlushState: { alreadyFlushed: boolean };
    query: string;
    /** When set, the loop runs in "chunked" mode and respects CHUNK_BUDGET_MS. */
    jobId?: string;
    chunkIndex?: number;
  }): AsyncGenerator<AgentEvent> {
    const { ctx, memoryFlushState, query, jobId } = opts;
    let messages = opts.messages;
    const chunkStartTime = Date.now();
    const chunkStartIteration = ctx.iteration;

    // Main agent loop
    let overflowRetries = 0;
    while (ctx.iteration < chunkStartIteration + this.maxIterations) {
      // Total-iteration runaway guard — caps cumulative work across
      // all chunks of one job. If hit, we exit with an honest message
      // rather than burning more compute.
      if (jobId && ctx.iteration >= TOTAL_ITERATION_CAP) {
        const totalTime = Date.now() - ctx.startTime;
        yield {
          type: 'done',
          answer: `Reached the total iteration cap (${TOTAL_ITERATION_CAP}) across all chunks of this run. I was unable to complete the task in the allotted steps.`,
          toolCalls: ctx.scratchpad.getToolCallRecords(),
          iterations: ctx.iteration,
          totalTime,
          tokenUsage: ctx.tokenCounter.getUsage(),
          tokensPerSecond: ctx.tokenCounter.getTokensPerSecond(totalTime),
        };
        return;
      }

      // Time-budget gate. Only enforced when we're chunked (jobId set).
      // Checked BEFORE incrementing iteration / starting an LLM call so
      // we always cut between iterations, never mid-tool-call. State at
      // this point is consistent — every tool call from the prior
      // iteration has a paired tool result in `messages`.
      if (jobId && Date.now() - chunkStartTime > CHUNK_BUDGET_MS) {
        // Capture the working state so the controller can persist it
        // after receiving the event. Stored on the instance because
        // events themselves stay lightweight (they pass through the
        // SSE sink to the browser; we don't want to ship 500 KB of
        // messages over the wire).
        this.continuationSnapshot = {
          messages: [...messages],
          iteration: ctx.iteration,
          requiredNudges: ctx.requiredNudges,
          lastApiInputTokens: ctx.lastApiInputTokens,
        };
        yield {
          type: 'continuation_required',
          jobId,
          chunkIndex: opts.chunkIndex ?? 0,
          totalIterations: ctx.iteration,
          chunkDurationMs: Date.now() - chunkStartTime,
        };
        return;
      }

      ctx.iteration++;

      // Microcompact: per-turn lightweight trimming before LLM call
      const mcResult = microcompactMessages(messages);
      if (mcResult.trigger) {
        messages = mcResult.messages;
        yield { type: 'microcompact', cleared: mcResult.cleared, tokensSaved: mcResult.estimatedTokensSaved } as MicrocompactEvent;
      }

      // Strip old reasoning from AIMessages (keep last 2 for continuity)
      this.stripOldThinking(messages, 2);

      let response: AIMessage;
      let usage: TokenUsage | undefined;

      // Call LLM with streaming (falls back to blocking on error)
      while (true) {
        try {
          const result = yield* this.callModelWithStreaming(messages);
          response = result.response;
          usage = result.usage;
          overflowRetries = 0;
          break;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);

          if (isContextOverflowError(errorMessage) && overflowRetries < MAX_OVERFLOW_RETRIES) {
            overflowRetries++;
            const removed = this.truncateMessages(messages, OVERFLOW_KEEP_ROUNDS);
            if (removed > 0) {
              yield { type: 'context_cleared', clearedCount: removed, keptCount: OVERFLOW_KEEP_ROUNDS };
              continue;
            }
          }

          const totalTime = Date.now() - ctx.startTime;
          const provider = resolveProvider(this.model).displayName;
          yield {
            type: 'done',
            answer: `Error: ${formatUserFacingError(errorMessage, provider)}`,
            toolCalls: ctx.scratchpad.getToolCallRecords(),
            iterations: ctx.iteration,
            totalTime,
            tokenUsage: ctx.tokenCounter.getUsage(),
            tokensPerSecond: ctx.tokenCounter.getTokensPerSecond(totalTime),
          };
          return;
        }
      }

      ctx.tokenCounter.add(usage);
      if (usage?.inputTokens) {
        ctx.lastApiInputTokens = usage.inputTokens;
      }

      const responseText = extractTextContent(response);

      // Emit thinking if there are also tool calls
      if (responseText?.trim() && hasToolCalls(response)) {
        const trimmedText = responseText.trim();
        ctx.scratchpad.addThinking(trimmedText);
        yield { type: 'thinking', message: trimmedText };
      }

      // No tool calls = final answer — unless the agent edited a file
      // but never produced a download URL. That's the canonical case:
      // office_edit create succeeded but slides were never added, or
      // the agent renamed sheets without inserting data. Either way the
      // chat UI has no chip to render and the agent's confident "file
      // is ready" reply would be a lie. Nudge until either a delivery
      // URL appears or the cap is hit.
      if (!hasToolCalls(response)) {
        if (
          ctx.requiredNudges < MAX_REQUIRED_NUDGES &&
          needsContinuation(messages)
        ) {
          ctx.requiredNudges++;
          messages.push(response);
          messages.push(new HumanMessage(buildNudgePrompt(ctx.requiredNudges)));
          continue;
        }
        yield* this.handleDirectResponse(responseText ?? '', ctx);
        return;
      }

      // Push AIMessage to conversation history
      messages.push(response);

      // Execute tools concurrently where safe, collect ToolMessages by ID
      let { toolMessages, denied } = yield* this.executeToolsAndCollectMessages(response, ctx);

      // Cap large results (persist to disk, inject preview)
      toolMessages = toolMessages.map(tm => {
        const content = typeof tm.content === 'string' ? tm.content : JSON.stringify(tm.content);
        if (exceedsSizeCap(content)) {
          const { preview, filePath } = persistLargeResult(tm.name ?? 'unknown', tm.tool_call_id, content);
          return new ToolMessage({
            content: buildPersistedContent(filePath, preview, content.length),
            tool_call_id: tm.tool_call_id,
            name: tm.name,
          });
        }
        return tm;
      });

      // Enforce per-turn total budget
      toolMessages = enforceResultBudget(toolMessages);

      messages.push(...toolMessages);

      if (denied) {
        const totalTime = Date.now() - ctx.startTime;
        yield {
          type: 'done',
          answer: '',
          toolCalls: ctx.scratchpad.getToolCallRecords(),
          iterations: ctx.iteration,
          totalTime,
          tokenUsage: ctx.tokenCounter.getUsage(),
          tokensPerSecond: ctx.tokenCounter.getTokensPerSecond(totalTime),
        };
        return;
      }

      // Context threshold management (may compact the message array)
      const messageState = { messages };
      yield* this.manageContextThreshold(ctx, query, memoryFlushState, messageState);
      messages = messageState.messages;

      // Inject tool usage warning if approaching limits
      const toolUsageWarning = ctx.scratchpad.formatToolUsageForPrompt();
      if (toolUsageWarning) {
        messages.push(new HumanMessage(toolUsageWarning));
      }

      // Drain queued messages: user may have sent follow-ups while agent was working
      const drainResult = this.drainQueue();
      if (drainResult) {
        messages.push(new HumanMessage(drainResult.text));
        yield { type: 'queue_drain', messageCount: drainResult.count, mergedText: drainResult.text } as QueueDrainEvent;
      }
    }

    // Max iterations reached
    const totalTime = Date.now() - ctx.startTime;
    yield {
      type: 'done',
      answer: `Reached maximum iterations (${this.maxIterations}). I was unable to complete the research in the allotted steps.`,
      toolCalls: ctx.scratchpad.getToolCallRecords(),
      iterations: ctx.iteration,
      totalTime,
      tokenUsage: ctx.tokenCounter.getUsage(),
      tokensPerSecond: ctx.tokenCounter.getTokensPerSecond(totalTime),
    };
  }

  // ---------------------------------------------------------------------------
  // LLM call methods
  // ---------------------------------------------------------------------------

  /**
   * Call LLM with streaming, falling back to blocking invoke on error.
   * Yields StreamProgressEvents as chunks arrive; returns the final accumulated message.
   */
  private async *callModelWithStreaming(
    messages: BaseMessage[],
  ): AsyncGenerator<StreamProgressEvent, { response: AIMessage; usage?: TokenUsage }> {
    try {
      return yield* this.streamAndAccumulate(messages);
    } catch {
      // Fallback to blocking invoke (handles providers without streaming support)
      return await this.callModelWithMessages(messages);
    }
  }

  /**
   * Stream the LLM response, yielding per-chunk progress events and finally
   * returning the accumulated AIMessage. Stream-mode lifecycle:
   * 'requesting' before the first chunk, then 'thinking'/'responding'/'tool-input'
   * derived from chunk content shape, then 'tool-use' after stream end if there
   * are tool calls awaiting execution.
   */
  private async *streamAndAccumulate(
    messages: BaseMessage[],
  ): AsyncGenerator<StreamProgressEvent, { response: AIMessage; usage?: TokenUsage }> {
    yield { type: 'stream_progress', charDelta: 0, mode: 'requesting' };

    let accumulated: AIMessageChunk | null = null;

    for await (const chunk of streamLlmWithMessages(messages, {
      model: this.model,
      tools: this.tools,
      signal: this.signal,
    })) {
      accumulated = accumulated ? accumulated.concat(chunk) : chunk;
      const { charDelta, mode } = inspectChunkContent(chunk);
      if (charDelta > 0 || mode !== 'responding') {
        yield { type: 'stream_progress', charDelta, mode };
      }
    }

    if (!accumulated) {
      throw new Error('Stream produced no chunks');
    }

    const response = new AIMessage({
      content: accumulated.content,
      tool_calls: accumulated.tool_calls,
      invalid_tool_calls: accumulated.invalid_tool_calls,
      usage_metadata: accumulated.usage_metadata,
      response_metadata: accumulated.response_metadata,
    });

    if (response.tool_calls && response.tool_calls.length > 0) {
      yield { type: 'stream_progress', charDelta: 0, mode: 'tool-use' };
    }

    const usage = accumulated.usage_metadata
      ? {
          inputTokens: accumulated.usage_metadata.input_tokens ?? 0,
          outputTokens: accumulated.usage_metadata.output_tokens ?? 0,
          totalTokens: accumulated.usage_metadata.total_tokens ?? 0,
        }
      : undefined;

    return { response, usage };
  }

  /**
   * Blocking LLM call (fallback when streaming fails).
   */
  private async callModelWithMessages(
    messages: BaseMessage[],
  ): Promise<{ response: AIMessage; usage?: TokenUsage }> {
    const result = await callLlmWithMessages(messages, {
      model: this.model,
      tools: this.tools,
      signal: this.signal,
    });
    return { response: result.response as AIMessage, usage: result.usage };
  }

  // ---------------------------------------------------------------------------
  // Tool execution
  // ---------------------------------------------------------------------------

  /**
   * Execute tools and collect ToolMessages mapped by tool_call_id.
   * Supports concurrent execution — events may arrive out of order.
   */
  private async *executeToolsAndCollectMessages(
    response: AIMessage,
    ctx: RunContext,
  ): AsyncGenerator<AgentEvent, { toolMessages: ToolMessage[]; denied: boolean }> {
    const toolMessageMap = new Map<string, ToolMessage>();
    let denied = false;
    const toolCalls = response.tool_calls!;

    for await (const event of this.toolExecutor.executeAll(response, ctx)) {
      yield event;

      if (event.type === 'tool_end' && event.toolCallId) {
        toolMessageMap.set(event.toolCallId, new ToolMessage({
          content: event.result,
          tool_call_id: event.toolCallId,
          name: event.tool,
        }));
      } else if (event.type === 'tool_error' && event.toolCallId) {
        toolMessageMap.set(event.toolCallId, new ToolMessage({
          content: `Error: ${event.error}`,
          tool_call_id: event.toolCallId,
          name: event.tool,
        }));
      } else if (event.type === 'tool_denied' && event.toolCallId) {
        toolMessageMap.set(event.toolCallId, new ToolMessage({
          content: 'Tool execution denied by user.',
          tool_call_id: event.toolCallId,
          name: event.tool,
        }));
        denied = true;
      }
    }

    // Produce ToolMessages in ORIGINAL tool_calls order
    const toolMessages: ToolMessage[] = toolCalls.map(tc =>
      toolMessageMap.get(tc.id!) ?? new ToolMessage({
        content: 'Skipped (already executed).',
        tool_call_id: tc.id!,
        name: tc.name,
      }),
    );

    return { toolMessages, denied };
  }

  // ---------------------------------------------------------------------------
  // Message queue
  // ---------------------------------------------------------------------------

  /**
   * Drain all queued messages, merge into a single text block.
   * Returns null if the queue is empty or not configured.
   */
  private drainQueue(): { text: string; count: number } | null {
    if (!this.messageQueue || this.messageQueue.isEmpty()) {
      return null;
    }
    const messages = this.messageQueue.dequeueAll();
    if (messages.length === 0) return null;
    return {
      text: messages.map(m => m.text).join('\n\n'),
      count: messages.length,
    };
  }

  // ---------------------------------------------------------------------------
  // Response handling
  // ---------------------------------------------------------------------------

  private async *handleDirectResponse(
    responseText: string,
    ctx: RunContext,
  ): AsyncGenerator<AgentEvent, void> {
    const totalTime = Date.now() - ctx.startTime;
    yield {
      type: 'done',
      answer: responseText,
      toolCalls: ctx.scratchpad.getToolCallRecords(),
      iterations: ctx.iteration,
      totalTime,
      tokenUsage: ctx.tokenCounter.getUsage(),
      tokensPerSecond: ctx.tokenCounter.getTokensPerSecond(totalTime),
    };
  }

  // ---------------------------------------------------------------------------
  // Message array management
  // ---------------------------------------------------------------------------

  /**
   * Remove oldest AI+Tool message rounds, keeping SystemMessage, history,
   * HumanMessage, and the most recent N rounds.
   */
  /**
   * Strip text content from old AIMessages, keeping only the most recent N.
   * Preserves tool_calls structure (required for ToolMessage pairing).
   */
  private stripOldThinking(messages: BaseMessage[], keepLast: number): void {
    // Collect indices of AIMessages with text content
    const aiIndices: number[] = [];
    for (let i = 0; i < messages.length; i++) {
      if (messages[i] instanceof AIMessage) {
        aiIndices.push(i);
      }
    }

    // Only strip if we have more than keepLast AIMessages
    const toStrip = aiIndices.slice(0, -keepLast);
    for (const idx of toStrip) {
      const msg = messages[idx] as AIMessage;
      // Only strip if it has tool_calls (reasoning before tools — safe to clear)
      if (msg.tool_calls && msg.tool_calls.length > 0 && msg.content) {
        messages[idx] = new AIMessage({
          content: '',
          tool_calls: msg.tool_calls,
          invalid_tool_calls: msg.invalid_tool_calls,
          usage_metadata: msg.usage_metadata,
          response_metadata: msg.response_metadata,
        });
      }
    }
  }

  private truncateMessages(messages: BaseMessage[], keepRounds: number): number {
    let roundStartIndex = 0;
    for (let i = 0; i < messages.length; i++) {
      if (messages[i] instanceof AIMessage) {
        roundStartIndex = i;
        break;
      }
    }
    if (roundStartIndex === 0) return 0;

    const rounds: { start: number; end: number }[] = [];
    let i = roundStartIndex;
    while (i < messages.length) {
      if (messages[i] instanceof AIMessage) {
        const start = i;
        i++;
        while (i < messages.length && (messages[i] instanceof ToolMessage || messages[i] instanceof HumanMessage)) {
          i++;
        }
        rounds.push({ start, end: i });
      } else {
        i++;
      }
    }

    const roundsToRemove = Math.max(0, rounds.length - keepRounds);
    if (roundsToRemove === 0) return 0;

    const removeEnd = rounds[roundsToRemove - 1].end;
    const removed = removeEnd - roundStartIndex;
    messages.splice(roundStartIndex, removed);
    return removed;
  }

  /**
   * Replace message array with compacted version after LLM summarization.
   */
  private compactMessages(messages: BaseMessage[], summary: string, query: string): BaseMessage[] {
    return [
      messages[0], // SystemMessage
      new HumanMessage(`${query}\n\n${summary}`),
    ];
  }

  // ---------------------------------------------------------------------------
  // Context threshold management
  // ---------------------------------------------------------------------------

  private async *manageContextThreshold(
    ctx: RunContext,
    query: string,
    memoryFlushState: { alreadyFlushed: boolean },
    messageState: { messages: BaseMessage[] },
  ): AsyncGenerator<ContextClearedEvent | CompactionEvent | AgentEvent, void> {
    const estimatedContextTokens = ctx.lastApiInputTokens > 0
      ? ctx.lastApiInputTokens
      : estimateTokens(messageState.messages.map(m =>
          typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
        ).join('\n'));
    const threshold = getAutoCompactThreshold(this.model);

    if (estimatedContextTokens <= threshold) {
      return;
    }

    // Step 1: Memory flush
    const fullToolResults = ctx.scratchpad.getToolResults();
    if (
      this.memoryEnabled &&
      shouldRunMemoryFlush({
        estimatedContextTokens,
        threshold,
        alreadyFlushed: memoryFlushState.alreadyFlushed,
      })
    ) {
      yield { type: 'memory_flush', phase: 'start' };
      const flushResult = await runMemoryFlush({
        model: this.model,
        systemPrompt: this.systemPrompt,
        query,
        toolResults: fullToolResults,
        signal: this.signal,
      }).catch(() => ({ flushed: false, written: false as const }));
      memoryFlushState.alreadyFlushed = flushResult.flushed;
      yield {
        type: 'memory_flush',
        phase: 'end',
        filesWritten: flushResult.written ? [`${new Date().toISOString().slice(0, 10)}.md`] : [],
      };
    }

    // Step 2: Compaction
    if (
      this.compactionFailures < MAX_CONSECUTIVE_COMPACTION_FAILURES &&
      ctx.scratchpad.getActiveToolResultCount() >= MIN_TOOL_RESULTS_FOR_COMPACTION
    ) {
      yield { type: 'compaction', phase: 'start', preCompactTokens: estimatedContextTokens };

      try {
        const result = await compactContext({
          model: this.model,
          systemPrompt: this.systemPrompt,
          query,
          toolResults: fullToolResults,
          signal: this.signal,
        });

        messageState.messages = this.compactMessages(messageState.messages, result.summary, query);
        ctx.scratchpad.setCompactionSummary(result.summary);

        if (result.usage) {
          ctx.tokenCounter.add(result.usage);
        }

        this.compactionFailures = 0;
        memoryFlushState.alreadyFlushed = false;

        const postCompactTokens = estimateTokens(
          messageState.messages.map(m =>
            typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
          ).join('\n'),
        );

        yield {
          type: 'compaction',
          phase: 'end',
          success: true,
          preCompactTokens: estimatedContextTokens,
          postCompactTokens,
          compactionModel: resolveProvider(this.model).fastModel ?? this.model,
        };

        return;
      } catch {
        this.compactionFailures++;
        yield {
          type: 'compaction',
          phase: 'end',
          success: false,
          preCompactTokens: estimatedContextTokens,
        };
      }
    }

    // Step 3: Fallback — truncate oldest rounds
    const removed = this.truncateMessages(messageState.messages, KEEP_TOOL_USES);
    if (removed > 0) {
      memoryFlushState.alreadyFlushed = false;
      yield { type: 'context_cleared', clearedCount: removed, keptCount: KEEP_TOOL_USES };
    }
  }
}

const MODE_PRIORITY: Record<StreamMode, number> = {
  requesting: 0,
  responding: 1,
  thinking: 2,
  'tool-input': 3,
  'tool-use': 4,
};

/**
 * Walk one streaming chunk's content and report total char-delta plus the most
 * "advanced" mode the chunk contains. LangChain content can be a plain string
 * (most providers) or an array of typed parts (Anthropic).
 */
function inspectChunkContent(chunk: AIMessageChunk): { charDelta: number; mode: StreamMode } {
  const content = chunk.content;
  if (typeof content === 'string') {
    return { charDelta: content.length, mode: 'responding' };
  }
  if (!Array.isArray(content)) {
    return { charDelta: 0, mode: 'responding' };
  }

  let charDelta = 0;
  let mode: StreamMode = 'responding';
  for (const part of content) {
    if (!part || typeof part !== 'object') continue;
    const partType = (part as { type?: string }).type;
    if (partType === 'text') {
      const text = (part as { text?: string }).text;
      if (typeof text === 'string') charDelta += text.length;
      if (MODE_PRIORITY.responding > MODE_PRIORITY[mode]) mode = 'responding';
    } else if (partType === 'thinking' || partType === 'redacted_thinking') {
      const thinkingText = (part as { thinking?: string }).thinking;
      if (typeof thinkingText === 'string') charDelta += thinkingText.length;
      if (MODE_PRIORITY.thinking > MODE_PRIORITY[mode]) mode = 'thinking';
    } else if (partType === 'tool_use' || partType === 'input_json_delta') {
      const partialJson = (part as { input?: unknown; partial_json?: string }).partial_json;
      if (typeof partialJson === 'string') charDelta += partialJson.length;
      if (MODE_PRIORITY['tool-input'] > MODE_PRIORITY[mode]) mode = 'tool-input';
    }
  }
  return { charDelta, mode };
}
