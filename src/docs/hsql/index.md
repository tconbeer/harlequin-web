---
title: The hsql CLI
description: Reference for hsql, Harlequin's headless SQL client — the catalog, formats, exit codes, config files, safety options, the CLI reference and the agent skill.
---

`hsql` runs SQL against any database Harlequin has an adapter for, with one set
of flags and one output contract. It reads the same config files as the IDE, so
one profile serves both.

[Using hsql](/docs/getting-started/hsql) is the tutorial. These pages are the
reference under it.

## Pages

| Page                                            | What it covers                                              |
| ----------------------------------------------- | ----------------------------------------------------------- |
| [Exit Codes and Streams](/docs/hsql/exit-codes) | The six codes, stdout and stderr, `--stats`, `--on-error`   |
| [Exploring the Catalog](/docs/hsql/catalog)     | `--catalog`, `--path`, `--catalog-search`                   |
| [Formats and Layouts](/docs/hsql/formats)       | Every format, the layout switches, `-o`, `--result`         |
| [Config Files and Profiles](/docs/hsql/config)  | Discovery, merging, `${VAR}`, the `--config` modes          |
| [Running Safely](/docs/hsql/safety)             | `--limit`, `--read-only`, `--timeout`, adapter capabilities |
| [Differences from psql](/docs/hsql/psql)        | What carries over, and what does not                        |
| [Reference: hsql CLI](/docs/hsql/reference)     | Every option, generated from hsql itself                    |
| [The hsql Agent Skill](/docs/hsql/skill)        | What the skill says, and how to install it                  |

## Reading These Pages as Markdown

Add `.md` to any docs URL for the raw page: `/docs/hsql/exit-codes.md`. The two
buttons beside a page title do the same thing.

- [llms.txt](/llms.txt) — every page on this site, with a one-line description.
- [llms-full.txt](/llms-full.txt) — the whole corpus in one file.
- [/api/docs/v1.json](/api/docs/v1.json) — the same index as JSON.
  `/api/docs/v1/<slug>.json` is one page, with its markdown.

An agent does not have to read any of it: `hsql --skill` installs an
[Agent Skill](/docs/hsql/skill) that covers the same ground, matched to the
version installed.

## Elsewhere in These Docs

- [Database Adapters](/docs/adapters) — what hsql can connect to.
- [Configuring Harlequin](/docs/config-file) — config files in full, including
  the keys only the IDE reads.
- [Getting Help](/docs/getting-started/help) — where to ask, and where to file a
  bug.
