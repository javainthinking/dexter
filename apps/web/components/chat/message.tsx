'use client';

import * as React from 'react';
import { Markdown } from './markdown';
import { ToolCard, type ToolCardEvent } from './tool-card';
import { Logo } from '../logo';
import { useDictionary } from '../i18n/dictionary-provider';
import { cn } from '../../lib/utils';
import { Badge } from '../ui/badge';

export interface ChatTurn {
  id: string;
  question: string;
  answer: string;
  status: 'streaming' | 'done' | 'error' | 'interrupted';
  statusLabel?: string;        // e.g. 'planning', 'calling tool', 'writing answer'
  tools: ToolCardEvent[];
  errorMessage?: string;
}

export function UserMessage({ text }: { text: string }) {
  const dict = useDictionary();
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {dict.chat.message.you}
      </div>
      <div className="prose-dexter flex-1 pt-1 text-foreground">
        <p className="whitespace-pre-wrap">{text}</p>
      </div>
    </div>
  );
}

export function AssistantMessage({ turn }: { turn: ChatTurn }) {
  const dict = useDictionary();
  const showAnswer = turn.answer.length > 0;
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 shrink-0">
        <Logo showWord={false} size="sm" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 pb-1">
          <span className="font-serif text-sm font-semibold text-foreground">
            {dict.chat.message.dexter}
          </span>
          {turn.status === 'streaming' && (
            <Badge variant="info" size="sm">
              <span className="size-1.5 rounded-full bg-[color:var(--info)] animate-pulse-soft" />
              {turn.statusLabel ?? dict.chat.message.status.thinking}
            </Badge>
          )}
          {turn.status === 'interrupted' && (
            <Badge variant="warning" size="sm">
              {dict.chat.message.status.stopped}
            </Badge>
          )}
          {turn.status === 'error' && (
            <Badge variant="negative" size="sm">
              {dict.chat.message.status.error}
            </Badge>
          )}
        </div>

        {turn.tools.length > 0 && (
          <div className="mb-3 space-y-2">
            {turn.tools.map((t) => (
              <ToolCard key={t.id} event={t} />
            ))}
          </div>
        )}

        {showAnswer && (
          <div
            className={cn(
              'prose-dexter',
              turn.status === 'streaming' && 'caret',
            )}
          >
            <Markdown>{turn.answer}</Markdown>
          </div>
        )}

        {!showAnswer && turn.status === 'streaming' && turn.tools.length === 0 && (
          <div className="flex items-center gap-2 pt-1 text-sm text-muted-foreground">
            <span className="inline-flex gap-1">
              <span className="size-1 rounded-full bg-foreground animate-pulse-soft" />
              <span className="size-1 rounded-full bg-foreground animate-pulse-soft [animation-delay:120ms]" />
              <span className="size-1 rounded-full bg-foreground animate-pulse-soft [animation-delay:240ms]" />
            </span>
            <span>{turn.statusLabel ?? dict.chat.message.status.thinking}</span>
          </div>
        )}

        {turn.status === 'error' && turn.errorMessage && (
          <div className="mt-2 rounded-md border border-[color:var(--negative)]/40 bg-[color:var(--negative)]/8 p-3 text-sm">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--negative)]">
              {dict.chat.message.errorTitle}
            </p>
            <p className="mt-1 text-foreground">{turn.errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
