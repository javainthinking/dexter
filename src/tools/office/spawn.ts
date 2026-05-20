/**
 * Spawn helper for the OfficeCLI binary.
 *
 * Resolution order:
 *   1. `process.env.OFFICECLI_PATH` — explicit override, used by ops to
 *      pin a build of OfficeCLI without touching code.
 *   2. apps/web/bin/officecli-{platform}-{arch} — the binary bundled
 *      into the deployment by scripts/install-officecli.ts. This is
 *      what Vercel functions use.
 *   3. apps/web/bin/officecli — generic alias the install script
 *      creates (a copy of the host-platform binary).
 *   4. `which officecli` on $PATH — the user installed it themselves
 *      via OfficeCLI's official `install.sh`.
 *
 * All resolution happens once and is memoised in `cachedBinaryPath`.
 *
 * Every command is invoked with `--json` so the agent always gets
 * structured output it can reason about. stderr is captured separately
 * so a non-zero exit surfaces the original error message instead of an
 * empty `{}` from stdout.
 */
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

let cachedBinaryPath: string | null | undefined;

function projectRoot(): string {
  // src/tools/office → ../../.. = repo root. From there, apps/web/bin
  // is the bundled location.
  return resolve(__dirname, '..', '..', '..');
}

function platformBinaryName(): string {
  const platform = process.platform;
  const arch = process.arch;
  if (platform === 'linux' && arch === 'x64') return 'officecli-linux-x64';
  if (platform === 'linux' && arch === 'arm64') return 'officecli-linux-arm64';
  if (platform === 'darwin' && arch === 'arm64') return 'officecli-mac-arm64';
  if (platform === 'darwin' && arch === 'x64') return 'officecli-mac-x64';
  if (platform === 'win32') return 'officecli-win-x64.exe';
  return 'officecli';
}

