'use client';

import * as React from 'react';
import { Plus, MessageSquare, History, X, Trash2, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Logo } from '../logo';
import { ThemeToggle } from '../theme-toggle';
import { LocalizedLink } from '../i18n/localized-link';
import { useDictionary } from '../i18n/dictionary-provider';
import { UserMenu } from '../auth/user-menu';
import { cn } from '../../lib/utils';

export interface SessionSummary {
  sessionId: string;
  title: string;
  preview: string;
  turnCount: number;
  updatedAt: number;
  isCurrent: boolean;
}

interface SidebarProps {
  sessions: SessionSummary[];
  loading: boolean;
  onNew: () => void;
  onSwitch: (sessionId: string) => void;
  onDelete: (sessionId: string) => void;
  onClose?: () => void;
}

export function Sidebar({
  sessions,
  loading,
  onNew,
  onSwitch,
  onDelete,
  onClose,
}: SidebarProps) {
  const dict = useDictionary();
  // Which session id is currently in "confirm delete" mode. Inline confirm
  // is gentler than a full dialog and matches the design's minimalism —
  // pattern used by Linear, Notion, Vercel dashboards.
  const [confirmingId, setConfirmingId] = React.useState<string | null>(null);
  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-border bg-background">
      <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border px-4">
        <LocalizedLink
          href="/"
          className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Logo />
        </LocalizedLink>
        {onClose && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label={dict.chat.sidebar.close}
          >
            <X className="size-4" />
          </Button>
        )}
      </div>

      <div className="p-3">
        <Button
          variant="outline"
          size="default"
          className="w-full justify-start gap-2"
          onClick={onNew}
        >
          <Plus className="size-4" />
          {dict.chat.sidebar.newConversation}
        </Button>
      </div>

      <div className="flex items-center gap-2 px-4 pb-2 pt-2">
        <History className="size-3.5 text-subtle" />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
          {dict.chat.sidebar.recent}
        </span>
      </div>
      <Separator />

      <ScrollArea className="flex-1">
        {loading ? (
          <div className="space-y-2 p-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse-soft rounded-md bg-muted" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="px-4 py-6 text-xs text-subtle">{dict.chat.sidebar.empty}</div>
        ) : (
          <ul className="space-y-0.5 px-2 py-2">
            {sessions.map((s) => (
              <SessionRow
                key={s.sessionId}
                session={s}
                confirming={confirmingId === s.sessionId}
                onSwitch={() => onSwitch(s.sessionId)}
                onAskDelete={() => setConfirmingId(s.sessionId)}
                onConfirmDelete={() => {
                  setConfirmingId(null);
                  onDelete(s.sessionId);
                }}
                onCancelDelete={() => setConfirmingId(null)}
                justNowLabel={dict.chat.sidebar.justNow}
                turnSingular={dict.chat.sidebar.turnOne}
                turnPlural={dict.chat.sidebar.turnOther}
                deleteLabel={dict.chat.sidebar.deleteConversation}
                confirmText={dict.chat.sidebar.deleteConfirm}
                confirmLabel={dict.chat.sidebar.confirmDelete}
                cancelLabel={dict.chat.sidebar.cancel}
              />
            ))}
          </ul>
        )}
      </ScrollArea>

      <Separator />
      <div className="flex items-center justify-between gap-2 px-3 py-3">
        <UserMenu className="min-w-0 flex-1" variant="full" />
        <ThemeToggle />
      </div>
    </aside>
  );
}

interface SessionRowProps {
  session: SessionSummary;
  confirming: boolean;
  onSwitch: () => void;
  onAskDelete: () => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  justNowLabel: string;
  turnSingular: string;
  turnPlural: string;
  deleteLabel: string;
  confirmText: string;
  confirmLabel: string;
  cancelLabel: string;
}

function SessionRow({
  session: s,
  confirming,
  onSwitch,
  onAskDelete,
  onConfirmDelete,
  onCancelDelete,
  justNowLabel,
  turnSingular,
  turnPlural,
  deleteLabel,
  confirmText,
  confirmLabel,
  cancelLabel,
}: SessionRowProps) {
  if (confirming) {
    return (
      <li>
        <div
          className={cn(
            'flex w-full items-center justify-between gap-2 rounded-md p-2.5',
            'border border-[color:var(--negative)]/40 bg-[color:var(--negative)]/8',
          )}
        >
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-foreground">
              {confirmText}
            </span>
            <span className="mt-0.5 block truncate font-mono text-[10px] text-subtle">
              {s.title}
            </span>
          </span>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={onConfirmDelete}
              aria-label={confirmLabel}
              className={cn(
                'inline-flex size-7 items-center justify-center rounded-md',
                'bg-[color:var(--negative)] text-[color:var(--destructive-foreground)]',
                'transition-opacity hover:opacity-90',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              )}
            >
              <Check className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={onCancelDelete}
              aria-label={cancelLabel}
              className={cn(
                'inline-flex size-7 items-center justify-center rounded-md',
                'border border-border bg-card text-foreground transition-colors hover:bg-muted',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              )}
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li>
      <div
        className={cn(
          'group relative flex w-full items-start gap-2 rounded-md transition-colors',
          'hover:bg-muted',
          s.isCurrent && 'bg-muted',
        )}
      >
        <button
          type="button"
          onClick={onSwitch}
          className={cn(
            'flex flex-1 min-w-0 items-start gap-2 p-2.5 text-left',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md',
          )}
        >
          <MessageSquare
            className={cn(
              'mt-0.5 size-3.5 shrink-0',
              s.isCurrent ? 'text-foreground' : 'text-subtle',
            )}
          />
          <span className="flex-1 min-w-0">
            <span
              className={cn(
                'block truncate text-sm font-medium leading-tight',
                s.isCurrent ? 'text-foreground' : 'text-foreground/90',
              )}
            >
              {s.title}
            </span>
            <span className="mt-0.5 flex items-center gap-2 font-mono text-[10px] tabular-nums text-subtle">
              <span>
                {s.turnCount} {s.turnCount === 1 ? turnSingular : turnPlural}
              </span>
              <span>·</span>
              <span>{formatRelative(s.updatedAt, justNowLabel)}</span>
            </span>
          </span>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAskDelete();
          }}
          aria-label={deleteLabel}
          title={deleteLabel}
          className={cn(
            'absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex size-6 items-center justify-center',
            'rounded-md text-subtle transition-opacity',
            'opacity-0 group-hover:opacity-100 focus:opacity-100',
            'hover:bg-background hover:text-[color:var(--negative)]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:opacity-100',
          )}
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </li>
  );
}

function formatRelative(ts: number, justNowLabel: string): string {
  const diff = Date.now() - ts;
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diff < minute) return justNowLabel;
  if (diff < hour) return `${Math.floor(diff / minute)}m`;
  if (diff < day) return `${Math.floor(diff / hour)}h`;
  if (diff < 7 * day) return `${Math.floor(diff / day)}d`;
  const d = new Date(ts);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${m}-${dd}`;
}
