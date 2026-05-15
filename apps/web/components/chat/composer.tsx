'use client';

import * as React from 'react';
import { ArrowUp, Square } from 'lucide-react';
import { Button } from '../ui/button';
import { Kbd } from '../ui/kbd';
import { useDictionary } from '../i18n/dictionary-provider';
import { cn } from '../../lib/utils';

interface ComposerProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onStop?: () => void;
  pending?: boolean;
  disabled?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}

export function Composer({
  value,
  onChange,
  onSubmit,
  onStop,
  pending,
  disabled,
  placeholder,
  autoFocus,
}: ComposerProps) {
  const dict = useDictionary();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Autosize the textarea up to a maximum height.
  React.useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 240)}px`;
  }, [value]);

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Cmd/Ctrl+Enter or plain Enter (without shift) sends
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (!pending && value.trim()) onSubmit();
    }
  }

  const canSend = !pending && value.trim().length > 0 && !disabled;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canSend) onSubmit();
      }}
      className={cn(
        'relative overflow-hidden rounded-xl border border-border bg-card',
        'shadow-[var(--shadow-elev1)] transition-shadow focus-within:shadow-[var(--shadow-elev2)]',
        'focus-within:border-border-strong',
      )}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder ?? dict.chat.composer.placeholder}
        rows={1}
        disabled={disabled}
        autoFocus={autoFocus}
        className={cn(
          'block w-full resize-none bg-transparent px-4 pt-3.5 pb-2 text-sm leading-6',
          'placeholder:text-subtle focus:outline-none',
          'min-h-[58px]',
        )}
      />
      <div className="flex items-center justify-between gap-2 px-2 pb-2 pt-1">
        <p className="hidden items-center gap-1.5 px-2 text-[11px] text-subtle sm:flex">
          <Kbd>↩</Kbd>
          <span>{dict.chat.composer.sendHint}</span>
          <span className="mx-1 text-border-strong">·</span>
          <Kbd>Shift</Kbd>
          <Kbd>↩</Kbd>
          <span>{dict.chat.composer.newlineHint}</span>
        </p>
        <div className="ml-auto flex items-center gap-1.5">
          {pending && onStop && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onStop}
              className="h-8"
            >
              <Square className="size-3.5 fill-current" />
              {dict.chat.composer.stop}
            </Button>
          )}
          <Button
            type="submit"
            size="icon-sm"
            variant={canSend ? 'accent' : 'ghost'}
            disabled={!canSend}
            aria-label={dict.chat.composer.send}
          >
            <ArrowUp className="size-4" />
          </Button>
        </div>
      </div>
    </form>
  );
}
