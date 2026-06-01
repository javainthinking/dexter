/**
 * Per-agent-run state for OfficeCLI artefacts.
 *
 * The office tool used to upload to R2 on every successful edit. That
 * meant a 30-slide deck became 30 PUTs (one per `add`/`set`/`batch`
 * call), each producing a presigned URL that lived for a few seconds
 * before the next edit obsoleted it. Beyond the cost concern, it
 * cluttered storage with intermediate snapshots and added measurable
 * latency to every edit (~100-200 ms per PUT).
 *
 * The new contract: tools only *track* which files they've touched.
 * The agent loop drains the touch set ONCE at the end of the run and
 * uploads the final state of each file. The user gets a single,
 * canonical download URL per artefact.
 *
 * AsyncLocalStorage scope is opened by Agent.run() and closed when the
 * generator returns. Tools resolve the current touch set via
 * `recordOfficeTouch(file)`; outside an agent run the call is a no-op
 * (CLI scripts that never went through Agent.run() simply skip
 * tracking).
 */

import { AsyncLocalStorage } from 'node:async_hooks';
import { existsSync } from 'node:fs';
import { resolve as resolvePath } from 'node:path';
import { isR2Configured, uploadFileForUser, type UploadResult } from './r2.js';
import { getCurrentUser, getCurrentUserId } from './user-context.js';

// Direct stdout/stderr logging — the project's `logger` module is an
// in-memory debug buffer for the CLI side panel and doesn't emit to
// the dev server's terminal. We want these traces visible in the
// `bun run dev` output for diagnosing missing uploads.
const log = (msg: string) => console.log(msg);
const warn = (msg: string) => console.warn(msg);

export interface OfficeRunState {
  /**
   * Absolute paths of every .docx/.xlsx/.pptx file the agent has
   * touched in this run. A Set so repeated edits on the same file
   * don't multiply the final upload work.
   */
  touchedFiles: Set<string>;
  /**
   * When true, the user is over their monthly file quota for this run:
   * `office_edit` refuses (produces no file) and records a blocked attempt
   * instead. Set by the caller via `withOfficeRun(fn, { fileGenerationBlocked })`.
   */
  fileGenerationBlocked: boolean;
  /** Set by `office_edit` when it refused due to the quota — the signal the
   *  web layer uses to pop an upgrade prompt. */
  blockedFileAttempt: boolean;
}

export interface DeliverableFile {
  filename: string;
  downloadUrl: string;
  expiresAt: string;
  byteLength: number;
  key: string;
}

const storage = new AsyncLocalStorage<OfficeRunState>();

/**
 * Open a run-scoped state for the duration of `fn`. Inside the scope,
 * `recordOfficeTouch` adds files to the set; `drainOfficeRun` reads
 * + uploads them.
 */
export function withOfficeRun<R>(
  fn: () => R | Promise<R>,
  opts?: { fileGenerationBlocked?: boolean },
): Promise<R> {
  const state: OfficeRunState = {
    touchedFiles: new Set(),
    fileGenerationBlocked: opts?.fileGenerationBlocked ?? false,
    blockedFileAttempt: false,
  };
  log(`[office-run] scope opened (fileGenerationBlocked=${state.fileGenerationBlocked})`);
  return Promise.resolve(storage.run(state, fn));
}

/** True when this run is over the file quota — office_edit should refuse. */
export function isFileGenerationBlocked(): boolean {
  return storage.getStore()?.fileGenerationBlocked ?? false;
}

/** office_edit calls this when it refuses due to the quota. */
export function recordBlockedFileAttempt(): void {
  const state = storage.getStore();
  if (state) state.blockedFileAttempt = true;
}

/** Did office_edit refuse a file generation this run? Read at run end. */
export function officeRunBlockedFileAttempt(): boolean {
  return storage.getStore()?.blockedFileAttempt ?? false;
}

/**
 * Note that an office_edit call mutated `filePath`. Safe to call when
 * no run scope is active (CLI direct invocations) — it just no-ops.
 */
export function recordOfficeTouch(filePath: string): void {
  const state = storage.getStore();
  if (!state) {
    warn(`[office-run] recordOfficeTouch called OUTSIDE scope for ${filePath} — file will not be uploaded`);
    return;
  }
  // Normalise to an absolute, canonical path so calls that use the
  // same physical file via different surface paths (relative vs.
  // absolute, with-cwd vs. without) collapse to one Set entry. Without
  // this, an agent that first runs `office_edit ... TSMC.docx` then
  // later runs the absolute form `/.../TSMC.docx` registers two
  // touches, drain uploads the same file twice, and the chat UI gets
  // two chips with the same display name.
  const canonical = resolvePath(filePath);
  state.touchedFiles.add(canonical);
  log(`[office-run] touch recorded: ${canonical} (set size now ${state.touchedFiles.size})`);
}

