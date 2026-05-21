# Blog i18n — Internationalization Guide

**Status:** living document
**Audience:** anyone writing or translating a PickSkill blog post

This document explains how blog content interacts with the eight
supported locales (en / fr / de / es / ja / ko / zh-CN / zh-TW), and
the workflow for translating a post.

For broader i18n (UI strings, metadata, language switcher), see the
in-app dictionaries at `apps/web/app/[lang]/dictionaries/`. The blog
shares that locale machinery — same `locales` array, same hreflang
helper (`lib/i18n/seo.ts`), same OG-locale and BCP-47 maps.

---

## 1. What's locale-aware out of the box

| Surface | Locale-aware? | Mechanism |
|---|---|---|
| URLs (`/blog/<slug>` vs `/zh-CN/blog/<slug>`) | ✓ | `app/[lang]/blog/` segment |
| Meta title prefix + suffix | partial | English shell ("— PickSkill"); body title from the post itself |
| Meta description | per content | English source unless a translation exists |
| Canonical URL | ✓ | `generateAlternatesMetadata` per locale |
| hreflang `alternates.languages` map | ✓ | All 8 locales + `x-default`, every request |
| OG `locale` / `alternateLocale` | ✓ | `localeOg` map (en_US, zh_CN, …) |
| JSON-LD `inLanguage` | ✓ | Reflects the **served body's** language, not the URL's locale |
| Sitemap entries | ✓ | One per (locale × post) with hreflang alternates |
| Reading-time + dates | locale-aware format | `toLocaleDateString` per render locale |
| Surrounding UI chrome (TopBar, nav, footer) | ✓ | Dictionary keys in `app/[lang]/dictionaries/*.json` |
| **Post body text** | **opt-in per post** | English source is the canonical; translations are file-overrides |

The "post body text" line is the workflow this document is about.
Everything else just works.

---

## 2. Content file layout

```
apps/web/content/blog/
├── what-is-dcf.md              ← English source (canonical)
├── what-is-dcf/                ← Post-specific assets (image prompts, etc.)
│   └── _image-prompt.md
├── zh-CN/                      ← Translated variants live here
│   └── what-is-dcf.md          ← Optional: zh-CN translation
└── ja/
    └── what-is-dcf.md          ← Optional: ja translation
```

**The English file at the top level is the source of truth.** Every
post starts there. Translation files at `<locale>/<slug>.md` are
optional overrides — the loader falls back to the English source when
a translation is absent.

This means:

- A user opening `/zh-CN/blog/what-is-dcf` with only the English
  source present sees the **English body**, but the URL stays
  `/zh-CN/...`. The `BlogPosting` JSON-LD's `inLanguage` field is
  honest about this: it reports `en`, not `zh-CN`, telling AI
  crawlers what they actually got.
- When a `content/blog/zh-CN/what-is-dcf.md` file lands, the same URL
  serves the Chinese body, and `inLanguage` flips to `zh-CN`. No code
  change needed.

This pattern is intentional — it lets us publish English-first and
translate the highest-traffic posts incrementally without breaking
URLs or returning 404s for untranslated locales.

---

## 3. Translation workflow

When you decide to translate a post (typically the highest-traffic
ones first — see `apps/web/docs/blog-strategy.md` §4 Phase 4):

1. **Create the locale directory** under `apps/web/content/blog/<locale>/`
   if it doesn't exist yet (e.g. `content/blog/zh-CN/`).
2. **Copy the English source** as a starting point:
   `cp content/blog/what-is-dcf.md content/blog/zh-CN/what-is-dcf.md`
3. **Translate the body.** Keep frontmatter keys in English (they're
   metadata, not display text — `title`, `description`, `pillar`,
   `tags`, etc.). Translate the *values* where they're user-visible
   (title, description, hero alt text, FAQ questions/answers).
4. **Do NOT machine-translate.** The brand guideline at the top of
   blog-strategy.md applies: translation quality should match English
   copywriting. Idioms, hedge words, technical terms — all need
   judgment.
5. **Optional: leave a translator credit** in frontmatter:
   ```yaml
   translator:
     name: Lin Wei
     locale: zh-CN
   ```
   (No code reads this today; it just documents authorship for the
   future translator-bio surface.)
6. **Check FAQ structure.** The FAQ extractor (`extractFaq` in
   `lib/blog.ts`) needs the same Q/A pattern as English:
   ```markdown
   ## FAQ
   
   **问题一?**
   答案段落…
   
   **问题二?**
   答案段落…
   ```
   The heading must be exactly `## FAQ` (the regex anchors on the
   English word). If a translator prefers `## 常见问题`, update the
   regex in `lib/blog.ts:extractFaq` to be locale-aware first.

7. **Don't translate the slug.** URLs stay as `/zh-CN/blog/what-is-dcf`
   not `/zh-CN/blog/什么是-dcf`. Stable slugs across locales keep
   inbound links unbroken and let `alternates.languages` map correctly.

8. **Verify locally.** `bun run --cwd apps/web dev`, visit
   `/zh-CN/blog/what-is-dcf`, confirm:
   - Body is Chinese
   - `<html lang="zh-CN">` on the post page
   - View source: BlogPosting JSON-LD includes `"inLanguage": "zh-CN"`
   - `<link rel="canonical" href="…/zh-CN/blog/what-is-dcf">`

