'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Render a placeholder of the same size during SSR/first paint to avoid
  // a layout shift when theme detection finishes client-side.
  if (!mounted) {
    return <div className="h-9 w-9" aria-hidden />;
  }

  const isDark = resolvedTheme === 'dark';
  const next = isDark ? 'light' : 'dark';

  return (
    <TooltipProvider delayDuration={250}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(next)}
            className={className}
            aria-label={`Switch to ${next} mode`}
          >
            {isDark ? (
              <Sun className="size-4 transition-transform duration-200" />
            ) : (
              <Moon className="size-4 transition-transform duration-200" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Switch to {next} mode</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
