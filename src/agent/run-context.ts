import { Scratchpad } from './scratchpad.js';
import { TokenCounter } from './token-counter.js';

/**
 * Mutable state for a single agent run.
 */
export interface RunContext {
  readonly query: string;
  readonly scratchpad: Scratchpad;
  readonly tokenCounter: TokenCounter;
  readonly startTime: number;
  iteration: number;
  /**
   * Input token count from the most recent API response.
   * This is the actual context size reported by the API — far more accurate
   * than character-based estimation. Used by manageContextThreshold() to
   * anchor token estimates on real data.
   */
  lastApiInputTokens: number;
  /**
   * Number of times the agent loop has refused to exit because the most
   * recent tool result still carried a `_required` directive. Capped at
   * MAX_REQUIRED_NUDGES (currently 2) so a genuinely-done workflow
   * can't loop forever if the model insists on stopping. See
   * `agent.ts` for the enforcement.
   */
  requiredNudges: number;
}

export function createRunContext(query: string): RunContext {
  return {
    query,
    scratchpad: new Scratchpad(query),
    tokenCounter: new TokenCounter(),
    startTime: Date.now(),
    iteration: 0,
    lastApiInputTokens: 0,
    requiredNudges: 0,
  };
}
