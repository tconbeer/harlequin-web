---
title: The hsql CLI
description: Reference for hsql, Harlequin's headless SQL client — the catalog, formats, exit codes, config files, safety options, the CLI reference and the agent skill.
---

`hsql` runs SQL against any database Harlequin has an adapter for, with one set
of flags and one output contract. It reads the same config files as the IDE, so
one profile serves both.

For a tutorial, see [Using hsql](/docs/getting-started/hsql). For more detailed
information on hsql and its features, keep reading.

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
