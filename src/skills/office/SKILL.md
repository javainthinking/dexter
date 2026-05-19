---
name: office
description: Author and edit Microsoft Office files (.docx / .xlsx / .pptx) — slide decks, financial reports, Excel models — with real visual design (themes, fonts, charts, tables, conditional formatting) via the OfficeCLI binary. Use when the user asks to create a research deck, draft a report, build a model, summarise an existing Office file, or run any element-level edit. Not for PDF or Google Workspace formats.
---

# OfficeCLI Skill

OfficeCLI is a fast OOXML toolkit bundled with Dexter. It exposes two
tools to you:

- `office_read` — read-only inspection: outlines, stats, queries,
  schema discovery, schema validation, raw XML, screenshot/HTML preview.
- `office_edit` — mutations: create blank docs, add/move/remove
  elements, set properties, import CSV/TSV into Excel, batch many ops,
  merge templates.

Both tools take the same shape:
```
{ subcommand: <verb>, file: <absolute path>, args: [<positional>],
  options: { <flag>: <value> }, stdin: <optional piped JSON> }
```

`--json` is appended automatically. Responses are `{ success, data }`
on success, or `{ error, exitCode, stderr, partialStdout, command }`
on failure — read `stderr` first when troubleshooting.

## Design-first authoring

**Default plain text is the wrong default.** A deck dropped to the user
is judged on layout, typography, colour, and visual hierarchy — not on
which strings appear on which slides. Before authoring anything beyond
a one-off scratch file, follow this loop:

1. **Discover the property vocabulary** for the element you're about to
   create via `office_read help`. Example: before adding a slide, run
   `office_read subcommand=help file=pptx args=["slide"]` to see every
   slide property (background, layout, transition, etc.). For a chart:
   `office_read subcommand=help file=pptx args=["chart"]`.
2. **Pick a theme** before you pick content. Set heading + body fonts
   on `/theme` and apply scheme colours throughout (see the design
   system below).
3. **Pick the right layout per slide** — `Title Slide`, `Title and
   Content`, `Two Content`, `Section Header`, `Comparison`, `Blank`.
   Set `--prop layout="Title Slide"` on add.
4. **Position and size**. Slide elements take `anchor=x,y,w,h` (cm-
   based) or `anchor=<named token>`. Chart axes, table widths, image
   sizes all benefit from explicit dimensions.
5. **Use charts/tables/sparklines for numbers**, not paragraphs. Excel
   has 150+ formulas, pivot tables, conditional formatting, databars,
   colorscales, iconsets, and sparklines — reach for them.
6. **Run the design pass** before declaring done: `office_read view
   issues` (catches overflow + missing alt text + formula errors) +
   `office_read validate` (schema check).

## Where to put files

- **Always use absolute paths.** OfficeCLI doesn't auto-create parents.
- On the web (Vercel) runtime, only `/tmp/...` is writable.
- On local CLI, `.dexter/exports/` or `/tmp/` works.
- Output to a unique filename like `/tmp/dexter-<topic>-<date>.pptx`.

## Tool subcommand vocabulary

### office_read

| subcommand | args | what it does |
|-----------|------|--------------|
| `view` | `[mode]` | mode ∈ `outline` (heading tree) / `text` (plain text) / `stats` (counts) / `issues` (overflow, missing alt text, formula errors) / `html` (rendered preview) / `screenshot` (PNG path) |
| `get` | `[path]` | Return the element at the given path. Defaults to `/`. |
| `query` | `[selector]` | CSS-like selector. `[attr=value]`, `:contains("text")`, `:has(child)`. |
| `raw` | `[part]` | Raw XML of a document part. |
| `validate` | — | OpenXML schema validation. |
| `dump` | `[path]` | Round-trippable batch JSON for the subtree. |
| `help` | `[element]` | **Schema discovery.** `file` is the format (`docx`/`xlsx`/`pptx`/`all`). `args=[element]` returns the property catalogue for that element. Always call this before authoring with unfamiliar properties. |

### office_edit

