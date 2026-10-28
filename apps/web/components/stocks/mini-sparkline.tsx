import { cn } from '../../lib/utils';

/**
 * Tiny static close-price sparkline for stock cards. Server-renderable
 * (no hooks) so index and related-stock grids ship zero client JS.
 * Coloured by the window's direction through the market-colour tokens.
 */
export function MiniSparkline({
  closes,
  className,
}: {
  closes: Array<number | null>;
  className?: string;
}) {
  const pts = closes.filter((c): c is number => c != null && Number.isFinite(c));
  if (pts.length < 2) return null;
  const W = 120;
  const H = 32;
  const min = Math.min(...pts);
  const max = Math.max(...pts);
  const span = max - min || 1;
  const d = pts
    .map((c, i) => {
      const x = (i / (pts.length - 1)) * W;
      const y = H - 2 - ((c - min) / span) * (H - 4);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  const up = pts[pts.length - 1] >= pts[0];
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn('h-8 w-full', up ? 'text-up' : 'text-down', className)}
    >
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
