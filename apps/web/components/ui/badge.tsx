import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-medium tabular-nums transition-colors',
  {
    variants: {
      variant: {
        default: 'border-border bg-muted text-muted-foreground',
        outline: 'border-border bg-transparent text-foreground',
        accent:
          'border-transparent bg-accent/15 text-[color:var(--accent)] [&_svg]:text-[color:var(--accent)]',
        positive:
          'border-transparent bg-[color:var(--positive)]/12 text-[color:var(--positive)]',
        negative:
          'border-transparent bg-[color:var(--negative)]/12 text-[color:var(--negative)]',
        warning:
          'border-transparent bg-[color:var(--warning)]/15 text-[color:var(--warning)]',
        info: 'border-transparent bg-[color:var(--info)]/12 text-[color:var(--info)]',
      },
      size: {
        sm: 'text-[10px] [&_svg]:size-3',
        default: 'text-xs [&_svg]:size-3.5',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant, size, className }))} {...props} />
  ),
);
Badge.displayName = 'Badge';

export { badgeVariants };