/**
 * Inspect (don't mutate) the current touched-files set. Used by tests
 * + diagnostics.
 */
export function getOfficeRunState(): OfficeRunState | null {
  return storage.getStore() ?? null;
}

/**
 * Read-only snapshot of the touched-files set without clearing it.
 * Used by the chunked-agent controller to persist mid-run state on
 * `continuation_required` so a subsequent chunk's drain picks up the
 * same files.
 */
export function peekTouchedFiles(): string[] {
  const state = storage.getStore();
  return state ? Array.from(state.touchedFiles) : [];
}

/**
 * Pre-populate the touched-files set from a previously-persisted job.
 * Caller has already entered the office-run scope (via withOfficeRun);
 * this just seeds the set so any drain in this scope will upload the
 * files touched in earlier chunks too. Idempotent — safe to call twice.
 */
export function restoreOfficeTouches(paths: string[]): void {
  const state = storage.getStore();
  if (!state) {
    warn('[office-run] restoreOfficeTouches called OUTSIDE scope — paths discarded');
    return;
  }
  for (const p of paths) state.touchedFiles.add(p);
  log(`[office-run] restored ${paths.length} touched file(s) from previous chunk`);
}

/**
 * Should we attempt R2 uploads for this run? Mirrors the gate the
 * office tool used to enforce inline:
 *   1. R2 is configured.
 *   2. Either a web request scope is active OR the CLI opted in via
 *      DEXTER_OFFICE_AUTO_UPLOAD=1.
 */
function shouldUploadInThisRun(): boolean {
  if (!isR2Configured()) return false;
  const hasWebScope = getCurrentUser() !== null;
  const cliOptIn = process.env.DEXTER_OFFICE_AUTO_UPLOAD === '1';
  return hasWebScope || cliOptIn;
}

/**
 * Upload every touched file in the current run to R2 and return the
 * deliverables. **No emptiness gating** — we deliberately deliver
 * whatever the agent produced, even if it's a near-blank OOXML
 * scaffold. The chat chip surfaces `<filename> <N KB> Download` so
 * the user can immediately tell whether the artefact has real content;
 * silently dropping below-threshold files leaves the user with no
 * signal at all and is worse UX than handing them a 4 KB blank that
 * makes the failure obvious.
 *
 * The in-loop guards (`fileIsEmpty` flag on each office_edit response,
 * the F3 loop nudge, the F7 no-op detector) still push the agent to
 * add real content while the loop is alive. This drainer's job is
 * only to publish the final filesystem state.
 *
 * Files that no longer exist (the agent deleted them) are skipped.
 */
export async function drainOfficeRun(): Promise<DeliverableFile[]> {
  const state = storage.getStore();
  if (!state) {
    warn('[office-run] drain called with NO ACTIVE SCOPE');
    return [];
  }
  if (state.touchedFiles.size === 0) {
    log('[office-run] drain: nothing to upload (no touches recorded)');
    return [];
  }
  if (!shouldUploadInThisRun()) {
    log(
      `[office-run] drain: skipping ${state.touchedFiles.size} files (uploads not enabled for this run)`,
    );
    return [];
  }

  const userId = getCurrentUserId();
  log(`[office-run] drain start: ${state.touchedFiles.size} touched, userId=${userId}`);
  const results: DeliverableFile[] = [];

  for (const file of state.touchedFiles) {
    if (!existsSync(file)) {
      warn(`[office-run] drain: file missing on disk, skipping ${file}`);
      continue;
    }
    try {
      const upload: UploadResult = await uploadFileForUser(userId, file);
      const filename = file.split('/').pop() ?? file;
      log(`[office-run] drain: uploaded ${filename} (${upload.byteLength} bytes) → ${upload.key}`);
      results.push({
        filename,
        downloadUrl: upload.downloadUrl,
        expiresAt: upload.expiresAt,
        byteLength: upload.byteLength,
        key: upload.key,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      warn(`[office-run] R2 upload failed for ${file}: ${message}`);
    }
  }

  state.touchedFiles.clear();
  log(`[office-run] drain done: ${results.length} deliverables`);
  return results;
}
