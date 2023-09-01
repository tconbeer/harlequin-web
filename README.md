# Harlequin-Web

This is the code behind [harlequin.sh](https://harlequin.sh), the website for [Harlequin](https://www.github.com/tconbeer/harlequin).

It uses SvelteKit, with TailwindCSS and MDSVex for parsing markdown files into the docs pages. It is hosted on Vercel.

It was created and is maintained by [Ted Conbeer](https://tedconbeer.com).

## Contributing

Use Node v18 with pnpm to install deps and build the site:

```bash
pnpm i
pnpm dev
```

Format and lint:

```bash
pnpm format
pnpm lint
```

When installing dependencies, pnpm should also install git pre-hooks for formatting and linting.

There are no tests. Vercel will build a preview in CI; if you want to build and preview a prod version locally you can with:

```bash
pnpm build
pnpm preview
```
