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
pnpm format      # prettier --write with svelte/organize-imports/tailwindcss plugins
pnpm lint        # prettier --check && eslint  (runs on pre-commit)
pnpm check       # svelte-check against tsconfig.json
pnpm themes      # re-optimize the SVG theme screenshots in src/lib/assets/themes
```

There are no tests. `pnpm lint` runs as a pre-commit hook (`@fastify/pre-commit`), so run `pnpm format` before committing. Vercel builds a preview in CI.

`.npmrc` sets `engine-strict=true`; the README targets Node 18, though newer Node works.

## Content architecture

### Docs

`src/docs/**/*.md` is the single source of truth for both page content and the sidebar. There is no separate nav config file.

- **Frontmatter** — every page needs `title` and `menuOrder`. A directory's `index.md` additionally needs `topic`, which is the collapsible group label in the sidebar.
- **Sidebar** — `src/routes/api/docs/+server.ts` builds the menu at build time by `import.meta.glob`-ing every `.md` file, reading its frontmatter, and sorting all topics and pages together by `menuOrder` (ties put the topic header first). To position a new page, pick a `menuOrder` between its neighbors; the numbers are global across the whole docs tree, not per-topic. That same ordering drives the Previous/Next buttons at the bottom of each page.
- **Routing** — everything renders through `src/routes/docs/[topic]/[[page]]/`. `+page.ts` dynamically imports `src/docs/<topic>/<page>.md`, falling back to `src/docs/<topic>.md` when there is no `page` segment. A miss 308-redirects between `/docs/x` and `/docs/x/index` (with a `redirect_from` query param to break the loop) before 404ing, so both flat pages (`src/docs/adapters.md` → `/docs/adapters`) and directory topics (`src/docs/duckdb/index.md` → `/docs/duckdb`) work.
- **Adapter star counts** — `+page.server.ts` holds a hardcoded `repoMap` from topic slug to GitHub repo. Documenting a new third-party adapter means adding an entry there, or the GitHub stars/forks badge won't render on that page.

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
- **Vercel ISR** — the root layout and the docs page use `config.isr` with a 1-hour expiration because they hit the unauthenticated GitHub API for star counts; that API is rate-limited, and both loaders degrade gracefully when the request fails.
- Filenames are lower_snake_case for components, kebab-case for docs pages.
