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

`pnpm lint` and `pnpm test` run as pre-commit hooks (`@fastify/pre-commit`), so run `pnpm format` before committing. Vercel builds a preview in CI.

The tests are vitest, and they cover the markdown corpus (below) and nothing else — they run under Vite rather than bare Node because they read the docs through `import.meta.glob`.

`.npmrc` sets `engine-strict=true`; the README targets Node 18, though newer Node works.

## Content architecture

### Docs

`src/docs/**/*.md` holds the page content; `src/lib/docs_menu.ts` holds the sidebar. Adding a page means touching both.

- **Frontmatter** — every page needs a `title`, and that is all the sidebar reads from a file. There is no sort key: menu order is the order of the `docsMenu` array.
- **Sidebar** — `docsMenu` in `src/lib/docs_menu.ts` is a hand-written list of pages and collapsible topics. A topic's `slug` is its directory, which is also the slug of its `index.md`, and it repeats that page as the first of its `items` so the overview gets a row of its own. Topics nest: `items` normally holds pages, but Database Adapters holds the fourteen adapter topics, so the sidebar is three levels deep there and one recursive snippet renders all of them. `src/routes/docs/[topic]/[[page]]/+layout.svelte` imports it directly — no load function, no fetch — which is why the docs render with no network round trip of their own. The same flattened order drives the Previous/Next buttons.
- **The menu is checked at build time** — `src/routes/api/docs/v1/+server.ts` is prerendered, and it throws (failing the build) if a markdown file is missing from `docsMenu`, if an entry names a file that does not exist, or if any `/docs/...` link in the corpus points at a page the menu does not have.
- **Routing** — everything renders through `src/routes/docs/[topic]/[[page]]/`. `+page.ts` dynamically imports `src/docs/<topic>/<page>.md`, falling back for a bare topic to `src/docs/<topic>.md` and then `src/docs/<topic>/index.md`. So `/docs/duckdb` and `/docs/adapters` both work, and `/docs/<topic>/index` 308-redirects to `/docs/<topic>` — the canonical URL for an index page has no `/index` on it.
- **Links between docs pages are absolute** (`/docs/config-file`, not `../config-file`). Relative links would resolve differently on `/docs/duckdb` than on `/docs/duckdb/motherduck`, and they are dead in any raw-markdown consumer.
- **Adapter star counts** — `docsMenu` entries carry an optional `repo`, keyed by the first slug segment; `+page.ts` looks it up by topic and fetches the GitHub badge. Documenting a new third-party adapter means setting `repo` on its entry, or the stars/forks badge won't render.
- **Public API** — `/api/docs/v1` serves the menu as JSON (prerendered, CORS-open, `topics` — each with the `parent` topic it nests inside — plus a flat `pages` list in sidebar order); `/api/docs` redirects there via `vercel.json`. Nothing on the site consumes it — it exists for external callers, so changing its shape is a breaking change in a way the sidebar no longer is.

### The markdown corpus

`src/lib/server/docs.ts` is the one place that turns a page under `src/docs` into markdown, and everything that publishes markdown reads it from there — so that two consumers cannot disagree about what a page says.

- **A docs source is not markdown.** It is an mdsvex source: a `<script>` block, component tags, identifiers in braces, `&lbrace;` where the author meant `{`, hand-rolled `<figure>` HTML, and a site-private ` ```output ` fence. `sanitize()` resolves all of it — callouts become blockquotes, `<Key>x</Key>` becomes `` `x` ``, `<Figure src={x}>` becomes an image with an absolute URL, relative links resolve against the page's own directory and absolutize against `https://harlequin.sh`, and `/x/index` collapses to `/x` the way the router's 308 collapses it.
- **It refuses what it does not know.** A component or an HTML tag with no rule, or an identifier it could not resolve, throws — and `/api/docs/v1` calls `buildCorpus()` at prerender time, so that throw fails the build. Adding a component to a docs page means teaching `docs.ts` what it means in markdown; the alternative is `<NewThing>` shipped inside a file whose content type promises markdown.
- **Goldens.** `src/lib/server/goldens/` holds the expected markdown for four pages, compared byte for byte. They are prettier- and eslint-ignored, because reformatting one is a failing test. Regenerate a golden by reading the diff, not by pasting over it. Asset URLs differ between the dev server and a build, so the goldens carry a stable `asset:` stand-in that the test substitutes in.
- **The lint** (`docs_lint.test.ts`) runs over the whole sanitized corpus rather than the four goldens: no Svelte tag, no HTML tag, no unresolved `{identifier}`, no `&lbrace`, no relative link, and every internal link resolving to a page the corpus contains. It is what covers pages written after it.
- **Descriptions** — `sanitize()` derives a one-line description from the page's first sentence of prose, truncated at 120 characters. A `description` key in the frontmatter overrides it, and a new page should set one.

