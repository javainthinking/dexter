/**
 * Inline indicator cards for the web chat.
 *
 * After a turn's answer is written, the fast model reads the question and
 * the answer and names the listed stocks (US / Hong Kong / China A-shares)
 * the turn is about. They are appended to the answer as an ```indicators
 * fenced block, which apps/web/components/chat/answer-body.tsx renders as
 * live indicator cards linking to each ticker's /stocks page.
 *
 * This runs as a separate step rather than as an instruction to the main
 * model because the main model drops the block unpredictably (for example
 * when the user asks for a short answer). Everything here is best-effort:
 * any failure or timeout returns the answer unchanged.
 */

import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { callLlmWithMessages, getFastModel } from '../model/llm.js';
import { resolveProvider } from '../providers.js';

const MAX_CARDS = 3;
const TIMEOUT_MS = 10_000;
const MAX_ANSWER_CHARS = 6_000;

/** Yahoo tickers the /stocks pages support: US, HK, Shanghai, Shenzhen. */
const SUPPORTED_TICKER = /^(?:[A-Z]{1,5}(?:-[A-Z])?|\d{4,5}\.HK|\d{6}\.(?:SS|SZ))$/;

const SYSTEM_PROMPT = `You pick stocks for UI cards in a finance chat. Reply with ONLY a JSON object: {"tickers": [...]}. No prose, no code fences.`;

function buildPrompt(query: string, answer: string): string {
  return `Question:
${query}

Answer:
${answer.slice(0, MAX_ANSWER_CHARS)}

List the specific listed stocks this exchange is about — US, Hong Kong or China A-shares — most relevant first, at most ${MAX_CARDS}, as Yahoo Finance tickers:
- US: AAPL, BRK-B   - Hong Kong: 0700.HK   - Shanghai: 600519.SS   - Shenzhen: 300750.SZ
Exclude indices, ETFs, funds, crypto, FX, and companies mentioned only in passing.
If there are none, reply {"tickers": []}.`;
}

/** Parse and validate the model's reply into at most MAX_CARDS supported tickers. */
export function parseTickerReply(reply: string): string[] {
  const match = reply.match(/\{[\s\S]*\}/);
  if (!match) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(match[0]);
  } catch {
    return [];
  }
  const raw = (parsed as { tickers?: unknown })?.tickers;
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const t of raw) {
    if (typeof t !== 'string') continue;
    const ticker = t.trim().toUpperCase().replace(/\.B$/, '-B');
    if (SUPPORTED_TICKER.test(ticker) && !out.includes(ticker)) out.push(ticker);
    if (out.length === MAX_CARDS) break;
  }
  return out;
}

export function hasIndicatorBlock(answer: string): boolean {
  return /```[ \t]*indicators/i.test(answer);
}

export function appendIndicatorBlock(answer: string, tickers: string[]): string {
  if (tickers.length === 0) return answer;
  return `${answer.trimEnd()}\n\n\`\`\`indicators\n${tickers.join('\n')}\n\`\`\`\n`;
}

/**
 * The listed stocks (at most MAX_CARDS) a question/answer pair is about,
 * picked by the fast model. Best-effort: [] on any failure or timeout.
 */
export async function pickIndicatorTickers(query: string, answer: string, model: string): Promise<string[]> {
  if (!answer.trim() || answer.startsWith('Error:')) return [];
  try {
    const fastModel = getFastModel(resolveProvider(model).id, model);
    // Messages, not callLlm: callLlm runs the prompt through a template,
    // which would read the JSON braces as template variables.
    const { response } = await callLlmWithMessages(
      [new SystemMessage(SYSTEM_PROMPT), new HumanMessage(buildPrompt(query, answer))],
      { model: fastModel, signal: AbortSignal.timeout(TIMEOUT_MS) },
    );
    const content = typeof response === 'string' ? response : response.content;
    const text = typeof content === 'string' ? content : JSON.stringify(content ?? '');
    return parseTickerReply(text);
  } catch {
    return [];
  }
}

/**
 * Return `answer` with an ```indicators block appended when the turn is
 * about specific stocks; otherwise (or on any failure) return it as-is.
 */
export async function withIndicatorCards(query: string, answer: string, model: string): Promise<string> {
  if (hasIndicatorBlock(answer)) return answer;
  return appendIndicatorBlock(answer, await pickIndicatorTickers(query, answer, model));
}
