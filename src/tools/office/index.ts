/**
 * OfficeCLI integration — two umbrella tools (`office_read`, `office_edit`)
 * that cover all 15+ OfficeCLI subcommands.
 *
 * Two tools instead of fifteen because:
 *   - The agent picks the right verb via the skill markdown
 *     (src/skills/office/SKILL.md), which documents every subcommand.
 *   - System-prompt budget is finite; fanning out to one tool per verb
 *     would eat budget the agent needs for portfolio + memory + chat
 *     tools.
 *   - The read/write split is the only distinction that's actually
 *     load-bearing: it gates side effects, lets us audit mutations, and
 *     lets future caching logic apply only to the read tool.
 *
 * Both tools take the same shape — subcommand + file + positional args
 * + flag map + optional stdin — and delegate to a single `invoke` that
 * normalises everything into the OfficeCLI argv.
 */

import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { formatToolResult } from '../types.js';
import { runOfficeCli, OfficeCliError, findOfficeCliBinary } from './spawn.js';
import { recordOfficeTouch } from '../../runtime/office-run.js';

const READ_SUBCOMMANDS = [
  'view',
  'get',
  'query',
  'raw',
  'validate',
  'dump',
  'get-marks',
  // Schema discovery — `help <format> [element]` returns the full property
  // catalogue for elements (slide, chart, table, theme, etc.). The agent
  // is supposed to call this before authoring anything beyond the
  // hard-coded recipes so it picks the right property names.
  'help',
  // Style preset library — synthetic verbs that DON'T shell out to
  // OfficeCLI. They read the bundled docs at apps/web/bin/styles/.
  // styles-list returns INDEX.md (topic → preset map); style returns
  // the style.md philosophy doc (palette + typography + structure)
  // for a single preset by directory name.
  'styles-list',
  'style',
] as const;
const EDIT_SUBCOMMANDS = [
  'create',
  'new',
  'add',
  'set',
  'remove',
  'move',
  'swap',
  'raw-set',
  'add-part',
  'import',
  'refresh',
  'batch',
  // Template fill: take a .docx/.xlsx/.pptx with {{key}} placeholders and a
  // JSON data file, produce a populated output. Major lever for getting
  // designed output without the agent having to hand-place every shape.
  'merge',
] as const;

const READ_INPUT = z.object({
  subcommand: z.enum(READ_SUBCOMMANDS).describe(
    'Which read-only verb to run. OfficeCLI-backed: view (outline/text/stats/issues/html/screenshot), get (node by path), query (CSS-like selector), raw (raw XML of a part), validate (schema check), dump (round-trippable JSON), get-marks (listing), help (schema discovery — file=<format>, args=[<element>] returns the property vocabulary). Style-library (local file reads, no binary call): styles-list (returns INDEX.md, the topic → preset map), style (file=<preset-directory>, returns the style.md philosophy doc for that preset).',
  ),
  file: z.string().describe('Absolute path to the .docx / .xlsx / .pptx file.'),
  args: z
    .array(z.string())
    .default([])
    .describe(
      'Positional args after the file. E.g. for "view" pass [mode] like ["outline"]; for "get" pass [path] like ["/body/p[1]"]; for "query" pass [selector] like ["table p:contains(\\"Revenue\\")"].',
    ),
  options: z
    .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
    .optional()
    .describe(
      'Flag map; entries render as --key value pairs. Booleans render as bare --flag. E.g. { format: "markdown" } → --format markdown.',
    ),
});

const EDIT_INPUT = z.object({
  subcommand: z.enum(EDIT_SUBCOMMANDS).describe(
    'Which mutating OfficeCLI subcommand to run. See the office skill for the full vocabulary: create/new (blank doc), add (insert element under parent path), set (modify properties at path), remove (delete at path), move (relocate), swap (exchange two paths), raw-set (direct XML edit), add-part (new document part), import (CSV/TSV → sheet), refresh (recalc TOC etc.), batch (JSON array of ops in one open/save cycle), merge (template fill: args=[<template-file>, <output-file>], JSON data piped on stdin).',
  ),
  file: z.string().describe('Absolute path to the .docx / .xlsx / .pptx file. Will be created when subcommand is create/new.'),
  args: z
    .array(z.string())
    .default([])
    .describe(
      'Positional args after the file. E.g. for "add" pass [parent-path]; for "set" pass [target-path]; for "swap" pass [path1, path2]; for "import" pass [parent-path, source-file].',
    ),
  options: z
    .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
    .optional()
    .describe(
      'Flag map; entries render as --key value pairs. Booleans render as bare --flag. Most mutations take property flags here (e.g. { text: "Hello", bold: true }).',
    ),
  stdin: z
    .string()
    .optional()
    .describe(
      'Piped to the binary on stdin. Used by `batch` (a JSON array of {command, args, options} objects) and occasionally by `set` with multi-line text bodies.',
    ),
});

