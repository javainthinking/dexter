import Link from 'next/link';
import { ArrowRight, LineChart, BrainCircuit, Activity } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Logo } from '../components/logo';
import { ThemeToggle } from '../components/theme-toggle';
import { Badge } from '../components/ui/badge';
import { GithubIcon } from '../components/icons/github';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <Features />
      <SampleQuestions />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 lg:px-8">
        <Logo />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <a
              href="https://github.com/javainthinking/dexter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubIcon className="size-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-5 pt-16 pb-20 sm:pt-24 sm:pb-28 lg:px-8">
        <div className="flex items-center gap-2">
          <Badge variant="accent" size="default">
            <span className="size-1.5 rounded-full bg-[color:var(--accent)] animate-pulse-soft" />
            Autonomous research agent
          </Badge>
          <span className="text-xs tabular-nums text-subtle">v2026.5</span>
        </div>
        <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Deep financial research,
          <br />
          <span className="text-muted-foreground">on demand.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Dexter decomposes complex questions, fetches live market data, validates
          its own work, and produces citation-backed answers. The same agent core
          powers the terminal CLI, WhatsApp, and the web — wherever you do research.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Button asChild size="lg" variant="default">
            <Link href="/chat">
              Open the workbench
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a
              href="https://github.com/javainthinking/dexter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubIcon className="size-4" />
              View on GitHub
            </a>
          </Button>
        </div>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">
          Live · Streaming · Memory-grounded
        </p>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    {
      icon: BrainCircuit,
      label: '01 — Reasoning loop',
      title: 'Plans, executes, self-validates',
      body:
        'Dexter breaks down a question into a research plan, runs tools concurrently, and revisits its own answer until it is grounded in real data.',
    },
    {
      icon: Activity,
      label: '02 — Live data',
      title: 'Direct market & filings access',
      body:
        'Real-time prices, fundamentals, ratios and news through Financial Datasets, plus web search and document tooling — no stale snapshots.',
    },
    {
      icon: LineChart,
      label: '03 — Persistent memory',
      title: 'Remembers your thesis',
      body:
        'Long-term memory is held in MemoryLake. Dexter recalls your prior positions, preferences, and rules every turn so the analysis stays personal.',
    },
  ];
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="bg-card p-6 sm:p-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
                {item.label}
              </p>
              <div className="mt-4 inline-flex size-9 items-center justify-center rounded-md border border-border bg-muted text-foreground">
                <item.icon className="size-4" />
              </div>
              <h3 className="mt-4 font-serif text-lg font-semibold leading-snug tracking-tight text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SampleQuestions() {
  const samples = [
    'Run a quick DCF on NVDA using the latest 10-Q.',
    'Compare AAPL and MSFT cash flow trends over the last 5 years.',
    'What does the latest CPI print mean for the 10Y?',
    'Summarize the bull and bear thesis for TSMC right now.',
  ];
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
          Try it
        </p>
        <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-foreground">
          Ask anything you would ask a junior analyst.
        </h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {samples.map((q) => (
            <Link
              key={q}
              href={`/chat?prompt=${encodeURIComponent(q)}`}
              className="group flex items-start justify-between gap-4 rounded-lg border border-border bg-card p-4 text-sm transition-colors hover:border-border-strong hover:bg-muted"
            >
              <span className="text-foreground">{q}</span>
              <ArrowRight className="size-4 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <Logo size="sm" />
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">
          Not investment advice
        </p>
      </div>
    </footer>
  );
}
