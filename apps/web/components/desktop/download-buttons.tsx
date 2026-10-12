import { Download } from 'lucide-react';
import { Button } from '../ui/button';
import { DESKTOP_DOWNLOADS, DESKTOP_RELEASE } from '../../lib/desktop';
import type { Dictionary } from '../../app/[lang]/dictionaries';

/**
 * Primary "Download for Mac" (Apple Silicon) + secondary Intel build, with
 * the version line underneath. Links go straight to the GitHub release
 * assets, so the download starts without an intermediate page.
 */
export function DownloadButtons({
  d,
  size = 'lg',
  showReleaseLink = false,
}: {
  d: Dictionary['download'];
  size?: 'default' | 'lg';
  showReleaseLink?: boolean;
}) {
  const versionLine = d.versionLine
    .replace('{version}', DESKTOP_RELEASE.version)
    .replace('{macos}', DESKTOP_RELEASE.minMacOS);
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild size={size} variant="default">
          <a href={DESKTOP_DOWNLOADS.arm64} data-download="mac-arm64">
            <Download className="size-4" />
            {d.ctaPrimary}
          </a>
        </Button>
        <Button asChild size={size} variant="outline">
          <a href={DESKTOP_DOWNLOADS.x64} data-download="mac-x64">
            {d.intelLink}
          </a>
        </Button>
      </div>
      <p className="mt-4 font-mono text-[11px] tracking-[0.08em] text-subtle">
        {d.appleSilicon} · {versionLine}
      </p>
      {showReleaseLink && (
        <a
          href={DESKTOP_DOWNLOADS.release}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          {d.allReleases} ↗
        </a>
      )}
    </div>
  );
}