| subcommand | args | what it does |
|-----------|------|--------------|
| `create` / `new` | — | Blank doc derived from file extension. |
| `add` | `[parent-path]` | Add an element under `parent-path`. Element kind via `--type` (slide / paragraph / table / chart / cell / picture / textbox / shape / sheet / row / column / sparkline). |
| `set` | `[target-path]` | Modify properties at path. |
| `remove` | `[target-path]` | Delete the element. |
| `move` | `[target-path]` | Relocate. `--to <new-parent>` or `--after path` / `--before path`. |
| `swap` | `[path1, path2]` | Exchange two elements. |
| `raw-set` | `[part]` | Raw XML edit. Universal fallback. Pipe XML on stdin. |
| `add-part` | `[parent]` | Create a new document part (custom XML, image). |
| `import` | `[parent-path, source-file]` | Import CSV/TSV into Excel sheet. |
| `refresh` | — | Recompute TOC, page numbers, cross-references (Word-only on Windows). |
| `batch` | — | Pipe a JSON array of `{command, args, options}` on stdin; one open/save cycle. |
| `merge` | `[output-file]` | Template fill: `file` is the template with `{{key}}` placeholders; `args[0]` is the output; pipe JSON data on stdin. |

## Default design system

Use these defaults unless the user asks for something specific. They
match the financial-research aesthetic and read well in both light
projection and dark screen viewing.

### Typography
- **Heading**: `headingFont="Inter Display"` or `"Source Serif 4"` for
  reports.
- **Body**: `bodyFont="Inter"`.
- **CJK**: `headingFont.ea="Noto Sans CJK SC"` / `bodyFont.ea="Noto Sans
  CJK SC"` for Chinese content. `"Yu Gothic"` on Windows / Mac.
- **Monospace (formulas, tickers)**: `JetBrains Mono` or `Source Code Pro`.

### Colour palette
Use scheme colours so the theme stays consistent:
- `accent1` — primary brand (recommend `#2D7E6E` emerald or `#0E4D9B` blue
  for financial decks)
- `accent2` — secondary (a desaturated complement)
- `accent3-6` — categorical chart colours
- `dark1` — text on light backgrounds
- `light1` — backgrounds (`#FFFFFF` light mode, `#1F2126` dark mode)

For raw hex on `background` / fills:
- Light: `#FFFFFF` slide bg, `#0F172A` text, `#2D7E6E` accent
- Dark:  `#1F2126` slide bg, `#F4F4F5` text, `#4FCBA8` accent

For charts comparing performance vs benchmark:
- Up / positive: `#EF4444` (per A-share convention) or `#10B981`
  (per Western convention) — ask the user which they want
- Down / negative: the opposite

### Slide layout
- 16:9 (`presentation` already defaults to widescreen)
- Title slide: huge serif headline, small subtitle, accent rule
- Content slides: title + body, ample whitespace, ≤ 5 bullets
- Chart slides: chart fills 60–70% of slide, title above, takeaway
  caption below

### Table styling
- Banded rows: `--prop banded=true`
- Header style: bold, background `accent1` at 15% opacity, text `dark1`
- Cell number format: `--prop numFmt="#,##0"` / `"0.00%"` / `"$#,##0"`
- Borders: subtle 0.5pt grey (`#D1D5DB`)

### Chart defaults (financial)
- `dispunits=thousands` for revenue / cash flow charts (auto-divides)
- `dispunits=millions` for market cap / asset charts
- `valaxisvisible=true`, `catvisible=true`
- `areafill` for series: derive from accent palette
- Anchor: `2cm,3.5cm,22cm,12cm` for a slide-filling chart
- Show data labels for ≤ 10 categories; hide for time-series

### Excel design defaults
- Number formats applied per column, not per cell
- `conditionalformatting` with `databar` on % columns, `colorscale` on
  delta columns
- `sparkline` in a summary column for tickers / KPIs
- Freeze top row + first column: `--prop freezePane="B2"`
- Banded rows on data ranges
- Use `pivottable` for multi-dimensional summaries instead of formulas

## Recipes

### Designed research deck (5–8 slides)

Use `batch` for any deck with > 3 slides — much faster than chained
`add` calls. Outline:

1. Create blank: `office_edit subcommand=create file=/tmp/<topic>.pptx`
2. Set theme (one shot via `set` on `/theme`):
   ```
   office_edit subcommand=set file=/tmp/<topic>.pptx args=["/theme"]
     options={
       headingFont: "Source Serif 4",
       bodyFont: "Inter",
       "headingFont.ea": "Noto Sans CJK SC",
       "bodyFont.ea": "Noto Sans CJK SC"
     }
   ```
