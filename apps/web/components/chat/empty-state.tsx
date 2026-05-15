'use client';

import * as React from 'react';
import { ArrowRight, TrendingUp, Building2, BarChart3, Newspaper } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Prompt {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  prompt: string;
}

const PROMPTS: Prompt[] = [
  {
    icon: TrendingUp,
    label: 'Quick DCF',
    prompt: 'Run a quick DCF on NVDA using the latest 10-Q. Show me your assumptions.',
  },
  {
    icon: Building2,
    label: 'Comparable',
    prompt: 'Compare AAPL and MSFT cash flow trends over the last 5 years.',
  },
  {
    icon: BarChart3,
    label: 'Macro',
    prompt: 'What does the latest CPI print mean for the 10-year Treasury yield?',
  },
  {
    icon: Newspaper,
    label: 'Thesis',
    prompt: 'Summarize the current bull and bear thesis for TSMC.',
  },
];

export function EmptyState({ onPick }: { onPick: (prompt: string) => void }) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-12 text-center sm:py-20">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subtle">
        Workbench · Ready
      </p>
      <h1 className="mt-4 font-serif text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl">
        What would you like to research?
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Ask anything you would hand to a junior analyst. Dexter plans, fetches
        live data, and shows its work.
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
