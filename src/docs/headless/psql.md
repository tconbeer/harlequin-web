---
title: Differences from psql
description: What carries over from psql to hsql — -c, -f, -t, -A, -x — and the dozen places where the same job has a different flag.
---

<script>
    import Tip from "$lib/components/tip.svelte"
    import Warning from "$lib/components/warning.svelte"
</script>

hsql is deliberately familiar to anyone who has used `psql` or the duckdb CLI.
`-c`, `-f`, `-t`, `-A` and `-x` mean what they mean in psql, so this prints a
bare number in either program:

```bash
hsql -tAc "select count(*) from orders"
```

The difference is that hsql prints that number the same way against Postgres,
DuckDB, SQLite, MySQL and every other [adapter](/docs/adapters) — one interface
and one output contract, instead of one client per database.

## What Is Different

|                             | psql                                                | hsql                                                                                        |
| --------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `-P`                        | `--pset`, an output setting                         | `--profile`, a [config-file profile](/docs/headless/config)                                 |
| Field separator             | `-F`                                                | `--csv`, `--format tsv`, or any other [`--format`](/docs/headless/formats)                  |
| Listing databases           | `-l`                                                | [`--catalog`](/docs/headless/catalog)                                                       |
| Describing an object        | `\d`, `\dt`                                         | `--catalog --path`, `--catalog-search`                                                      |
| Stopping on the first error | `-v ON_ERROR_STOP=1`                                | `--on-error stop`, which is the default                                                     |
| One transaction             | `-1`                                                | write `begin` and `commit` in your script                                                   |
| `-o`                        | a file for query output                             | a file, or a directory that gets one file per result set                                    |
| Connection flags            | `-h`, `-p`, `-U`, built in                          | the adapter's, so `hsql --help -a postgres` lists them                                      |
| Row limits                  | none                                                | [500 rows by default](/docs/headless/safety); `--limit -1` removes it                       |
| Suppressing chatter         | `-q`                                                | nothing to suppress: stdout is only ever results                                            |
| Exit codes                  | `1` its own error, `2` connection, `3` script error | [`1` query error, `2` usage/config, `3` connection, `4` timeout](/docs/headless/exit-codes) |

<Warning>

`-t` is _tuples only_, as in psql — it is not Harlequin's theme flag. Because
hsql takes connection strings as positional arguments, `hsql -t nord -c "..."`
parses: `nord` becomes a connection string, and hsql says so on stderr.

</Warning>

## No Backslash Commands

psql's meta-commands are a language of their own, and hsql has none of them.
What they do, hsql does with options that work the same way against every
database:

- `\d`, `\dt`, `\l` — [`--catalog` and `--catalog-search`](/docs/headless/catalog),
  which produce ordinary result sets rather than a special display.
- `\copy` — [`--csv` and `-o`](/docs/headless/formats), or `--format parquet`.
- `\timing` — `--stats`, which reports `elapsed_ms` alongside the row count on
  stderr.
- `\c` — a different profile: `-P NAME`.
- `\set` — the profile, or the command line. There are no session variables to
  set, because hsql runs one invocation and exits.

## No Interactive Session

`psql` with no `-c` and no `-f` opens a prompt. hsql does not: it executes what
you passed it and exits, which is what makes it predictable inside a script.

<Tip>

When you want the interactive session, you want [Harlequin](/docs/getting-started/usage) —
same adapters, same config files, same profile, with a query editor, a data
catalog and a results viewer around them. `harlequin -P prod` is the same
connection you were just using.

</Tip>
