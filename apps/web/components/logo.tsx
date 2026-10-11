import { cn } from '../lib/utils';

/**
 * PickSkill mark — a two-tone check ("pick") rising into an arrow, on a rounded
 * tile, locked up with the serif wordmark. Same geometry as app/icon.svg
 * and the desktop app icon (apps/desktop/build/icon.svg).
 */
export function Logo({
  className,
  showWord = true,
  size = 'md',
}: {
  className?: string;
  showWord?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  const dim = size === 'sm' ? 22 : size === 'lg' ? 32 : 26;
  const text = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base';
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <Mark size={dim} />
      {showWord && (
        <span
          className={cn(
            'font-serif font-semibold tracking-tight text-foreground',
            text,
          )}
        >
          PickSkill
        </span>
      )}
    </span>
  );
}

function Mark({ size }: { size: number }) {
  return (
    <span
      style={{ width: size, height: size }}
      className="relative inline-flex items-center justify-center rounded-md bg-foreground text-background"
      aria-hidden
    >
      <svg viewBox="0 0 24 24" width={size * 0.84} height={size * 0.84}>
        {/* "Pick" check rising into an arrowhead; the short stroke is a half-tone facet. */}
        <polygon points="2.46,9.78 11.17,18.49 11.17,13.26 5.08,7.17" fill="currentColor" opacity="0.5" />
        <polygon points="11.17,18.49 19.38,10.28 20.55,11.45 21.54,5.51 15.60,6.50 16.76,7.67 11.17,13.26" fill="currentColor" />
      </svg>
    </span>
  );
}
