'use client';

import * as React from 'react';
import {
  ArrowRight,
  TrendingUp,
  Building2,
  BarChart3,
  Newspaper,
  Presentation,
  FileText,
  FileSpreadsheet,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useDictionary } from '../i18n/dictionary-provider';

export function EmptyState({ onPick }: { onPick: (prompt: string) => void }) {
  const dict = useDictionary();
  const PROMPTS = [
    { icon: TrendingUp, ...dict.chat.empty.prompts.quickDcf },
    { icon: Building2, ...dict.chat.empty.prompts.comparable },
    { icon: BarChart3, ...dict.chat.empty.prompts.macro },
    { icon: Newspaper, ...dict.chat.empty.prompts.thesis },
    // File-generation samples — typical financial-analysis deliverables
    // the agent can produce end-to-end (R2-delivered + auto-downloaded
    // in chat). Icons match the composer's quick-prompt buttons so the
    // affordance reads consistently across the surface.
    { icon: Presentation, ...dict.chat.empty.prompts.pitchDeck },
    { icon: FileText, ...dict.chat.empty.prompts.researchNote },
    { icon: FileSpreadsheet, ...dict.chat.empty.prompts.dcfModel },
  ];
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-12 text-center sm:py-20">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subtle">
        {dict.chat.empty.eyebrow}
      </p>
      <h1 className="mt-4 font-serif text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl">
        {dict.chat.empty.title}
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        {dict.chat.empty.subtitle}
      </p>

      <div className="mt-8 grid w-full gap-2.5 sm:mt-10 sm:grid-cols-2">
        {PROMPTS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => onPick(p.prompt)}
            className={cn(
              'group flex items-start gap-3 rounded-lg border border-border bg-card p-3.5 text-left',
              'transition-colors hover:border-border-strong hover:bg-muted',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            )}
          >
            <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-foreground">
              <p.icon className="size-3.5" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">
                {p.label}
              </span>
              <span className="mt-1 block text-sm leading-snug text-foreground">{p.prompt}</span>
            </span>
            <ArrowRight className="size-4 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
}
