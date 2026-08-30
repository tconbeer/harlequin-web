# Harlequin-Web

This is the code behind [harlequin.sh](https://harlequin.sh), the website for [Harlequin](https://www.github.com/tconbeer/harlequin).

It uses SvelteKit, with TailwindCSS and MDSVex for parsing markdown files into the docs pages. It is hosted on Vercel.

It was created and is maintained by [Ted Conbeer](https://tedconbeer.com).

## Contributing

Use Node v22 with pnpm to install deps and build the site:

```bash
pnpm i
pnpm dev
```

Format, lint and test:

```bash
pnpm format
pnpm lint
pnpm test
```

The tests cover `src/lib/server/docs.ts`, which turns the mdsvex sources under `src/docs` into the markdown the site publishes to agents.

When installing dependencies, pnpm should also install git pre-hooks for formatting, linting and testing.

GitHub Actions runs `lint`, `test` and `build` on every push and pull request, and Vercel builds a preview alongside it. If you want to build and preview a prod version locally you can with:

```bash
pnpm build
pnpm preview
```
