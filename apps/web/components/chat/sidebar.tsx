'use client';

import * as React from 'react';
import { Plus, MessageSquare, History, X } from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Logo } from '../logo';
import { ThemeToggle } from '../theme-toggle';
import { LocalizedLink } from '../i18n/localized-link';
import { useDictionary, format } from '../i18n/dictionary-provider';
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
  onClose?: () => void;
}

export function Sidebar({ sessions, loading, onNew, onSwitch, onClose }: SidebarProps) {
  const dict = useDictionary();
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
              <li key={s.sessionId}>
                <button
                  type="button"
                  onClick={() => onSwitch(s.sessionId)}
                  className={cn(
                    'group flex w-full items-start gap-2 rounded-md p-2.5 text-left transition-colors',
                    'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    s.isCurrent && 'bg-muted',
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
                        {s.turnCount}{' '}
                        {s.turnCount === 1
                          ? dict.chat.sidebar.turnOne
                          : dict.chat.sidebar.turnOther}
                      </span>
                      <span>·</span>
                      <span>{formatRelative(s.updatedAt, dict.chat.sidebar.justNow)}</span>
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </ScrollArea>

      <Separator />
      <div className="flex items-center justify-between px-3 py-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
          {dict.chat.sidebar.workbench}
        </span>
        <ThemeToggle />
      </div>
    </aside>
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
