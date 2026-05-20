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
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { formatToolResult } from '../types.js';
import { runOfficeCli, OfficeCliError, findOfficeCliBinary } from './spawn.js';

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
function defaultPresetForFile(file: string): string | null {
  const ext = file.toLowerCase().split('.').pop();
  if (ext === 'pptx') return 'dark--investor-pitch';
  if (ext === 'docx') return 'light--minimal-corporate';
  // xlsx and the rest aren't typically design-led artifacts; leave the
  // agent on the generic data-table defaults.
  return null;
}

/** Safe read of a preset's style.md without the error-envelope wrapping
 * that readStyleDoc emits — used when we want raw markdown to inline. */
function loadStyleMd(directory: string): string | null {
  const root = stylesRoot();
  if (!root) return null;
  const candidate = resolve(root, directory, 'style.md');
  if (!candidate.startsWith(root) || !existsSync(candidate)) return null;
  return readFileSync(candidate, 'utf-8');
}

async function invoke(
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

  try {
    const result = await runOfficeCli({
      argv: buildArgv(subcommand, file, args, options),
      stdin,
    });
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
    if ((subcommand === 'create' || subcommand === 'new') && payload && typeof payload === 'object') {
      const presetName = defaultPresetForFile(file);
      const presetMarkdown = presetName ? loadStyleMd(presetName) : null;
      const stylesIndex = presetMarkdown ? readStylesIndex() : null;
      payload = {
        ...(payload as Record<string, unknown>),
        _required: {
          status:
            'BLANK FILE CREATED — work is NOT complete. A placeholder slide / empty body is not a deliverable.',
          mandatorySteps: [
            `1. Apply a design preset's palette + typography. Default for this extension: ${presetName ?? '(no design preset; raw data file)'}.`,
            '2. office_edit set /theme — apply the preset\'s heading + body fonts.',
            '3. office_edit batch — pipe a JSON array of slide/element adds on stdin (much faster than chained adds). Use the preset\'s hex colours for slide backgrounds and chart fills.',
            '4. office_read view file=<path> args=["issues"] — catches overflow, missing alt text, formula errors.',
            '5. office_read validate file=<path> — OpenXML schema check.',
            '6. office_read view file=<path> args=["screenshot"] — render to PNG and verify the result matches the preset\'s mood.',
            'Only after steps 1-6 pass is the file deliverable.',
          ],
          chosenPreset: presetName,
          ...(presetMarkdown
            ? {
                presetStyleMd: presetMarkdown,
                presetUsageNote:
                  'The presetStyleMd above contains the colour palette table (hex codes + roles) and typography table you must apply. Read it before adding slides. To pick a different preset, browse the stylesIndex below.',
              }
            : {}),
          ...(stylesIndex
            ? {
                stylesIndex,
                stylesIndexNote:
                  'Topic → preset directory map from upstream OfficeCLI. Pick a different directory only if the user explicitly asked for a different mood (e.g. light corporate instead of dark investor).',
              }
            : {}),
        },
      };
    }
    return formatToolResult(payload);
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
