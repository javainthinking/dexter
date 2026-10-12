/**
 * PickSkill for Mac — the current desktop release.
 *
 * Builds are published as GitHub Releases on the PickSkill repo (tag
 * `desktop-v<version>`) with versionless asset names (see
 * apps/desktop/electron-builder.yml). Bump `version` here after each
 * desktop release so every download link on pickskill.ai points at it.
 */

const REPO = 'javainthinking/dexter';

export const DESKTOP_RELEASE = {
  version: '0.1.1',
  /** LSMinimumSystemVersion of the packaged app (Electron 44). */
  minMacOS: '13',
} as const;

const TAG = `desktop-v${DESKTOP_RELEASE.version}`;
const base = `https://github.com/${REPO}/releases/download/${TAG}`;

export const DESKTOP_DOWNLOADS = {
  /** Apple Silicon (M1 and later) — the default for current Macs. */
  arm64: `${base}/PickSkill-mac-arm64.dmg`,
  /** Intel Macs. */
  x64: `${base}/PickSkill-mac-x64.dmg`,
  /** Release notes + checksums. */
  release: `https://github.com/${REPO}/releases/tag/${TAG}`,
} as const;

/** True inside the desktop app, which renders these same web components. */
export function isDesktopApp(): boolean {
  return typeof window !== 'undefined' && 'pickskill' in window;
}
