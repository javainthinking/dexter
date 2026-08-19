/**
 * Blueprint ornaments — the "technical drawing" layer of the marketing
 * pages: registration crosses where hairlines meet, and rotated figure
 * tags on panel edges. Purely decorative (aria-hidden), language-neutral,
 * theme-aware via the --border / --subtle tokens. Safe to render from
 * both server and client components.
 */

const CROSS_POS = {
  tl: '-top-[5px] -left-[5px]',
  tr: '-top-[5px] -right-[5px]',
  bl: '-bottom-[5px] -left-[5px]',
  br: '-bottom-[5px] -right-[5px]',
} as const;

export function CornerCross({
  pos,
  className = '',
}: {
  pos: keyof typeof CROSS_POS;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 10 10"
      className={`pointer-events-none absolute z-10 hidden size-[9px] text-border-strong lg:block ${CROSS_POS[pos]} ${className}`}
    >
      <path d="M5 0v10M0 5h10" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/** All four corner crosses for a `relative` container. */
export function CornerMarks({ className = '' }: { className?: string }) {
  return (
    <>
      {(Object.keys(CROSS_POS) as (keyof typeof CROSS_POS)[]).map((pos) => (
        <CornerCross key={pos} pos={pos} className={className} />
      ))}
    </>
  );
}

/** Rotated "( FIG. 01 )" caption on a panel edge, schematic-style. */
export function FigTag({
  label,
  side = 'right',
}: {
  label: string;
  side?: 'left' | 'right';
}) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute top-1/2 hidden -translate-y-1/2 select-none font-mono text-[8px] uppercase tracking-[0.22em] text-subtle sm:block ${
        side === 'right' ? 'right-1.5 [writing-mode:vertical-rl]' : 'left-1.5 rotate-180 [writing-mode:vertical-rl]'
      }`}
    >
      ( {label} )
    </span>
  );
}