function findOnPath(name: string): string | null {
  const pathDirs = (process.env.PATH ?? '').split(process.platform === 'win32' ? ';' : ':');
  for (const dir of pathDirs) {
    if (!dir) continue;
    const candidate = join(dir, name);
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

/**
 * Return the absolute path to a usable officecli binary, or null if
 * none is reachable. Cached after the first call.
 *
 * Resolution candidates (in order):
 *   1. OFFICECLI_PATH env override
 *   2. <cwd>/apps/web/bin/officecli-<platform>-<arch>
 *   3. <cwd>/apps/web/bin/officecli (alias the install script makes)
 *   4. <__dirname-walk>/apps/web/bin/... (works for tsx/bun source-tree runs)
 *   5. `which officecli` on $PATH
 *
 * Why cwd-rooted before __dirname-rooted: in a Next.js server bundle
 * on Vercel, __dirname is the path of the compiled chunk
 * (.next/server/chunks/…), not the original source file. Resolving
 * relative paths from there walks into .next/, where bin/ doesn't
 * exist. Vercel functions run with cwd = deploy root, and our
 * outputFileTracingIncludes places the binary at
 * apps/web/bin/officecli-linux-x64 relative to that root.
 */
export function findOfficeCliBinary(): string | null {
  if (cachedBinaryPath !== undefined) return cachedBinaryPath;
  const candidates: string[] = [];
  const env = process.env.OFFICECLI_PATH;
  if (env) candidates.push(env);
  const platformName = platformBinaryName();
  const cwd = process.cwd();
  candidates.push(join(cwd, 'apps', 'web', 'bin', platformName));
  candidates.push(join(cwd, 'apps', 'web', 'bin', 'officecli'));
  // Also try cwd-relative bin/ — Vercel functions sometimes run with
  // cwd already inside the app directory.
  candidates.push(join(cwd, 'bin', platformName));
  candidates.push(join(cwd, 'bin', 'officecli'));
  const root = projectRoot();
  candidates.push(join(root, 'apps', 'web', 'bin', platformName));
  candidates.push(join(root, 'apps', 'web', 'bin', 'officecli'));
  console.log(
    `[office-bin] resolving binary; cwd=${cwd} __dirname=${__dirname} platform=${platformName}`,
  );
  for (const c of candidates) {
    const exists = existsSync(c);
    console.log(`[office-bin]   candidate ${c} → ${exists ? 'FOUND' : 'not found'}`);
    if (exists) {
      cachedBinaryPath = c;
      return c;
    }
  }
  const onPath = findOnPath('officecli');
  console.log(`[office-bin]   $PATH search → ${onPath ?? 'not found'}`);
  cachedBinaryPath = onPath;
  return onPath;
}

export interface OfficeCliResult {
  /** Parsed JSON from stdout when --json output decoded cleanly. */
  data: unknown;
  /** Raw stdout (for diagnostics or when JSON parse fails). */
  stdout: string;
  /** Raw stderr (warnings on success; primary error message on failure). */
  stderr: string;
  /** The exit code. 0 means success in OfficeCLI's convention. */
  exitCode: number;
}

export class OfficeCliError extends Error {
  constructor(
    message: string,
    public readonly result: OfficeCliResult,
    public readonly command: string[],
  ) {
    super(message);
  }
}

export interface OfficeCliOptions {
  /** Subcommand argv (e.g. ['view', 'deck.pptx', 'outline']). --json is appended automatically. */
  argv: string[];
  /** Working directory. Defaults to /tmp on Vercel (the only writable
   * location); otherwise the current working directory. */
  cwd?: string;
  /** stdin to pipe in (used by `batch`, `merge`, `dump --apply`). */
  stdin?: string;
  /** Max execution time. OfficeCLI commands are usually sub-second but
   * `view ... screenshot` and `validate` on big decks can take longer. */
  timeoutMs?: number;
}

/**
 * Invoke the OfficeCLI binary. Always appends --json so callers get
 * structured output. Throws OfficeCliError on non-zero exit, embedding
 * the captured stderr so the agent can read what went wrong.
 */
export async function runOfficeCli(opts: OfficeCliOptions): Promise<OfficeCliResult> {
  const bin = findOfficeCliBinary();
  if (!bin) {
    throw new Error(
      'OfficeCLI binary not found. Install it via scripts/install-officecli.ts ' +
        'or set OFFICECLI_PATH to an existing binary.',
    );
  }
  const argv = [...opts.argv, '--json'];
  const cwd = opts.cwd ?? (process.platform === 'linux' && process.env.VERCEL ? '/tmp' : process.cwd());
  const timeoutMs = opts.timeoutMs ?? 30_000;

  // OfficeCLI is a self-contained .NET 10 binary. Its runtime requires
  // libicu for globalization — Vercel's function base image doesn't
  // ship it, and the agent surfaces the failure as
  //   "Couldn't find a valid ICU package installed on the system".
  // .NET supports running without ICU by enabling invariant mode via
  // an env var, at the cost of some culture-specific formatting. For
  // OfficeCLI's authoring use case the trade-off is benign — OOXML
  // numeric/date formats are explicit in the file, not derived from
  // host culture.
  // We default to invariant=true everywhere (harmless on macOS/Linux
  // dev too) and let the caller override via env if they need
  // culture-aware behaviour.
  const childEnv = {
    ...process.env,
    DOTNET_SYSTEM_GLOBALIZATION_INVARIANT: process.env.DOTNET_SYSTEM_GLOBALIZATION_INVARIANT ?? '1',
  };

  return new Promise<OfficeCliResult>((resolvePromise, rejectPromise) => {
    const child = spawn(bin, argv, { cwd, env: childEnv });
    let stdoutBuf = '';
    let stderrBuf = '';
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, timeoutMs);

    child.stdout.on('data', (chunk: Buffer) => {
      stdoutBuf += chunk.toString('utf8');
    });
    child.stderr.on('data', (chunk: Buffer) => {
      stderrBuf += chunk.toString('utf8');
    });
    child.on('error', (err) => {
      clearTimeout(timer);
      rejectPromise(err);
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      const exitCode = code ?? -1;
      let data: unknown = null;
      // --json output is one JSON document per invocation. Some
      // commands emit progress lines first; take the first {…} that
      // parses as a defensive parse.
      const parsed = tryParseFirstJson(stdoutBuf);
      if (parsed.ok) data = parsed.value;
      const result: OfficeCliResult = { data, stdout: stdoutBuf, stderr: stderrBuf, exitCode };
      if (timedOut) {
        rejectPromise(new OfficeCliError(`OfficeCLI timed out after ${timeoutMs}ms`, result, argv));
      } else if (exitCode !== 0) {
        rejectPromise(
          new OfficeCliError(
            `OfficeCLI exited ${exitCode}: ${stderrBuf.trim() || 'no stderr'}`,
            result,
            argv,
          ),
        );
      } else {
        resolvePromise(result);
      }
    });

    if (opts.stdin) {
      child.stdin.write(opts.stdin);
      child.stdin.end();
    } else {
      child.stdin.end();
    }
  });
}

function tryParseFirstJson(text: string): { ok: true; value: unknown } | { ok: false } {
  const trimmed = text.trim();
  if (!trimmed) return { ok: false };
  // Fast path: whole stdout is JSON.
  try {
    return { ok: true, value: JSON.parse(trimmed) };
  } catch {
    // Fall through to brace-balanced extraction.
  }
  // Scan for the first balanced {…} block.
  let depth = 0;
  let start = -1;
  for (let i = 0; i < trimmed.length; i++) {
    const c = trimmed[i];
    if (c === '{') {
      if (depth === 0) start = i;
      depth += 1;
    } else if (c === '}') {
      depth -= 1;
      if (depth === 0 && start >= 0) {
        const candidate = trimmed.slice(start, i + 1);
        try {
          return { ok: true, value: JSON.parse(candidate) };
        } catch {
          start = -1;
        }
      }
    }
  }
  return { ok: false };
}
