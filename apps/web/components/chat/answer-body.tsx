'use client';

import * as React from 'react';
import { Markdown } from './markdown';
import { IndicatorCards, parseIndicatorTickers } from './indicator-cards';

/**
 * Assistant answer renderer: Markdown, plus inline indicator cards
 * wherever the answer contains an ```indicators fenced block (the agent
 * is told to emit one for answers about specific stocks — see
 * src/agent/prompts.ts). The block lives in the answer text itself, so
 * cards come back when a stored conversation is reopened.
 */

type Segment = { kind: 'md'; text: string } | { kind: 'cards'; tickers: string[] };

const BLOCK = /```[ \t]*indicators[^\n]*\n([\s\S]*?)```/gi;

export function splitIndicatorBlocks(answer: string): Segment[] {
  // An unclosed block (answer cut off mid-way) is dropped rather than
  // shown as a raw code fence.
  const text = answer.replace(/```[ \t]*indicators[^\n]*\n(?![\s\S]*```)[\s\S]*$/i, '');
  const out: Segment[] = [];
  let last = 0;
  for (const m of text.matchAll(BLOCK)) {
    const before = text.slice(last, m.index);
    if (before.trim()) out.push({ kind: 'md', text: before });
    const tickers = parseIndicatorTickers(m[1] ?? '');
    if (tickers.length) out.push({ kind: 'cards', tickers });
    last = (m.index ?? 0) + m[0].length;
  }
  const rest = text.slice(last);
  if (rest.trim()) out.push({ kind: 'md', text: rest });
  return out;
}

export function AnswerBody({ answer }: { answer: string }) {
  const segments = React.useMemo(() => splitIndicatorBlocks(answer), [answer]);
  return (
    <>
      {segments.map((s, i) =>
        s.kind === 'md' ? (
          <Markdown key={i}>{s.text}</Markdown>
        ) : (
          <IndicatorCards key={i} tickers={s.tickers} />
        ),
      )}
    </>
  );
}
