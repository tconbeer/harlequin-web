# AGENTS.md

This file provides guidance to coding agents (Claude Code, etc.) when working with code in this repository.

## Overview

This is the source for [harlequin.sh](https://harlequin.sh), the marketing site and documentation for [Harlequin](https://github.com/tconbeer/harlequin) (a SQL IDE for the terminal). SvelteKit + TailwindCSS + MDSveX, deployed on Vercel via `@sveltejs/adapter-vercel`.

Most changes to this repo are documentation edits — adding or editing markdown under `src/docs/`.

## Commands

```bash
pnpm i           # install (also installs the git pre-commit hook)
pnpm dev         # dev server on localhost:5173
pnpm build       # production build
pnpm preview     # serve the production build locally
pnpm test        # vitest run  (runs on pre-commit)
pnpm format      # prettier --write with svelte/organize-imports/tailwindcss plugins
pnpm lint        # prettier --check && eslint  (runs on pre-commit)
pnpm check       # svelte-check against tsconfig.json
pnpm themes      # re-optimize the SVG theme screenshots in src/lib/assets/themes
```

`pnpm lint` and `pnpm test` run as pre-commit hooks (`@fastify/pre-commit`), so run `pnpm format` before committing. `.github/workflows/ci.yml` runs `lint`, `test` and `build` on every push and PR — the hook is the fast feedback, that is the guarantee — and Vercel builds a preview alongside it.

The tests are vitest, and they cover the markdown corpus (below), the routes that publish it, and nothing else — they run under Vite rather than bare Node because they read the docs through `import.meta.glob`. There is no component test runner; what is testable about a component belongs in a module beside it, the way `src/lib/markdown_actions.ts` holds the URLs the copy and view buttons build.

`.npmrc` sets `engine-strict=true`, but `package.json` declares no `engines`, so nothing is actually pinned. The README and CI both say Node 22, which is what Vercel builds on.

## Content architecture

### Docs

`src/docs/**/*.md` holds the page content; `src/lib/docs_menu.ts` holds the sidebar. Adding a page means touching both.

- **Frontmatter** — every page needs a `title`, and that is all the sidebar reads from a file. There is no sort key: menu order is the order of the `docsMenu` array.
- **Sidebar** — `docsMenu` in `src/lib/docs_menu.ts` is a hand-written list of pages and collapsible topics. A topic's `slug` is its directory, which is also the slug of its `index.md`, and it repeats that page as the first of its `items` so the overview gets a row of its own. Topics nest: `items` normally holds pages, but Database Adapters holds the sixteen adapter topics, so the sidebar is three levels deep there and one recursive snippet renders all of them. `src/routes/docs/+layout.svelte` imports it directly — no load function, no fetch — which is why the docs render with no network round trip of their own. The same flattened order drives the Previous/Next buttons. That layout sits at `docs/` rather than under `[topic]/[[page]]/` so that `/docs/search` gets the same shell, which is also why the pager is guarded: the search page is outside the sidebar's running order and has no neighbours.
- **The menu is checked at build time** — `src/routes/api/docs/v1.json/+server.ts` is prerendered, and it throws (failing the build) if a markdown file is missing from `docsMenu`, if an entry names a file that does not exist, or if any `/docs/...` link in the corpus points at a page the menu does not have.
- **Routing** — every docs _page_ renders through `src/routes/docs/[topic]/[[page]]/`; `docs/search` is a static route beside it, which SvelteKit prefers over the dynamic one. `+page.ts` dynamically imports `src/docs/<topic>/<page>.md`, falling back for a bare topic to `src/docs/<topic>.md` and then `src/docs/<topic>/index.md`. So `/docs/duckdb` and `/docs/adapters` both work, and `/docs/<topic>/index` 308-redirects to `/docs/<topic>` — the canonical URL for an index page has no `/index` on it.
- **Links between docs pages are absolute** (`/docs/config-file`, not `../config-file`). Relative links would resolve differently on `/docs/duckdb` than on `/docs/duckdb/motherduck`, and they are dead in any raw-markdown consumer.
- **Adapter star counts** — `docsMenu` entries carry an optional `repo`, keyed by the first slug segment; `+page.ts` looks it up by topic and fetches the GitHub badge. Documenting a new third-party adapter means setting `repo` on its entry, or the stars/forks badge won't render.
- **Raw markdown** — `/docs/<slug>.md` serves the sanitized page (prerendered, CORS-open, `text/markdown`; the content type comes from `vercel.json`, for the same reason the schema's does). `src/routes/docs/[...slug].md/+server.ts` names its own prerender entries from the corpus rather than waiting to be linked to, so every page gets a twin and a new page cannot ship without one. The slug is the rendered page's, so `/docs/duckdb.md` is the DuckDB overview and `/docs/duckdb/index.md` is a 404.
- **Copy and view as markdown** — every docs page carries two controls beside its title (`src/lib/components/markdown_actions.svelte`, rendered from the docs `+page.svelte`). "View as Markdown" links to the page's own `.md` twin, and "Copy as Markdown" fetches that same URL and puts it on the clipboard under a two-line provenance header — it never re-derives markdown of its own, so the bytes a reader pastes are the bytes an agent would have fetched. The slug and header construction live in `src/lib/markdown_actions.ts` so a test can hold them against the corpus; the link is `data-sveltekit-reload`, because the `.md` route is a server route and the client router has no page to render for it.
- **Public API** — two prerendered, CORS-open routes, both fed by the corpus. `/api/docs/v1.json` is the index: `routes` (URL templates for a page as JSON and as markdown), `topics` — each with the `parent` topic it nests inside — and a flat `pages` list in sidebar order, each with `title`, `slug`, `topic`, `url`, `description` and `repo`. `/api/docs/v1/<slug>.json` is one page: the same metadata plus `markdown`, byte for byte what `/docs/<slug>.md` serves. `/api/docs` and `/api/docs/v1` redirect to the index via `vercel.json` — the index wears `.json` because a static file cannot sit at `/api/docs/v1` while the pages under it need that path to be a directory. Nothing on the site consumes either — they exist for external callers, so changing their shape is a breaking change in a way the sidebar no longer is, and there is deliberately no search endpoint.

### The markdown corpus

`src/lib/server/docs.ts` is the one place that turns a page under `src/docs` into markdown, and everything that publishes markdown reads it from there — so that two consumers cannot disagree about what a page says.

- **A docs source is not markdown.** It is an mdsvex source: a `<script>` block, component tags, identifiers in braces, `&lbrace;` where the author meant `{`, hand-rolled `<figure>` HTML, and a site-private ` ```output ` fence. `sanitize()` resolves all of it — callouts become blockquotes, `<Key>x</Key>` becomes `` `x` ``, `<Figure src={x}>` becomes an image with an absolute URL, relative links resolve against the page's own directory and absolutize against `https://harlequin.sh`, and `/x/index` collapses to `/x` the way the router's 308 collapses it.
- **It refuses what it does not know.** A component or an HTML tag with no rule, or an identifier it could not resolve, throws — and `/api/docs/v1.json` calls `buildCorpus()` at prerender time, so that throw fails the build. Adding a component to a docs page means teaching `docs.ts` what it means in markdown; the alternative is `<NewThing>` shipped inside a file whose content type promises markdown.
- **The vendored CLI reference is the one exception to "a page is a file"** — `<HsqlReference />` resolves to `static/artifacts/hsql-reference.md` rather than to anything in `src/docs`, so `/docs/hsql/reference.md` carries the generated reference verbatim.
- **The lint** (`docs_lint.test.ts`) runs over the whole sanitized corpus: no Svelte tag, no HTML tag, no unresolved `{identifier}`, no `&lbrace`, no relative link, and every internal link resolving to a page the corpus contains. It is what covers pages written after it.
- **One corpus, six consumers** — `/docs/<slug>.md`, `/llms.txt`, `/llms-full.txt`, `/api/docs/v1*` and the search index all read `buildCorpus()`, and the page's "Copy as Markdown" button reads the first of those. The markdown a caller gets is the same bytes whichever one it asked; a second path that produces markdown would be a second sanitizer, and the first place they disagree is a page that says two different things.
- **Descriptions** — `sanitize()` derives a one-line description from the page's first sentence of prose, truncated at 120 characters. A `description` key in the frontmatter overrides it, and a new page should set one.

### Search

`src/lib/search.ts` is the query language and the ranking; `src/lib/server/search_index.ts` turns the corpus into the index it runs against; `/docs/search/index.json` serves that index, prerendered.

- **The index ships whole, and it ships tokenized.** 71 pages is ~300 sections and ~2,700 distinct words — 300KB of JSON, 83KB over the wire — so the browser fetches it once and every search after that is local. What ships is not the text alone: tokenizing 20,000 words in the browser is a ~73ms pass on a desktop and several hundred milliseconds on a phone, and it would land inside the first keystroke. So the tokenizing happens at build time and the tokens ship, as a sorted dictionary and one delta-encoded postings string per term. Prefix-matching "conf" is then two binary searches over the dictionary rather than a scan of every token in the docs.
- **`tokenize()` lives in `$lib/search.ts`, not beside the builder**, because both sides have to use the same one. A dictionary built by a tokenizer the query does not share holds terms no query can reach, and nothing fails — the results are just quietly missing. The tokenizer is tuned for a CLI reference: `motherduck_token`, `harlequin.sh` and `v2.13.0` are each one word, and a leading `--` is not part of one, so `--limit` is found by searching `limit`.
- **The grammar is `websearch_to_tsquery`'s**, which is what people have muscle memory for: bare words prefix-match and AND, `"a phrase"` is exact and adjacent, `-word` excludes the whole page, and `OR` binds looser than the implicit AND (`a b OR c` is `(a AND b) OR c`). A `-` only negates when a word follows it directly — `--limit` is a flag, not an exclusion of "limit".
- **Sections, not pages, are the unit.** A page is split at its `##`–`####` headings, each section anchored at `slugifyText(heading)` — the same id `src/mdsvex/components/h2.svelte` renders, which is why `slugify.ts` exports the string form and the element form delegates to it. **Split with the fences masked:** `files/remote.md` lists S3 formats under `# Amazon S3 Formats` _inside_ an unlabelled code block, and `snowflake/index.md` has a `# key-pair auth` TOML comment. And `sanitize()` prepends `# <title>` to every page, which is the route's `<h1>` and has no id, so it is not a section either.
- **Code is content.** Fence markers go; what is inside them stays, verbatim — the `*` in `SELECT *` is not emphasis, and a reader searching `motherduck_token` is searching a code block.
- **Ranking** weights a hit by where it landed (title 10, heading 5, description 3, body 1), saturates term frequency with `1 + ln(tf)` so a page repeating a word cannot drown one that says it in its title, halves a prefix-only match, doubles a phrase, and adds a quarter when one section answers the whole query. Ties break by sidebar order, which is free: `buildCorpus()` maps over `docsPages`, so the index is already in it.
- **The search box is the sidebar's**, mounted once in `src/routes/docs/+layout.svelte` above the mobile Table of Contents toggle — inside the drawer it would be a search box a reader has to open a menu to find. It is seeded from `?q=`, so `/docs/search` needs no second box and a reader who follows a result still has their query in front of them. Reading that query string is `browser`-guarded: the results page is prerendered, and touching `url.searchParams` during a prerender is an error rather than an empty value — rightly, since one prerendered file answers every query.
- **It is a real GET form** (`action="/docs/search"`), so Enter reaches the results page with no JavaScript at all. With JavaScript it is an ARIA combobox: a dropdown of the top six, arrow keys over the rows _and_ the unselected state, Enter to open the active row or fall through to the results page, Escape to dismiss and Escape again to clear, `/` and Cmd/Ctrl-K to focus from anywhere.
- **No debounce.** A search runs against an index already in memory and costs well under a millisecond, so a timer would only put lag between a keystroke and an answer that was ready before it expired.
- **Excerpts cross the component boundary as `{ text, hit }` segments**, never as HTML. `search_excerpt.svelte` is the only thing that renders a `<mark>`, so no path exists for corpus text to arrive as markup.

- **The tests are the guarantee.** `search.test.ts` runs the grammar and the ranking over four made-up pages, built with the same `buildIndex()` the real corpus uses. `search_index.test.ts` runs over the real 71: that the dictionary is sorted (`termRange` binary-searches it, and out of order it returns wrong answers rather than failing), that postings point where they claim — for every section, a word only that section uses finds that section's page — and that the index stays inside its size budget. The budget is a tripwire: if the corpus grows into it, stop shipping section text and fetch it for the excerpt rather than raising the number.

### Vendored artifacts

`static/artifacts/` holds files generated in [`tconbeer/harlequin`](https://github.com/tconbeer/harlequin) and copied here by that repo's release workflow, which opens a PR against this one. **Never edit them by hand** — the source of truth is the wheel, and the next release will overwrite the change.

- **`manifest.json`** records the `harlequin` version each copy came from, the path in that repo it was generated from, and the size and SHA-256 of every file beside it.
- **The manifest is checked at build time** — `src/lib/server/artifacts.ts` reads the directory and throws (failing the build) if a file the manifest names is missing, if a file is present that the manifest does not name, or if any file's bytes do not hash to what the manifest recorded. An automated PR that arrives truncated or hand-edited fails rather than serving an agent a wrong answer.
- **The files are served verbatim.** They are under `static/`, so they are also public as-is at `/artifacts/…` (CORS-open via `vercel.json`); a route that serves one serves the committed bytes, never a re-serialization.
- **`hsql-reference.md` is also a docs page.** `src/docs/hsql/reference.md` frames it and drops `<HsqlReference />` where the artifact goes; `src/lib/components/hsql_reference.svelte` renders it (mdsvex compiles the vendored `.md` like any other page) and `docs.ts` inlines the same bytes into the corpus, both under a line naming the `harlequin` release the manifest records. The sanitizer inserts it _after_ its rewrites, because the artifact is already markdown and a future release's help text is not ours to second-guess.

### Schemas

`/schemas/config/v1.json` serves the vendored `config-v1.json` as `application/schema+json` (prerendered, CORS-open; the content type comes from `vercel.json`, because Vercel serves a prerendered file by extension and does not carry a build-time response header over).

Every config schema `harlequin` has generated since 2.10 carries `https://harlequin.sh/schemas/config/v1.json` as its `$id`, so **the path is not ours to rename** — editors and validators dereference it, and `$ref`s resolve against it. The route asserts at build time that the vendored document's `$id` is the URL it is served under.

### Blog

`src/blog/*.md` with `title`, `publishedAt`, and `lede` frontmatter; `src/routes/api/blog/+server.ts` globs and sorts them by date descending. Same rendering pipeline as docs.

### Markdown rendering

MDSveX is configured in `svelte.config.js` and applies to all `.md` files:

- `src/mdsvex/docs.svelte` is the global layout; it exports the components in `src/mdsvex/components/` so plain markdown elements (`p`, `a`, `pre`, `h2`…) render as styled Svelte components. (`src/mdsvex/blog.svelte` is a near-duplicate that nothing currently references.)
- **Markdown inside a component tag needs a blank line.** The first paragraph after `<Tip>` is passed through as raw HTML — a `[link](/docs/x)` written there renders as literal brackets — so put a blank line after the opening tag and before the closing one, and then backticks, links and lists all work. (The older pages write `<code>` by hand instead; that is why.)
- **Braces inside a fence are escaped as `&lbrace;`/`&rbrace;`**, because the highlighter puts fenced code into a Svelte component where `{` opens an expression. Inline spans need no escape — mdsvex escapes those itself — and `sanitize()` turns both back into braces.
- **`smartypants` runs with `dashes: false`.** Curly quotes and ellipses, but a `--flag` written outside backticks stays a flag rather than becoming an em dash; the generated CLI reference is full of help text that mentions one.
- Markdown tables render through `components/table.svelte` and its `th`/`td`, and each one scrolls in its own box. `components/h1.svelte` renders an `<h2>`: a page's own `<h1>` is the route's, from the frontmatter, and the only `#` in the corpus is inside the embedded CLI reference.
- The custom highlighter prepends a `$ ` prompt to ` ```bash ` blocks. `components/pre.svelte` renders the copy button and strips that leading `$` when copying — so use `bash` for shell commands and no fence language for output/other snippets.
- Markdown files may open a `<script>` block and import Svelte components, which is how docs pages use `$lib/components/` callouts (`note`, `tip`, `warning`) and `theme_gallery`.

## Conventions

- **Svelte 5 runes** throughout — `$props()`, `$state()`, `$derived()`, `$effect()`, and `{@render children()}` rather than slots or `export let`. Match this in new components.
- **Styling is Tailwind-only**, using the custom palette in `tailwind.config.js` (`green`/`yellow`/`pink`/`purple`/`black`) and the four font families (`font-display` Rye, `font-accent` Contrail One, `font-body` Quicksand, `font-mono` JetBrains Mono). Fonts load from Google Fonts in `src/app.html`.
- **Site-wide strings** (title, subtitle, description, canonical URL) live in `src/lib/config.ts`; shared TypeScript types live in `src/lib/types.ts`.
- **CSP** is set in `svelte.config.js` with `script-src: self`, so external scripts and inline script tags will be blocked.
- **Vercel ISR** — `src/routes/+layout.server.js` and the docs `+page.ts` use `config.isr` with a 1-hour expiration because they hit the unauthenticated GitHub API for star counts; that API is rate-limited, and both loaders degrade gracefully when the request fails.
- Filenames are lower_snake_case for components, kebab-case for docs pages.
