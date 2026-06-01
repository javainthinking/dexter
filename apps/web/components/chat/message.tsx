'use client';

import * as React from 'react';
import { useSession } from 'next-auth/react';
import { Download } from 'lucide-react';
import { Markdown } from './markdown';
import { ToolCard, type ToolCardEvent } from './tool-card';
import { Logo } from '../logo';
import { useDictionary, format } from '../i18n/dictionary-provider';
import { cn } from '../../lib/utils';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export interface TurnDeliverable {
  filename: string;
  downloadUrl: string;
  expiresAt: string;
  byteLength: number;
  key: string;
}

export interface ChatTurn {
  id: string;
  question: string;
  answer: string;
  status: 'streaming' | 'done' | 'error' | 'interrupted';
  statusLabel?: string;        // e.g. 'planning', 'calling tool', 'writing answer'
  tools: ToolCardEvent[];
  errorMessage?: string;
  /**
   * Files produced by the agent in this turn, populated from the
   * `deliverables` field on the agent's done event. Each item is a
   * presigned download URL the chat renders as a download chip.
   * Optional because legacy turns hydrated from the database have no
   * deliverables.
   */
  deliverables?: TurnDeliverable[];
  /**
   * Set when the agent couldn't generate a requested file because the user
   * is over their monthly file quota. Renders an inline upgrade card under
   * the answer (a persistent, clickable prompt — more reliable than a
   * transient modal).
   */
  fileLimit?: { plan?: string; limit?: number };
}

export function UserMessage({ text }: { text: string }) {
  const dict = useDictionary();
  const { data } = useSession();
  const user = data?.user as { name?: string | null; email?: string | null; image?: string | null } | undefined;

  return (
    <div className="flex items-start gap-3">
      <UserAvatar
        image={user?.image ?? null}
        fallback={initialsFor(user) ?? dict.chat.message.you}
      />
      <div className="prose-dexter flex-1 pt-1 text-foreground">
        <p className="whitespace-pre-wrap">{text}</p>
      </div>
    </div>
  );
}

function UserAvatar({ image, fallback }: { image: string | null; fallback: string }) {
  // Track image-load failures so we always show the fallback if the
  // provider URL 403s, expires, or the user is offline.
  const [failed, setFailed] = React.useState(false);
  if (image && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt=""
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="mt-0.5 size-7 shrink-0 rounded-md border border-border object-cover"
      />
    );
  }
  return (
    <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
      {fallback}
    </div>
  );
}

function TurnDeliveries({ turn }: { turn: ChatTurn }) {
  const dict = useDictionary();
  const deliveries = turn.deliverables ?? [];
  if (deliveries.length === 0) return null;
  return (
    <div className="mb-3 rounded-lg border border-border bg-card p-3">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">
        {dict.chat.delivery.title}
      </p>
      <ul className="space-y-1.5">
        {deliveries.map((d) => (
          // R2 object keys include a timestamp + per-call random
          // component, so they're guaranteed unique across siblings
          // even when two deliverables share a basename. Using
          // filename as the key produced duplicate-key warnings when
          // path-normalisation in the touch set was incomplete.
          <li key={d.key || d.downloadUrl}>
            <a
              href={d.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={d.filename}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background/60 px-2.5 py-1.5 text-xs text-foreground hover:border-border-strong hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Download className="size-3.5 text-muted-foreground" />
              <span className="truncate font-mono">{d.filename}</span>
              {d.byteLength > 0 && (
                <span className="font-mono text-[10px] text-subtle">
                  {format(dict.chat.delivery.sizeKb, {
                    kb: Math.max(1, Math.round(d.byteLength / 1024)),
                  })}
                </span>
              )}
              <span className="ml-1 font-mono text-[10px] text-subtle">
                {dict.chat.delivery.download}
              </span>
            </a>
            {d.expiresAt && (
              <span className="ml-2 font-mono text-[10px] text-subtle">
                {format(dict.chat.delivery.expiresAt, {
                  date: new Date(d.expiresAt).toLocaleDateString(),
                })}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function initialsFor(user: { name?: string | null; email?: string | null } | undefined): string | null {
  const raw = user?.name?.trim() || user?.email?.split('@')[0];
  if (!raw) return null;
  return raw
    .split(/\s+/)
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function AssistantMessage({
  turn,
  onUpgrade,
}: {
  turn: ChatTurn;
  onUpgrade?: (fl: { plan?: string; limit?: number }) => void;
}) {
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
          {/* Terminal-state badges stay in the header (one-shot signals
              that the turn ended in a non-success state). The streaming
              progress indicator moves to the bottom of the message,
              under the latest content. */}
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

        <TurnDeliveries turn={turn} />

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

        {/* File-quota upgrade card — the agent couldn't produce the file.
            Persistent + clickable (opens the upgrade dialog). */}
        {turn.fileLimit && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[color:var(--accent)]/40 bg-[color:var(--accent)]/10 px-4 py-3">
            <span className="text-sm text-foreground">
              {format(dict.upgrade.reasons.files, { limit: turn.fileLimit.limit ?? '' })}
            </span>
            <Button size="sm" onClick={() => onUpgrade?.(turn.fileLimit!)}>
              {dict.account.upgrade}
            </Button>
          </div>
        )}

        {/*
          Streaming progress lives at the bottom of the message, under
          whatever was most recently rendered (tool cards, deliveries,
          or the partial answer). Showing it here instead of in the
          header keeps the user's eye anchored where the latest update
          will appear, so a long-running turn still feels alive without
          having to scroll back up to read a stale status badge.
        */}
        {turn.status === 'streaming' && (
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
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
