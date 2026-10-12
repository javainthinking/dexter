import Image from 'next/image';
import { CornerMarks, FigTag } from '../marketing/blueprint';

/**
 * The real PickSkill for Mac home screen (captured from the app) inside a
 * macOS window frame. Theme-aware: the light capture shows in light mode,
 * the dark capture in dark mode, so the product always matches the page.
 */
export function MacWindowShot({
  alt,
  priority = false,
  figLabel,
}: {
  alt: string;
  priority?: boolean;
  figLabel?: string;
}) {
  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-[0_24px_60px_-24px_color-mix(in_oklch,var(--foreground)_28%,transparent)]">
        {/* Title bar with traffic lights */}
        <div className="flex h-7 items-center gap-1.5 border-b border-border bg-muted/60 px-3" aria-hidden>
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </div>
        <Image
          src="/desktop/desktop-home-light.webp"
          alt={alt}
          width={1600}
          height={1025}
          priority={priority}
          sizes="(min-width: 1024px) 620px, 100vw"
          className="block w-full dark:hidden"
        />
        <Image
          src="/desktop/desktop-home-dark.webp"
          alt={alt}
          width={1600}
          height={1025}
          priority={priority}
          sizes="(min-width: 1024px) 620px, 100vw"
          className="hidden w-full dark:block"
        />
        {figLabel && <FigTag label={figLabel} />}
      </div>
      <CornerMarks />
    </div>
  );
}
