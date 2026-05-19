---
name: office
description: Author, inspect, and modify Microsoft Office files (.docx / .xlsx / .pptx) via the OfficeCLI binary. Use when the user asks to create a slide deck, build a financial spreadsheet, draft a report, summarise/inspect an existing Office file, or run any element-level edit on Word/Excel/PowerPoint. Not for PDF or Google Workspace formats.
---

# OfficeCLI Skill

OfficeCLI is a fast OOXML toolkit bundled with Dexter. It exposes two
tools to you:

- `office_read` — read-only inspection: outlines, stats, queries, schema
  validation, raw XML, screenshot/HTML preview.
- `office_edit` — mutations: create blank docs, add/move/remove elements,
  set properties, import CSV/TSV into Excel, batch many ops.

Both tools take the same shape:
```
{ subcommand: <verb>, file: <absolute path>, args: [<positional>],
  options: { <flag>: <value> }, stdin: <optional piped JSON> }
```

You append `--json` automatically. Responses are `{ success, data }` on
success, or `{ error, exitCode, stderr, partialStdout, command }` on
failure — read `stderr` first when troubleshooting.

## Where to put output files

- **Always use absolute paths.** OfficeCLI doesn't quietly create parent
  directories.
- On the web (Vercel) runtime, only `/tmp/...` is writable — pick a
  unique path like `/tmp/dexter-<uuid>.pptx`.
- On the local CLI, `.dexter/exports/` or `/tmp/` is fine.
- After authoring, end the conversation with a clear path so the user
  knows where to download/open it.

## Subcommand vocabulary

### office_read

| subcommand | args | what it does |
|-----------|------|--------------|
| `view` | `[mode]` | mode ∈ `outline` (heading tree) / `text` (plain text) / `stats` (word, slide, sheet counts) / `issues` (text overflow, missing alt text, formula errors) / `html` (rendered preview) / `screenshot` (PNG path) |
| `get` | `[path]` | Return the element at the given OfficeCLI path, e.g. `/body/p[1]` (Word), `/sheet[1]/row[1]/cell[1]` (Excel), `/slide[2]/shape[1]` (PowerPoint). Defaults to `/`. |
| `query` | `[selector]` | CSS-like selector across the document. Supports `[attr=value]`, `:contains("text")`, `:has(child)`. E.g. `"table p:contains(\"Revenue\")"`. |
| `raw` | `[part]` | Raw XML of a document part. Defaults to `/document` (Word). Useful when no schema-aware op exists. |
| `validate` | — | Run OpenXML schema validation. Returns list of violations with severity. |
| `dump` | `[path]` | Serialize the subtree at path into a replayable batch JSON. Defaults to `/` (whole document). |
| `get-marks` | — | List watch-process marks. Rarely needed by an agent. |

### office_edit

| subcommand | args | what it does |
|-----------|------|--------------|
| `create` / `new` | — | Create a blank `.docx` / `.xlsx` / `.pptx` from the file's extension. |
| `add` | `[parent-path]` | Add an element under `parent-path`. The element kind comes from `--type` (e.g. `--type heading`, `--type paragraph`, `--type slide`, `--type sheet`, `--type cell`, `--type chart`). Property flags follow (e.g. `--text "Hello" --level 1`). |
| `set` | `[target-path]` | Modify properties on the element at `target-path`. E.g. `--text "Q4 Revenue"`, `--bold true`, `--alignment center`. |
| `remove` | `[target-path]` | Delete the element at path. |
| `move` | `[target-path]` | Relocate the element. Pass new parent via `--to /body/section[2]` or sibling-index via `--after path` / `--before path`. |
| `swap` | `[path1, path2]` | Exchange two elements (e.g. swap two slides). |
| `raw-set` | `[part]` | Replace raw XML in a document part. Universal fallback for anything not covered by a schema-aware op. Pipe XML on stdin. |
| `add-part` | `[parent]` | Create a new document part (custom XML, image, embedded chart data). Returns the relationship ID for later `raw-set`. |
| `import` | `[parent-path, source-file]` | Import a CSV/TSV file into an Excel sheet at parent-path. |
| `refresh` | — | Recompute derived values: TOC page numbers, PAGE/NUMPAGES, cross-references. Word-only on Windows; no-op on Linux/Mac. |
| `batch` | — | Run an array of `{command, args, options}` ops in one open/save cycle. Pipe the JSON array via `stdin`. Use for multi-step authoring — far faster than a chain of `add` calls. |

## Recipes

### Create a quick research deck

```
office_edit subcommand=create file=/tmp/tsmc-thesis.pptx
office_edit subcommand=add file=/tmp/tsmc-thesis.pptx args=["/"] options={ type: "slide", title: "TSMC Q4 thesis" }
office_edit subcommand=add file=/tmp/tsmc-thesis.pptx args=["/slide[2]"] options={ type: "bullet", text: "Foundry pricing power intact" }
office_read  subcommand=view  file=/tmp/tsmc-thesis.pptx args=["outline"]
```

For 5+ ops, prefer `batch` with a single open/save cycle.

### Read a spreadsheet

```
office_read subcommand=view  file=/path/to/model.xlsx args=["stats"]
office_read subcommand=query file=/path/to/model.xlsx args=["sheet:contains(\"Revenue\")"]
```

### Run a sanity pass before delivery

```
office_read subcommand=view     file=/tmp/report.docx args=["issues"]
office_read subcommand=validate file=/tmp/report.docx
```

Both should return zero/few issues before you ship the file to the user.

### Batch authoring (recommended for any multi-step doc)

Pipe a JSON array on `stdin`:

```json
[
  { "command": "add", "args": ["/"], "options": { "type": "slide", "title": "Cover" } },
  { "command": "add", "args": ["/"], "options": { "type": "slide", "title": "Thesis" } },
  { "command": "add", "args": ["/slide[2]"], "options": { "type": "bullet", "text": "..." } }
]
```

This is ~10× faster than the equivalent sequence of individual `add` calls because OfficeCLI only opens and saves the file once.

## Failure modes

- `OfficeCLI binary not found` — the binary wasn't bundled; report to the
  user and stop. Don't try to install it from inside a tool call.
- `Unrecognized command or argument …` — argv shape is wrong. Always put
  the file path AFTER the subcommand (`subcommand=view file=...`), not
  before it. The `--json` flag is appended for you.
- `path does not exist` — the file or the OfficeCLI path inside the file
  is wrong. Run `office_read view ... outline` to see the available
  paths.
- Validation failures from `validate` — fix the offending element before
  saving the final deliverable. Most violations come from corrupted
  formula cells or missing relationships introduced by raw-set.

## Disclaimer

OfficeCLI is third-party Apache 2.0 software (iOfficeAI/OfficeCLI). It
runs as a native binary; agent commands run with the same privileges as
the agent process.
