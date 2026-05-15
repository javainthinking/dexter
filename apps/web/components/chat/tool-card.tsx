'use client';

import * as React from 'react';
import { ChevronRight, Loader2, Check, AlertTriangle } from 'lucide-react';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';

export type ToolStatus = 'running' | 'done' | 'error';

export interface ToolCardEvent {
  id: string;
  tool: string;
  status: ToolStatus;
  args?: Record<string, unknown>;
  result?: string;
  errorMessage?: string;
  progressMessage?: string;
  durationMs?: number;
}

export function ToolCard({ event }: { event: ToolCardEvent }) {
  const [open, setOpen] = React.useState(false);
  const StatusIcon = event.status === 'running' ? Loader2 : event.status === 'error' ? AlertTriangle : Check;

  return (
    <div
      className={cn(
        'rounded-lg border bg-card text-sm transition-colors',
        event.status === 'error'
          ? 'border-[color:var(--negative)]/40'
          : 'border-border hover:border-border-strong',
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 rounded-lg p-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-expanded={open}
      >
        <span
          className={cn(
            'inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-border',
            event.status === 'running' && 'bg-muted text-[color:var(--info)]',
            event.status === 'done' && 'bg-[color:var(--positive)]/12 text-[color:var(--positive)]',
            event.status === 'error' && 'bg-[color:var(--negative)]/12 text-[color:var(--negative)]',
          )}
        >
          <StatusIcon className={cn('size-3.5', event.status === 'running' && 'animate-spin')} />
        </span>

        <span className="flex-1 min-w-0">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-mono text-xs tracking-tight text-foreground">
              {event.tool}
            </span>
            {event.status === 'running' && (
              <Badge variant="info" size="sm">
                running
              </Badge>
            )}
            {event.status === 'done' && typeof event.durationMs === 'number' && (
              <span className="font-mono text-[10px] tabular-nums text-subtle">
                {formatDuration(event.durationMs)}
              </span>
            )}
            {event.status === 'error' && (
              <Badge variant="negative" size="sm">
                error
              </Badge>
            )}
          </span>
          {event.progressMessage && event.status === 'running' && (
            <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
              {event.progressMessage}
            </span>
          )}
        </span>

        <ChevronRight
          className={cn(
            'size-4 shrink-0 text-subtle transition-transform',
            open && 'rotate-90 text-foreground',
          )}
        />
      </button>

      {open && (
        <div className="space-y-3 border-t border-border bg-muted/40 p-3">
          {event.args && Object.keys(event.args).length > 0 && (
            <CodeBlock title="arguments" content={JSON.stringify(event.args, null, 2)} />
          )}
          {event.result && (
            <CodeBlock title="result" content={event.result} maxLines={20} />
          )}
          {event.errorMessage && (
            <CodeBlock title="error" content={event.errorMessage} tone="negative" />
          )}
        </div>
      )}
    </div>
  );
}

function CodeBlock({
  title,
  content,
  maxLines,
  tone,
}: {
  title: string;
  content: string;
  maxLines?: number;
  tone?: 'negative';
}) {
  const lines = content.split('\n');
  const truncated = maxLines && lines.length > maxLines;
  const display = truncated ? lines.slice(0, maxLines).join('\n') + '\n…' : content;
  return (
    <div>
      <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">{title}</p>
      <pre
        className={cn(
          'overflow-x-auto rounded-md border border-border bg-background/60 p-2.5',
          'font-mono text-[11.5px] leading-relaxed',
          tone === 'negative' && 'text-[color:var(--negative)]',
        )}
      >
        {display}
      </pre>
    </div>
  );
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}
