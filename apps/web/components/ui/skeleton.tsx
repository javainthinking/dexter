import { cn } from '../../lib/utils';

/**
 * Loading placeholder primitive. Pulses subtly via Tailwind's
 * animate-pulse + a muted background, sized via className from the
 * caller. Convention is to mirror the final content's footprint so the
 * layout doesn't jump when real data arrives — e.g. a 16ch-wide
 * money cell becomes <Skeleton className="h-4 w-16" />.
 *
 * Lives in /ui rather than /portfolios or /indicators because the same
 * primitive is reused across portfolio quote rows, indicator cards,
 * and (eventually) memory tiles.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded-md bg-muted', className)}
    />
  );
}
