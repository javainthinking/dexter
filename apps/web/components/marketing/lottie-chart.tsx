'use client';

import * as React from 'react';
import type { AnimationItem } from 'lottie-web';

/**
 * Lazy Lottie player for the marketing pages' financial-data motion
 * accents (line draws, growing bars, candlesticks). The lottie_light
 * runtime (SVG-only, ~40KB gz) is dynamically imported the first time a
 * chart scrolls into view, so it costs nothing on initial load. Honors
 * prefers-reduced-motion by seeking to the final frame instead of
 * playing. Decorative only — always aria-hidden.
 */
export function LottieChart({
  src,
  className,
  loop = true,
}: {
  /** Path to a Lottie JSON under /public (e.g. /lottie/market-line.json). */
  src: string;
  className?: string;
  loop?: boolean;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let anim: AnimationItem | undefined;
    let disposed = false;

    const io = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const lottie = (await import('lottie-web/build/player/lottie_light')).default;
      if (disposed) return;
      const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      anim = lottie.loadAnimation({
        container: el,
        renderer: 'svg',
        loop: loop && !reduceMotion,
        autoplay: !reduceMotion,
        path: src,
      });
      if (reduceMotion) {
        anim.addEventListener('DOMLoaded', () => anim?.goToAndStop(anim.totalFrames - 1, true));
      }
    }, { rootMargin: '200px' });
    io.observe(el);

    return () => {
      disposed = true;
      io.disconnect();
      anim?.destroy();
    };
  }, [src, loop]);

  return <div ref={ref} aria-hidden className={className} />;
}
