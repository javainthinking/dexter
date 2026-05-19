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
import { formatToolResult } from '../types.js';
import { runOfficeCli, OfficeCliError } from './spawn.js';

const READ_SUBCOMMANDS = ['view', 'get', 'query', 'raw', 'validate', 'dump', 'get-marks'] as const;
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
] as const;

const READ_INPUT = z.object({
  subcommand: z.enum(READ_SUBCOMMANDS).describe(
    'Which read-only OfficeCLI subcommand to run. See the office skill for which to pick: view (outline/text/stats/issues/html/screenshot), get (node by path), query (CSS-like selector), raw (raw XML of a part), validate (schema check), dump (round-trippable JSON), get-marks (listing).',
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
    'Which mutating OfficeCLI subcommand to run. See the office skill for the full vocabulary: create/new (blank doc), add (insert element under parent path), set (modify properties at path), remove (delete at path), move (relocate), swap (exchange two paths), raw-set (direct XML edit), add-part (new document part), import (CSV/TSV → sheet), refresh (recalc TOC etc.), batch (JSON array of ops in one open/save cycle).',
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

async function invoke(
  subcommand: string,
  file: string,
  args: string[],
  options?: Record<string, string | number | boolean>,
  stdin?: string,
): Promise<string> {
  try {
    const result = await runOfficeCli({
      argv: buildArgv(subcommand, file, args, options),
      stdin,
    });
    // OfficeCLI's --json envelope is `{ success, data }` or `{ success: false, error }`.
    // Surface the whole envelope so the agent can see both shape + content.
    return formatToolResult(result.data ?? { stdout: result.stdout });
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
    'Read or inspect a Word/Excel/PowerPoint file via OfficeCLI. Returns structured JSON. Use for: extracting outlines/text/stats, querying elements by CSS-like selector, fetching a node by path, viewing raw XML, running a schema validation, or dumping a round-trippable batch script. Read-only — does not modify the file.',
  schema: READ_INPUT,
  func: async (input) => {
    return invoke(input.subcommand, input.file, input.args ?? [], input.options);
  },
});

export const officeEditTool = new DynamicStructuredTool({
  name: 'office_edit',
  description:
    'Create or modify a Word/Excel/PowerPoint file via OfficeCLI. Returns structured JSON describing what changed. Use for: creating a blank file, adding/removing/moving elements at a path, setting properties, swapping two elements, importing CSV/TSV into a sheet, refreshing derived fields (TOC, page numbers), or batching many ops in one open/save cycle. Mutates the file on disk.',
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