3. Add slides via `batch` with the layout per slide:
   ```json
   [
     { "command": "add", "args": ["/"], "options": {
         "type": "slide", "layout": "Title Slide",
         "title": "TSMC Q4 thesis", "background": "#0F172A" } },
     { "command": "add", "args": ["/"], "options": {
         "type": "slide", "layout": "Section Header",
         "title": "Bull case" } },
     { "command": "add", "args": ["/"], "options": {
         "type": "slide", "layout": "Title and Content",
         "title": "Foundry pricing power", "text": "..." } }
   ]
   ```
4. Add a chart to a chart slide:
   ```
   office_edit subcommand=add file=/tmp/<topic>.pptx args=["/slide[4]"]
     options={
       type: "chart", chartType: "column",
       anchor: "2cm,3.5cm,22cm,12cm",
       title: "Revenue mix by segment",
       dispunits: "thousands",
       valaxisvisible: true,
       areafill: "2D7E6E-4FCBA8:90"
     }
   ```
5. Sanity pass:
   - `office_read view issues file=/tmp/<topic>.pptx`
   - `office_read validate file=/tmp/<topic>.pptx`
   - `office_read view screenshot file=/tmp/<topic>.pptx` to verify
     visually before declaring done

### Designed equity research report (.docx)

1. Create blank.
2. Set theme fonts (serif heading, sans body, CJK fonts if Chinese
   content).
3. Add cover section (`add /body --type section --titlePage true`) with
   serif title, ticker subtitle, date, analyst.
4. Add TOC: `add /body --type toc --levels 3`.
5. Add headings (`Heading 1` / `Heading 2`) per section.
6. Tables for financial metrics — set column widths, header style,
   banded rows.
7. Embedded charts where prose would dilute the point.
8. Footer with disclaimer (`add /body --type footer --text "For research
   only — not investment advice."`).
9. Watermark "DRAFT" until finalised: `add /body --type watermark
   --text "DRAFT" --opacity 0.15`.
10. `refresh` (on Windows builds) to recompute TOC.
11. `view issues` + `validate`.

### Designed model spreadsheet (.xlsx)

1. Create blank.
2. Set sheet names (`set /sheet[1] --prop name="Revenue"`).
3. Import CSV/TSV data: `import /sheet[1] /path/to/data.csv`.
4. Number-format the value columns: `set /sheet[1]/column[B:E] --prop
   numFmt="$#,##0"`.
5. Header row: `set /sheet[1]/row[1] --prop bold=true --prop
   background=accent1`.
6. Conditional formatting for delta columns:
   ```
   add /sheet[1] --type conditionalformatting --range "F2:F100"
     --prop kind=colorscale --prop scale=red-yellow-green
   ```
7. Sparklines for trend columns:
   ```
   add /sheet[1] --type sparkline --range "B2:E100" --target "G2:G100"
     --prop kind=line
   ```
8. Freeze panes: `set /sheet[1] --prop freezePane="B2"`.
9. Banded rows: `set /sheet[1] --prop bandedRows=true`.
10. `view issues` + `validate`.

### Quick template-based document

When the user has a known template (`.docx` / `.pptx` with `{{key}}`
placeholders) and just wants to fill it with data:

```
office_edit subcommand=merge file=/templates/research-cover.pptx args=["/tmp/out.pptx"]
  stdin={"company": "TSMC", "ticker": "2330.TW", "date": "2026-05-20",
         "thesis": "Foundry pricing power..."}
```

## Failure modes

- `OfficeCLI binary not found` — binary wasn't bundled; report to the
  user and stop. Don't try to install from a tool call.
- `Unrecognized command or argument …` — argv shape wrong. The file
  path goes AFTER the subcommand; `--json` is appended for you. Run
  `office_read help` for the right argument names.
- `path does not exist` — wrong file or wrong OfficeCLI path inside
  it. Run `office_read view outline` to see available paths.
- `Property X not recognised` — call `office_read help <format>
  <element>` to see the supported property names and aliases.
- Validation failures from `validate` — fix before delivery. Most
  violations are corrupted formula cells or missing relationships
  introduced by `raw-set`.

## Disclaimer

OfficeCLI is third-party Apache 2.0 software (iOfficeAI/OfficeCLI). It
runs as a native binary; agent commands run with the same privileges as
the agent process.
