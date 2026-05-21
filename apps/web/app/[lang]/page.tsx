import { ArrowRight, LineChart, BrainCircuit, Activity } from 'lucide-react';
import { notFound } from 'next/navigation';
import { isLocale } from '../../lib/i18n/locales';
import { getLocalizedPath } from '../../lib/i18n/paths';
import { getDictionary, type Dictionary } from './dictionaries';
import { Button } from '../../components/ui/button';
import { Logo } from '../../components/logo';
import { ThemeToggle } from '../../components/theme-toggle';
import { Badge } from '../../components/ui/badge';
import { LanguageSwitcher } from '../../components/i18n/language-switcher';
import { UserMenu } from '../../components/auth/user-menu';
import Link from 'next/link';

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const chatHref = getLocalizedPath('/chat', lang);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header dict={dict} />
      <Hero dict={dict} chatHref={chatHref} />
      <Features dict={dict} />
      <SampleQuestions dict={dict} chatHref={chatHref} />
      <Footer dict={dict} />
    </div>
  );
}

function Header({ dict }: { dict: Dictionary }) {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 lg:px-8">
        <Logo />
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

function Hero({ dict, chatHref }: { dict: Dictionary; chatHref: string }) {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-5 pt-16 pb-20 sm:pt-24 sm:pb-28 lg:px-8">
        <div className="flex items-center gap-2">
          <Badge variant="accent" size="default">
            <span className="size-1.5 rounded-full bg-[color:var(--accent)] animate-pulse-soft" />
            {dict.landing.badge}
          </Badge>
          <span className="text-xs tabular-nums text-subtle">{dict.landing.version}</span>
        </div>
        <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          {dict.landing.hero.title}
          <br />
          <span className="text-muted-foreground">{dict.landing.hero.titleEmphasis}</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {dict.landing.hero.subtitle}
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Button asChild size="lg" variant="default">
            <Link href={chatHref}>
              {dict.landing.hero.primaryCta}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">
          {dict.landing.hero.tagline}
        </p>
      </div>
    </section>
  );
}

function Features({ dict }: { dict: Dictionary }) {
  const items = [
    { icon: BrainCircuit, ...dict.landing.features.reasoning },
    { icon: Activity, ...dict.landing.features.liveData },
    { icon: LineChart, ...dict.landing.features.memory },
  ];
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="bg-card p-6 sm:p-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
                {item.eyebrow}
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

function SampleQuestions({ dict, chatHref }: { dict: Dictionary; chatHref: string }) {
  const samples = [
    dict.landing.samples.quickDcf,
    dict.landing.samples.comparable,
    dict.landing.samples.macro,
    dict.landing.samples.thesis,
    dict.landing.samples.pitchDeck,
    dict.landing.samples.researchNote,
    dict.landing.samples.dcfModel,
  ];
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
          {dict.landing.samples.eyebrow}
        </p>
        <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-foreground">
          {dict.landing.samples.title}
        </h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {samples.map((q) => (
            <Link
              key={q}
              href={`${chatHref}?prompt=${encodeURIComponent(q)}`}
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

function Footer({ dict }: { dict: Dictionary }) {
  return (
    <footer className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <Logo size="sm" />
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">
          {dict.landing.footer.disclaimer}
        </p>
      </div>
    </footer>
  );
}