function buildArgv(subcommand: string, file: string, args: string[], options?: Record<string, string | number | boolean>): string[] {
  const argv: string[] = [subcommand, file, ...args];
  if (options) {
    for (const [key, value] of Object.entries(options)) {
      if (value === false || value === undefined || value === null) continue;
      argv.push(`--${key}`);
      if (value !== true) argv.push(String(value));
    }
  }
  return argv;
}

/**
 * Style preset library is co-located with the OfficeCLI binary at
 * `<bin-dir>/styles/`. Path resolution walks up from
 * findOfficeCliBinary() so the same code works on Vercel (bundled
 * function) and local CLI (downloaded into apps/web/bin/).
 */
function stylesRoot(): string | null {
  const bin = findOfficeCliBinary();
  if (!bin) return null;
  const dir = join(dirname(bin), 'styles');
  return existsSync(dir) ? dir : null;
}

function readStylesIndex(): string {
  const root = stylesRoot();
  if (!root) {
    return JSON.stringify({
      error: 'styles_not_installed',
      hint: 'Run scripts/install-officecli.ts to fetch the styles library.',
    });
  }
  const indexPath = join(root, 'INDEX.md');
  if (!existsSync(indexPath)) {
    // List the directories anyway so the agent has a fallback.
    const dirs = readdirSync(root, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
    return JSON.stringify({
      error: 'index_md_missing',
      availablePresets: dirs,
    });
  }
  return readFileSync(indexPath, 'utf-8');
}

function readStyleDoc(directory: string): string {
  const root = stylesRoot();
  if (!root) {
    return JSON.stringify({
      error: 'styles_not_installed',
      hint: 'Run scripts/install-officecli.ts to fetch the styles library.',
    });
  }
  // Don't allow path traversal — only direct child directories.
  if (directory.includes('/') || directory.includes('..') || directory.includes('\\')) {
    return JSON.stringify({
      error: 'invalid_directory',
      hint: 'Pass only the preset folder name (e.g. "dark--investor-pitch"), no slashes.',
    });
  }
  const candidate = resolve(root, directory, 'style.md');
  if (!candidate.startsWith(root)) {
    return JSON.stringify({ error: 'invalid_directory' });
  }
  if (!existsSync(candidate)) {
    const available = readdirSync(root, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
    return JSON.stringify({
      error: 'preset_not_found',
      requested: directory,
      availablePresets: available,
    });
  }
  return readFileSync(candidate, 'utf-8');
}

/**
 * Default style preset per file extension. The preset's style.md is
 * inlined into the create/new response so the agent gets the palette
 * + typography without needing a separate styles-list/style call. The
 * agent can override by reading a different preset and supplying its
 * own theme set; the auto-pick is a starting point, not a lock.
 */
/**
 * Hard floors for "this file has had no real content added to it yet".
 * Measured against OfficeCLI v1.0.94 on darwin-arm64; tested with
 * `create` on each extension. Adding a small margin so renames and
 * single tiny edits don't false-positive.
 *
 *   docx blank:  4,394 bytes  → floor 5,500
 *   pptx blank:  8,391 bytes  → floor 9,500
 *   xlsx blank:  2,624 bytes  → floor 3,500
 *
 * The point of these floors is to catch the canonical agent failure:
 * agent calls a no-op edit (e.g. set on a non-existent path, or
 * add of an empty sheet) that succeeds, claims it added content,
 * and presents an empty file as the deliverable. By refusing to
 * upload below the floor, we force the F3 loop nudge to fire.
 */
const EMPTY_FLOORS_BY_EXT: Record<string, number> = {
  docx: 5500,
  pptx: 9500,
  xlsx: 3500,
};

interface EmptinessCheck {
  empty: boolean;
  bytes: number;
  floor: number;
  ext: string;
}

function checkFileEmptiness(filePath: string): EmptinessCheck | null {
  const ext = filePath.toLowerCase().split('.').pop() ?? '';
  const floor = EMPTY_FLOORS_BY_EXT[ext];
  if (floor === undefined) return null;
  let bytes = 0;
  try {
    bytes = statSync(filePath).size;
  } catch {
    return null;
  }
  return { empty: bytes <= floor, bytes, floor, ext };
}

function defaultPresetForFile(file: string): string | null {
  const ext = file.toLowerCase().split('.').pop();
  if (ext === 'pptx') return 'dark--investor-pitch';
  if (ext === 'docx') return 'light--minimal-corporate';
  // xlsx and the rest aren't typically design-led artifacts; leave the
  // agent on the generic data-table defaults.
  return null;
}

async function invoke(
  subcommand: string,
  file: string,
  args: string[],
  options?: Record<string, string | number | boolean>,
  stdin?: string,
): Promise<string> {
  const invokeStart = Date.now();
  console.log(`[office-tool] ENTER subcommand=${subcommand} file=${file} args=${JSON.stringify(args)}`);
  try {
    const result = await invokeInner(subcommand, file, args, options, stdin);
    console.log(`[office-tool] EXIT  subcommand=${subcommand} after ${Date.now() - invokeStart}ms`);
    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.log(`[office-tool] THROW subcommand=${subcommand} after ${Date.now() - invokeStart}ms: ${message}`);
    throw err;
  }
}

async function invokeInner(
  subcommand: string,
  file: string,
  args: string[],
  options?: Record<string, string | number | boolean>,
  stdin?: string,
): Promise<string> {
  // Synthetic style-library subcommands short-circuit the spawn path —
  // they're pure local file reads. Returning the markdown content as
  // the result's `data` field keeps the response shape consistent
  // with what OfficeCLI itself would produce.
  if (subcommand === 'styles-list') {
    return formatToolResult({ source: 'styles-index', markdown: readStylesIndex() });
  }
  if (subcommand === 'style') {
    const directory = file; // For `style`, `file` carries the preset folder name.
    return formatToolResult({
      source: 'style-doc',
      preset: directory,
      markdown: readStyleDoc(directory),
    });
  }

  // Snapshot file size *before* the edit so we can detect no-op edits
  // (commands that exit 0 but don't actually grow the file). This is
  // the in-loop signal that's far sharper than the end-of-call empty-
  // floor heuristic: an `add type=p` that grows a docx by 3 bytes is
  // almost certainly hitting the wrong path / missing required options
  // / silently dropping the option payload.
  const preEditBytes = (() => {
    try {
      return statSync(file).size;
    } catch {
      return -1; // File doesn't exist yet — expected for create/new.
    }
  })();

  try {
    const argv = buildArgv(subcommand, file, args, options);
    const result = await runOfficeCli({ argv, stdin });
    // OfficeCLI's --json envelope is `{ success, data }` or `{ success: false, error }`.
    // Surface the whole envelope so the agent can see both shape + content.
    let payload: unknown = result.data ?? { stdout: result.stdout };
    // Post-create design brief: a blank pptx/docx ships with default
    // placeholders. If the agent stops at create OR adds plain-text
    // content without picking a preset, the deliverable looks generic.
    // Instead of relying on the agent to follow the design loop, we
    // inline the relevant preset's style.md AND the styles index AND a
    // mandatory next-step list into the create response. The agent has
    // the design vocabulary in front of it from this point on; the
    // _required field name signals it's not optional.
    // Earlier versions inlined the full preset style.md + INDEX (~16 KB)
    // here. That gave palette + typography but output still looked
    // generic. Per the audit of github.com/iOfficeAI/OfficeCLI, the
    // load-bearing design rules live in skills/officecli-pptx/SKILL.md
    // and skills/morph-ppt/reference/pptx-design.md (NOT in style.md).
    // The single biggest visible quality gap is SHAPE DENSITY: upstream
    // builds use 50+ shapes per slide with text composed as TWO shapes
    // (filled bg + text shape with fill=none). Default agents emit
    // 4-8 shapes with text inside default placeholders. Swap the long
    // inline for a sharp brief that (1) routes to the specialized
    // SKILL the agent should load, and (2) embeds the load-bearing
    // rules verbatim so they apply even when the agent skips loading.
    let mandatoryInstructions: Record<string, unknown> | null = null;
    if ((subcommand === 'create' || subcommand === 'new') && payload && typeof payload === 'object') {
      const presetName = defaultPresetForFile(file);
      const ext = file.toLowerCase().split('.').pop();
      const specializedSkill =
        ext === 'pptx'
          ? 'officecli-pptx'
          : ext === 'docx'
          ? 'officecli-docx'
          : ext === 'xlsx'
          ? 'officecli-xlsx'
          : null;
      mandatoryInstructions = {
          status:
            'BLANK FILE CREATED — work is NOT complete. The default placeholders are not the deliverable.',
          step1_loadSpecializedSkill: specializedSkill
            ? `Call \`skill name=${specializedSkill}\` next. It returns the 40 KB design bible (type hierarchy, palette canon, motif commitment, Delivery Gate). Do this BEFORE adding any element. For fundraising / Series A-C / investor decks also load \`skill name=officecli-pitch-deck\`. For cross-slide animation also load \`skill name=morph-ppt\`.`
            : 'No specialized design bible for this file type; proceed with raw schema + presets.',
          step2_pickPreset: presetName
            ? `Default preset for this extension is \`${presetName}\`. Read it with \`office_read style file=${presetName}\` for hex codes + fonts, or browse alternatives with \`office_read styles-list\` and pick a different folder if the user asked for a different mood.`
            : null,
          step3_designRules_VISIBLE_QUALITY_GAP: {
            principle:
              'The largest gap between default-agent output and upstream-quality output is SHAPE DENSITY. A real designed slide has 30-50+ shapes, not 4-8. Default agents emit text-in-placeholder; designed decks compose every label as TWO shapes layered.',
            rules: [
              'Compose every text label as TWO shapes: (1) `office_edit add /slide[N] --type shape --prop preset=rect|roundRect --prop fill=<bg-hex>` for the background, then (2) `office_edit add /slide[N] --type shape --prop text="..." --prop fill=none --prop color=<fg-hex> --prop size=<pt> --prop bold=true` overlaid at the SAME x/y/width/height. The `fill=none` on the text shape is what makes colour read on the card behind it.',
              'Plan for 30+ shapes per content slide; 50+ on the cover. Most are decoration: 0.08-0.25cm thin colored bars, looped ellipse/dot clusters (`for i in 1..15`), filled rects at 0.2-0.5 opacity behind content, side-stripe bands on cards.',
              'Commit to ONE motif and carry it across every slide (numbered circles / single-side border band / diagonal accent strip / corner triangle / rounded image frames). Declare it before authoring: "## Motif: numbered circles in brand color". Without a motif the deck reads as templated.',
              'Type hierarchy floor: title ≥ 36pt bold; body ≥ 18pt; title ≥ 2× body. Min shape height ≈ font_pt × 0.05cm (18pt body needs ≥ 0.9cm; 60pt hero needs ≥ 3cm). Default placeholders violate this routinely.',
              'KPI fit math (big-number callouts like "$2.4B"): max font ≈ card_width_cm × denom, denom = 10 for 1-2 chars, 7 for 3-4 chars, 5 for 5+ chars.',
              'Grid math, never hand-picked x: for N cards across 33.87cm canvas with margin m + gap g, col_width = (33.87 - 2m - (N-1)g) / N. Margins ≥ 1.27cm, gaps ≥ 0.76cm, ≥ 20% negative space.',
              'Use `batch` (JSON array of ops on stdin) for any deck > 3 slides. Chain adds are 10× slower.',
            ],
            antiSlopChecklist: [
              'NEVER place a decorative line under slide titles — #1 AI-slide tell.',
              "Don't repeat the same layout across consecutive slides.",
              'Never center body text — left-align all paragraphs.',
              "Don't default to corporate blue. Stay on the preset's palette.",
              "Don't ship text-only slides — every slide carries a non-text visual.",
              "Don't style one slide and leave the rest plain — consistency-check before declaring done.",
            ],
            chosenPreset: presetName,
          },
          step4_deliveryGate: [
            'office_read view args=["issues"]   — overflow + alt text + formula errors',
            'office_read view args=["outline"]  — sanity-check every slide has content',
            'office_read validate                — OpenXML schema check',
            'office_read view args=["screenshot"] — render to PNG and verify mood matches preset',
            "Fix-verify loop up to 3 times. Only after all four pass is the file deliverable.",
          ],
          step5_deliverToUser:
            "Download delivery happens automatically at the END of your agent run — the system uploads each non-empty file you've touched to R2 and surfaces a download chip in chat. You do NOT call any explicit publish step. Every successful office_edit response includes `fileBytes` and `fileIsEmpty`; if `fileIsEmpty: true` after your edits, the artefact will NOT be delivered. Do not write a final answer claiming the file is ready while `fileIsEmpty` is still true. Once `fileIsEmpty` flips to false and the delivery gate passes, write a short user-facing reply describing what's inside (slide titles / sheet names) — the download chip is rendered for you.",
      };
    }
    // Auto-upload to R2 after every successful CONTENT-PRODUCING edit.
    // We deliberately skip `create` and `new` because they produce a
    // blank OOXML scaffold (8 KB pptx with "Click to add first slide");
    // delivering that as a download URL just tricks the user into
    // grabbing an empty file when the agent stops early. Letting the
    // chat panel stay empty until real content lands is honest signal:
    // "no deliverable produced yet". `refresh` and `add-part` also
    // don't guarantee user-visible content but typically come after
    // other edits, so we keep uploading on those.
    // On CLI we skip unless DEXTER_OFFICE_AUTO_UPLOAD=1 — `shouldAutoUpload`
    // gates both. Upload failures are logged but never throw: the edit
    // itself succeeded, so we still return the tool result.
    // Post-edit bookkeeping for content-producing subcommands.
    // We no longer upload to R2 here — the agent loop drains all
    // touched files at end-of-run for a single canonical delivery
    // (see src/runtime/office-run.ts). The tool now just:
    //   1. Records the file path in the run-scoped touch set so the
    //      drainer knows to upload it later.
    //   2. Measures emptiness inline and attaches `fileBytes` /
    //      `fileIsEmpty`. F6 in the agent loop watches `fileIsEmpty`
    //      to decide whether the agent is allowed to declare done.
    //   3. On empty files, sets a `_required` directive — same UX as
    //      before, the difference is only that no R2 PUT happens.
    const isContentProducing =
      (EDIT_SUBCOMMANDS as readonly string[]).includes(subcommand) &&
      subcommand !== 'create' &&
      subcommand !== 'new';
    // Subcommands that meaningfully *should* grow the file when they
    // succeed. `set`/`remove`/`move`/`swap`/`refresh`/`raw-set` may
    // legitimately produce small (or no) growth — exclude them from
    // the no-op detector to avoid false positives.
    const expectsByteGrowth =
      subcommand === 'add' ||
      subcommand === 'add-part' ||
      subcommand === 'import' ||
      subcommand === 'batch' ||
      subcommand === 'merge';
    const NO_OP_BYTE_THRESHOLD = 50;

    if (isContentProducing && existsSync(file)) {
      recordOfficeTouch(file);
      const postEditBytes = statSync(file).size;
      const delta = preEditBytes < 0 ? postEditBytes : postEditBytes - preEditBytes;

      // Diagnostic line — printed to dev server stdout so we can see
      // exactly what each office_edit invocation looked like and how
      // much (or little) it grew the file. Pair with [office-run]
      // touch lines to diagnose "agent claimed it added content but
      // the file is empty".
      console.log(
        `[office-edit] ${subcommand} ${file} args=${JSON.stringify(args)} ` +
          `bytes ${preEditBytes < 0 ? '(new)' : preEditBytes} → ${postEditBytes} (Δ${delta})`,
      );

      if (expectsByteGrowth && delta >= 0 && delta <= NO_OP_BYTE_THRESHOLD) {
        // Loud signal: this edit didn't actually add bytes. Almost
        // always means the option payload was dropped or the parent
        // path doesn't exist. The agent gets a `_required` directive
        // with the exact argv + delta so it can self-correct.
        mandatoryInstructions = {
          status: 'NO-OP EDIT — your last office_edit succeeded per OfficeCLI exit code but added essentially no bytes to the file. The command did not insert real content.',
          subcommand,
          file,
          argv,
          preEditBytes,
          postEditBytes,
          deltaBytes: delta,
          likelyCauses: [
            'You used a relative file path. Always use absolute paths (e.g. `/tmp/<name>.docx`); a relative path can resolve to the wrong cwd and a fresh blank doc gets created.',
            'The `--type` option was missing or mistyped. For docx use `--prop type=p|h1|h2|table|list`; for pptx use `--prop type=slide|shape|chart|table`; for xlsx use `--prop type=row|cell|column`.',
            'The `--text` / `--values` payload was empty or escaped wrong, so the element was added but with no visible content.',
            'The parent path you used does not exist. Call `office_read subcommand=view file=<absolute-path> args=["outline"]` to see the real element tree before guessing paths like `/body/p[3]` that may not exist yet.',
          ],
          recoverySteps: [
            'Run `office_read subcommand=view file=<ABSOLUTE-PATH> args=["outline"]` to confirm the parent path.',
            'Re-issue the office_edit with an ABSOLUTE path AND `--prop type=<element-kind>` AND a non-empty `--prop text=<content>` (or `--prop values=[...]` for rows).',
            'After the next edit, the response will include `fileBytes` and `deltaBytes`. Only treat it as success when `deltaBytes` > ~200 (real content adds at minimum a few hundred bytes).',
          ],
        };
      }

      const emptiness = checkFileEmptiness(file);
      if (emptiness) {
        if (emptiness.empty && !mandatoryInstructions) {
          mandatoryInstructions = {
            status:
              'FILE STILL EMPTY — the edit succeeded but the artefact has no user-visible content yet. Naming sheets / setting a layout / declaring a part is not adding content.',
            measuredBytes: emptiness.bytes,
            emptyFloor: emptiness.floor,
            nextSteps: [
              emptiness.ext === 'xlsx'
                ? 'Import data with `office_edit subcommand=import file=<path> args=[<sheet-path>, <csv-tsv-path>]` OR add rows/cells via `office_edit subcommand=add file=<path> args=[<sheet>] options={ type: "row", values: [...] }`. Renaming a sheet only changes its label — it does not insert data.'
                : emptiness.ext === 'pptx'
                ? 'Add slides with actual content via `office_edit subcommand=batch file=<path>` piping a JSON array of slide ops on stdin. Each slide needs a title + body text + (per skill rules) layered shapes. Adding a slide without setting `title`/`text`/shapes leaves it blank.'
                : 'Add paragraphs / headings / tables under /body via `office_edit subcommand=add file=<path> args=["/body"] options={ type: "p"|"h1"|"table", text: "...", ... }`. Setting layout properties alone produces no visible content.',
              'After adding content, do NOT declare done. Call `office_read view stats file=<path>` and confirm the cell/slide/paragraph count is non-trivial. THEN run the delivery gate (`view issues`, `validate`, `view screenshot`).',
            ],
            downloadSuppressed:
              'The chat UI will NOT surface a download link for this artefact until it contains real content. The user-facing answer must NOT claim the file is ready.',
          };
        }
        if (payload && typeof payload === 'object') {
          payload = {
            ...(payload as Record<string, unknown>),
            fileBytes: emptiness.bytes,
            fileIsEmpty: emptiness.empty,
            deltaBytes: delta,
          };
        }
      }
    }
    return formatToolResult(
      payload,
      mandatoryInstructions ? { mandatoryInstructions } : undefined,
    );
  } catch (err) {
    if (err instanceof OfficeCliError) {
      // Embed the parsed-or-raw stdout for context, plus the stderr message
      // OfficeCLI emitted, so the agent has enough signal to retry with a
      // different argument shape.
      return formatToolResult({
        error: err.message,
        exitCode: err.result.exitCode,
        stderr: err.result.stderr.trim().slice(0, 2000),
        partialStdout: err.result.stdout.trim().slice(0, 2000),
        command: err.command,
      });
    }
    const message = err instanceof Error ? err.message : String(err);
    return formatToolResult({ error: message });
  }
}

export const officeReadTool = new DynamicStructuredTool({
  name: 'office_read',
  description:
    'Read or inspect a Word/Excel/PowerPoint file via OfficeCLI. Read-only. Verbs: view, get, query, raw, validate, dump, get-marks, help (schema discovery), styles-list (returns the 51-preset design index), style (returns a specific preset\'s style.md). Returns structured JSON.',
  schema: READ_INPUT,
  func: async (input) => {
    return invoke(input.subcommand, input.file, input.args ?? [], input.options);
  },
});

export const officeEditTool = new DynamicStructuredTool({
  name: 'office_edit',
  description:
    "Create or modify a Word/Excel/PowerPoint file via OfficeCLI. Mutates disk. " +
    "When you call `create`/`new`, the response will include a `_required` block with the auto-picked design preset's palette + typography, the full styles index, and a 7-step mandatory checklist. READ THAT BLOCK before any further calls — applying the preset's colours and fonts is the difference between a designed deliverable and an empty placeholder file. " +
    "Verbs: create/new (start), add, set (use for /theme + element properties), remove, move, swap, raw-set, add-part, import (CSV/TSV → sheet), refresh (TOC etc.), batch (JSON array on stdin — strongly preferred for multi-slide authoring), merge (template fill).",
  schema: EDIT_INPUT,
  func: async (input) => {
    return invoke(input.subcommand, input.file, input.args ?? [], input.options, input.stdin);
  },
});

export const OFFICE_READ_DESCRIPTION = `
Read or inspect a Microsoft Office document (.docx / .xlsx / .pptx) via OfficeCLI.

## When to Use

- Extract the outline, plain text, statistics, or issues report from a Word/Excel/PowerPoint file.
- Query elements by CSS-like selector (e.g. "table p:contains('Revenue')").
- Fetch a specific element by path (e.g. "/body/p[1]" in Word, "/sheet[1]/cell[A1]" in Excel).
- Validate a file against the OpenXML schema.
- Render a file to HTML or PNG screenshot for preview.
- Dump a document subtree to a replayable JSON batch script.

## When NOT to Use

- To modify the file in any way (use office_edit).
- For PDF or Google Workspace files (OfficeCLI is OOXML-only).

## Subcommands

- view <file> <mode>     — mode ∈ { outline | text | stats | issues | html | screenshot }
- get <file> <path>      — return the element at the given path
- query <file> <selector> — CSS-like selectors with attribute, :contains, :has
- raw <file> <part>      — raw XML of a document part (default /document)
- validate <file>        — OpenXML schema check; flags violations
- dump <file> <path>     — serialize subtree to a replayable batch JSON
- get-marks <file>       — list watch-process marks (rarely used by agent)

Every call appends --json so the response is structured.
`.trim();

export const OFFICE_EDIT_DESCRIPTION = `
Create or modify a Microsoft Office document (.docx / .xlsx / .pptx) via OfficeCLI.

## When to Use

- Create a blank .docx / .xlsx / .pptx file.
- Add a heading, paragraph, table, slide, sheet, chart, or other element.
- Modify properties (text, formatting, alignment, cell value, slide title).
- Remove, move, or swap elements at given paths.
- Import CSV/TSV data into an Excel sheet.
- Refresh TOC, page numbers, or other derived fields.
- Run many mutations in one open/save cycle via batch.

## When NOT to Use

- For read-only inspection (use office_read).
- For PDF or Google Workspace files (OfficeCLI is OOXML-only).
- For the resident-process / watch-preview server modes — those are
  developer tools, not agent affordances.

## Subcommands

- create <file>          — create a blank Office document (alias: new)
- add <file> <parent>    — add a new element under the parent path
- set <file> <path>      — modify properties on the element at path
- remove <file> <path>   — delete the element at path
- move <file> <path>     — relocate; pass new parent via --to
- swap <file> <path1> <path2> — exchange two elements
- raw-set <file> <part>  — universal-fallback raw XML edit
- add-part <file> <parent> — create a new document part
- import <file> <parent> <source-file> — CSV/TSV into Excel sheet
- refresh <file>         — recalc derived values (TOC, page numbers, cross-refs)
- batch <file>           — JSON array of ops on stdin; one open/save cycle

Always pass property changes via the options map (rendered as --key value).
For complex multi-step authoring, prefer batch over a sequence of single calls.
`.trim();