### Vendored artifacts

`static/artifacts/` holds files generated in [`tconbeer/harlequin`](https://github.com/tconbeer/harlequin) and copied here by that repo's release workflow, which opens a PR against this one. **Never edit them by hand** — the source of truth is the wheel, and the next release will overwrite the change.

- **`manifest.json`** records the `harlequin` version each copy came from, the path in that repo it was generated from, and the size and SHA-256 of every file beside it.
- **The manifest is checked at build time** — `src/lib/server/artifacts.ts` reads the directory and throws (failing the build) if a file the manifest names is missing, if a file is present that the manifest does not name, or if any file's bytes do not hash to what the manifest recorded. An automated PR that arrives truncated or hand-edited fails rather than serving an agent a wrong answer.
- **The files are served verbatim.** They are under `static/`, so they are also public as-is at `/artifacts/…` (CORS-open via `vercel.json`); a route that serves one serves the committed bytes, never a re-serialization.

### Schemas

`/schemas/config/v1.json` serves the vendored `config-v1.json` as `application/schema+json` (prerendered, CORS-open; the content type comes from `vercel.json`, because Vercel serves a prerendered file by extension and does not carry a build-time response header over).

Every config schema `harlequin` has generated since 2.10 carries `https://harlequin.sh/schemas/config/v1.json` as its `$id`, so **the path is not ours to rename** — editors and validators dereference it, and `$ref`s resolve against it. The route asserts at build time that the vendored document's `$id` is the URL it is served under.

### Blog

`src/blog/*.md` with `title`, `publishedAt`, and `lede` frontmatter; `src/routes/api/blog/+server.ts` globs and sorts them by date descending. Same rendering pipeline as docs.

### Markdown rendering

MDSveX is configured in `svelte.config.js` and applies to all `.md` files:

- `src/mdsvex/docs.svelte` is the global layout; it exports the components in `src/mdsvex/components/` so plain markdown elements (`p`, `a`, `pre`, `h2`…) render as styled Svelte components. (`src/mdsvex/blog.svelte` is a near-duplicate that nothing currently references.)
- The custom highlighter prepends a `$ ` prompt to ` ```bash ` blocks. `components/pre.svelte` renders the copy button and strips that leading `$` when copying — so use `bash` for shell commands and no fence language for output/other snippets.
- Markdown files may open a `<script>` block and import Svelte components, which is how docs pages use `$lib/components/` callouts (`note`, `tip`, `warning`) and `theme_gallery`.

## Conventions

- **Svelte 5 runes** throughout — `$props()`, `$state()`, `$derived()`, `$effect()`, and `{@render children()}` rather than slots or `export let`. Match this in new components.
- **Styling is Tailwind-only**, using the custom palette in `tailwind.config.js` (`green`/`yellow`/`pink`/`purple`/`black`) and the four font families (`font-display` Rye, `font-accent` Contrail One, `font-body` Quicksand, `font-mono` JetBrains Mono). Fonts load from Google Fonts in `src/app.html`.
- **Site-wide strings** (title, subtitle, description, canonical URL) live in `src/lib/config.ts`; shared TypeScript types live in `src/lib/types.ts`.
- **CSP** is set in `svelte.config.js` with `script-src: self`, so external scripts and inline script tags will be blocked.
- **Vercel ISR** — `src/routes/+layout.server.js` and the docs `+page.ts` use `config.isr` with a 1-hour expiration because they hit the unauthenticated GitHub API for star counts; that API is rate-limited, and both loaders degrade gracefully when the request fails.
- Filenames are lower_snake_case for components, kebab-case for docs pages.