---

## 4. What to translate vs. leave English

Use judgment. Rough guide:

| Element | Translate? |
|---|---|
| Title, description | ✓ |
| Body prose | ✓ |
| Hero alt text | ✓ |
| FAQ questions + answers | ✓ |
| Code blocks | ✗ — code is universal |
| Technical terms with no native equivalent (WACC, DCF, etc.) | ✗ — keep in English; explain on first use |
| Tag values | ✗ — tags are slugs used in URL filters; keep English |
| Author bio | ✓ (if meaningful in the target locale) |
| Outbound links to authority sources (SEC, Damodaran) | ✗ — link to the canonical English source unless an official localized version exists |
| Inline product names (PickSkill, ChatGPT) | ✗ — brand names |

---

## 5. SEO & GEO implications

### Why `inLanguage` matters

AI search engines (ChatGPT web search, Perplexity, Google AIO) use
the JSON-LD `inLanguage` field — not just the URL prefix — to decide
which language the content is "actually" in. Two failure modes the
current setup avoids:

- **English content at a localized URL with `inLanguage: zh-CN`.**
  AI crawler ingests as Chinese; user asks in Chinese; crawler cites
  this URL; user clicks; page is English. Trust loss. We don't do this.
- **Translated content at a localized URL with `inLanguage: en`.** AI
  crawler ingests as English; Chinese users never see the citation;
  translation effort is wasted. We don't do this either.

The pattern (file-presence determines `inLanguage`) keeps both ends
honest automatically.

### hreflang correctness

Every post emits `alternates.languages` with all 8 locales + `x-default`,
**regardless of whether each locale has a translated file**. This is
correct: hreflang declares "the same content exists at these URLs,"
and the URL resolves whether or not the body has been translated yet
(falling back to English). Google + Bing handle this cleanly — they'll
prefer the user's locale URL when matched, and the fallback is just
an English page served at a non-`/en/` URL, which is acceptable.

If we ever want stricter behavior (return 404 for untranslated
locales), the loader would need a `requireTranslation` flag and the
sitemap would need to filter — currently neither does.

### FAQPage schema is per-locale

The FAQPage JSON-LD emitted by the post route uses the same
`inLanguage` field as BlogPosting. AI crawlers extract Q&A pairs in
the body's actual language, citing them in matching-language user
queries. Translated FAQ blocks are heavy investments with outsized
GEO returns — prioritize them.

---

## 6. Locale-aware OG cards

Open Graph treats locale differently from BCP-47. We maintain both
maps in `lib/i18n/locales.ts`:

```ts
localeBcp47['zh-CN'] === 'zh-CN'  // hreflang, JSON-LD inLanguage
localeOg['zh-CN']    === 'zh_CN'  // og:locale (underscore form)
```

Every post page emits:

- `og:locale`: the user's current locale in `xx_YY` form
- `og:locale:alternate`: every OTHER supported locale in the same form

This tells Facebook/LinkedIn crawlers to fetch the localized variants
when the post is shared from a different language than it was first
crawled in. Practical effect: a LinkedIn user in Japan who shares a
post that was first scraped in English gets the Japanese body in their
preview card (once the JP translation exists).

---

## 7. Sitemap behaviour

`app/sitemap.ts` emits one entry per (locale × post) pair, with the
full `alternates.languages` map on each entry. This is the **correct
hreflang structure** — Google's docs explicitly recommend the
alternates appear on every URL, not just the canonical one.

A locale-aware loader change does NOT change the sitemap. The sitemap
is the *promise* that the URLs exist; the loader fulfills the promise
either with translated content or with English fallback.

---

## 8. Open questions / future work

| # | Question | Status |
|---|---|---|
| Q1 | Should the FAQ extractor accept localized `## FAQ` headings (e.g. `## 常见问题`)? | Deferred until we have first translated post |
| Q2 | Should the loader hard-fail on missing translation for explicit-only locales? | Defer — current fallback behavior is fine |
| Q3 | Should we publish a `/sitemap-blog.xml` separately from the main sitemap? | Defer — current single sitemap is small enough |
| Q4 | Translator credit byline in author block? | Defer until we have a translator |
| Q5 | Auto-translate-via-AI workflow with human review pass? | Strategy doc D5 — defer |

---

## 9. Quick reference

**Add a translated variant of a post:**
```bash
# from apps/web/
mkdir -p content/blog/zh-CN
cp content/blog/what-is-dcf.md content/blog/zh-CN/what-is-dcf.md
$EDITOR content/blog/zh-CN/what-is-dcf.md   # translate body, keep frontmatter keys English
bun run dev   # verify at /zh-CN/blog/what-is-dcf
```

**Verify a post serves correctly per locale:**
```bash
curl -s http://localhost:3000/blog/what-is-dcf | grep -E 'inLanguage|canonical|<title>' | head -5
curl -s http://localhost:3000/zh-CN/blog/what-is-dcf | grep -E 'inLanguage|canonical|<title>' | head -5
```

The second command's `inLanguage` value tells you immediately whether
you're serving English fallback (`en`) or the Chinese translation
(`zh-CN`).

**Remove a translation (revert to English fallback):**
Just delete the file at `content/blog/<locale>/<slug>.md`. The loader
auto-falls back; the sitemap entry remains; URLs keep working.
