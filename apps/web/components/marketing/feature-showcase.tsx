import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Locale } from '../../lib/i18n/locales';
import { getLocalizedPath } from '../../lib/i18n/paths';
import { featureList, getFeaturesContent } from '../../lib/features';
import { Button } from '../ui/button';
import { CornerMarks, FigTag } from './blueprint';

/**
 * Homepage feature showcase — the three product pillars in an alternating
 * left/right layout: a polished product image on one side, the pitch +
 * top capabilities + CTAs on the other. Content is reused from the
 * already-localized feature catalogue (lib/features.ts), so this needs no
 * new translations. Labels (eyebrow/title/CTAs) come from the landing
 * dictionary via props.
 */
export function FeatureShowcase({
  lang,
  eyebrow,
  title,
  subtitle,
  learnMoreLabel,
  tryItLabel,
}: {
  lang: Locale;
  eyebrow: string;
  title: string;
  subtitle: string;
  /** Template with "{name}" — e.g. "Explore {name}". */
  learnMoreLabel: string;
  tryItLabel: string;
}) {
  const content = getFeaturesContent(lang);

  return (
    <section className="border-b border-border">
      <div className="relative mx-auto max-w-6xl border-border px-5 py-20 lg:border-x lg:px-8">
        <CornerMarks />
        <div className="max-w-2xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">{eyebrow}</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{subtitle}</p>
        </div>

        <div className="mt-14 space-y-16 lg:space-y-24">
          {featureList.map((feature, i) => {
            const item = content.items[feature.slug];
            const featureHref = getLocalizedPath(`/features/${feature.slug}`, lang);
            const tryHref = getLocalizedPath(feature.ctaHref, lang);
            const reversed = i % 2 === 1;
            return (
              <div
                key={feature.slug}
                className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
              >
                {/* Image — clicks through to the live feature */}
                <div className={`relative ${reversed ? 'lg:order-2' : 'lg:order-1'}`}>
                  <Link
                    href={tryHref}
                    aria-label={item.name}
                    className="group relative block overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-colors hover:border-border-strong"
                  >
                    {/* blueprint texture + soft accent wash behind the mockup */}
                    <div className="pointer-events-none absolute inset-0 blueprint-grid opacity-60" />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_80%_0%,color-mix(in_oklch,var(--accent)_12%,transparent),transparent_60%)]" />
                    <Image
                      src={feature.image}
                      alt={item.imageAlt}
                      width={1200}
                      height={630}
                      sizes="(min-width: 1024px) 560px, 100vw"
                      className="relative w-full transition-transform duration-300 group-hover:scale-[1.015]"
                    />
                    <FigTag label={`Fig. 0${i + 1}`} side={reversed ? 'left' : 'right'} />
                  </Link>
                  <CornerMarks />
                </div>

                {/* Copy */}
                <div className={reversed ? 'lg:order-1' : 'lg:order-2'}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
                    {item.eyebrow}
                  </p>
                  <h3 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-foreground">
                    {item.name}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                    {item.tagline}
                  </p>
                  <ul className="mt-5 space-y-2.5">
                    {item.capabilities.slice(0, 3).map((cap) => (
                      <li key={cap.title} className="flex items-start gap-2.5 text-sm">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
                        <span className="text-foreground">
                          <span className="font-medium">{cap.title}.</span>{' '}
                          <span className="text-muted-foreground">{cap.body}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    <Button asChild size="default" variant="default">
                      <Link href={tryHref}>
                        {tryItLabel}
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                    <Button asChild size="default" variant="outline">
                      <Link href={featureHref}>
                        {learnMoreLabel.replace('{name}', item.name)}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
