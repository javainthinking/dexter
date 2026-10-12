import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Locale } from '../../lib/i18n/locales';
import { getLocalizedPath } from '../../lib/i18n/paths';
import type { Dictionary } from '../../app/[lang]/dictionaries';
import { CornerMarks } from './blueprint';
import { DownloadButtons } from '../desktop/download-buttons';
import { MacWindowShot } from '../desktop/mac-window-shot';

/**
 * Homepage "PickSkill for Mac" band. Same blueprint language as the rest
 * of the landing page: hairline frame with corner crosses, mono eyebrow,
 * serif headline, accent-dot list, and the real app screenshot in a Mac
 * window on the right.
 */
export function DesktopDownload({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const d = dict.download;
  return (
    <section id="mac" className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_100%_100%,color-mix(in_oklch,var(--accent)_10%,transparent),transparent_60%)]"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 border-border px-5 py-20 lg:grid-cols-[1fr_1.15fr] lg:gap-14 lg:border-x lg:px-8">
        <CornerMarks />
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">{d.homeEyebrow}</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {d.homeTitle}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{d.homeSubtitle}</p>
          <ul className="mt-6 space-y-3">
            {d.points.map((p) => (
              <li key={p.title} className="flex items-start gap-2.5 text-sm">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
                <span className="text-foreground">
                  <span className="font-medium">{p.title}.</span>{' '}
                  <span className="text-muted-foreground">{p.body}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <DownloadButtons d={d} />
          </div>
          <Link
            href={getLocalizedPath('/download', lang)}
            className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            {d.installTitle}
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <MacWindowShot alt={d.screenshotAlt} figLabel="Fig. 04" />
      </div>
    </section>
  );
}
