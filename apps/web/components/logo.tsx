import { cn } from '../lib/utils';

/**
 * Dexter mark — a clean lock-up combining a small serif-style monogram
 * with the wordmark, tuned for both compact and headline use.
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
          Dexter
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
      <svg
        viewBox="0 0 24 24"
        width={size * 0.72}
        height={size * 0.72}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Stylised chart up-trend */}
        <path d="M4 16 L9 11 L13 14 L20 6" />
        <path d="M15 6 L20 6 L20 11" opacity="0.85" />
      </svg>
    </span>
  );
}
