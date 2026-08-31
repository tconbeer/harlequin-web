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
- **Sidebar** — `docsMenu` in `src/lib/docs_menu.ts` is a hand-written list of pages and collapsible topics. A topic's `slug` is its directory, which is also the slug of its `index.md`, and it repeats that page as the first of its `items` so the overview gets a row of its own. Topics nest: `items` normally holds pages, but Database Adapters holds the fourteen adapter topics, so the sidebar is three levels deep there and one recursive snippet renders all of them. `src/routes/docs/[topic]/[[page]]/+layout.svelte` imports it directly — no load function, no fetch — which is why the docs render with no network round trip of their own. The same flattened order drives the Previous/Next buttons.
- **The menu is checked at build time** — `src/routes/api/docs/v1.json/+server.ts` is prerendered, and it throws (failing the build) if a markdown file is missing from `docsMenu`, if an entry names a file that does not exist, or if any `/docs/...` link in the corpus points at a page the menu does not have.
- **Routing** — everything renders through `src/routes/docs/[topic]/[[page]]/`. `+page.ts` dynamically imports `src/docs/<topic>/<page>.md`, falling back for a bare topic to `src/docs/<topic>.md` and then `src/docs/<topic>/index.md`. So `/docs/duckdb` and `/docs/adapters` both work, and `/docs/<topic>/index` 308-redirects to `/docs/<topic>` — the canonical URL for an index page has no `/index` on it.
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
- **One corpus, five consumers** — `/docs/<slug>.md`, `/llms.txt`, `/llms-full.txt` and `/api/docs/v1*` all read `buildCorpus()`, and the page's "Copy as Markdown" button reads the first of those. The markdown a caller gets is the same bytes whichever one it asked; a second path that produces markdown would be a second sanitizer, and the first place they disagree is a page that says two different things.
- **Descriptions** — `sanitize()` derives a one-line description from the page's first sentence of prose, truncated at 120 characters. A `description` key in the frontmatter overrides it, and a new page should set one.

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
