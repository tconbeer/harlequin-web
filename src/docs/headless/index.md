---
title: The hsql CLI
topic: Headless & Agents
menuOrder: 10
---

<script>
    import Note from "$lib/components/note.svelte"
    import Tip from "$lib/components/tip.svelte"
    import Link from "$lib/components/link.svelte"
</script>

Harlequin is a SQL IDE for your terminal. `hsql`, the Harlequin CLI, is the same engine with the interface taken off: it connects using your Harlequin profile, runs your SQL, writes the results to stdout, and exits.

```bash
hsql -P prod -c "select count(*) from orders"
```

That command works the same way against every database Harlequin supports. Same flags, same output formats, same exit codes, whether the profile points at DuckDB, Postgres, SQLite, BigQuery, Databricks, Trino, or any other [adapter](../adapters). And when a query needs a human, that human can open `harlequin -P prod` against the same profile and see the same catalog.

`hsql` is built for scripts, `Makefile`s, CI jobs, and AI coding agents — anything that wants query results as data rather than as an interface.

## Installing hsql

`hsql` ships with Harlequin. If Harlequin is [installed](../getting-started/index), you already have it — run it with no arguments and it will print its help:

```bash
hsql
```

Both commands come from the same package, use the same [adapters](../adapters), and read the same [config files](../config-file). There is nothing extra to install and nothing extra to configure.

<Note>
There is also a package named <code>hsql</code> on PyPI. It is a small metapackage that installs Harlequin, so <code>pip install hsql</code> works if that is what you reach for first. The <code>hsql</code> command itself comes from Harlequin either way.
</Note>

## Your first query

`hsql` defaults to the DuckDB adapter, exactly like `harlequin`, so you can run a query with no setup at all:

```bash
hsql -c "select 'hello' as greeting, 42 as answer"
```

```
 greeting | answer
----------+--------
 hello    | 42
1 row in 0.01s
```

The table went to stdout. The `1 row in 0.01s` went to stderr — which is why this writes a clean CSV file and still tells you what happened:

```bash
hsql --csv -l 0 -c "select * from 'data/*.parquet'" > orders.csv
```

Pass a connection string to open a database file, just as you would with `harlequin`:

```bash
hsql "path/to/duck.db" -c "select * from orders limit 5"
```

Or select another adapter with `-a`:

```bash
hsql -a sqlite "path/to/sqlite.db" -c "select * from orders limit 5"
```

To capture a single value in a shell script, use the tuples-only and unaligned flags together — the same `-tAc` idiom you may know from `psql`:

```bash
ORDER_COUNT=$(hsql -tAc "select count(*) from 'orders.parquet'")
```

## Using profiles instead of credentials

`hsql` discovers and merges [config files](../config-file/discovery) exactly the way `harlequin` does, and [profiles](../config-file/profiles) work the same way. A profile you already use interactively works headlessly with no changes:

```toml
default_profile = "local-duckdb"

[profiles.local-duckdb]
adapter = "duckdb"
conn_str = ["my-database.db"]

[profiles.prod]
adapter = "postgres"
host = "warehouse.example.com"
user = "analyst"
dbname = "analytics"
limit = 100
```

```bash
hsql -P prod -c "select count(*) from orders"
```

This is the recommended way to run `hsql` anywhere, and the only recommended way to run it inside a script or an agent: the secret lives in the config file, so it never appears in an argument list, a `ps` listing, a shell history, or a transcript.

Options given on the command line override the values in the selected profile, and everything resolves in this order, highest priority first:

1. Command-line options
2. Environment variables
3. The file at `--config-path`
4. Config files in the current working directory
5. Config files in your user config directory
6. Config files in your home directory
7. Harlequin's defaults

## Getting help

`hsql --help` is deliberately short. It lists every option that applies to every database, the output formats, and the exit codes — but not the connection options of your installed adapters, because those differ per adapter:

```bash
hsql --help
```

To see one adapter's connection options, name the adapter:

```bash
hsql --help -a postgres
```

Or name a profile, and `hsql` will show the options for whichever adapter that profile uses:

```bash
hsql --help -P prod
```

Only the adapter you asked about is loaded, so top-level help stays fast and stays true no matter how many adapters you have installed.

## Two front doors, one engine

`harlequin` and `hsql` share adapters, config discovery, profiles, the SQL statement splitter, and the query execution core. They are not two programs that resemble each other; they are one engine with two front ends.

They are separate commands because they make different promises. The TUI's promise is to delight a human, and it evolves freely. `hsql`'s promise is that its output format and exit codes are an API you can build on. Keeping them apart means a change to the interface cannot quietly break your script.

A few differences are worth knowing if you use both:

- **`hsql` never opens a UI.** Bare `hsql` with no arguments prints help. It will not launch the TUI.
- **`hsql` has no interface options.** No `--theme`, no `--keymap-name`, no `--show-files`, no `--locale`. Those only mean something on a screen.
- **`-f` means `--file`,** as in `psql`. On `harlequin`, `-f` is `--show-files`.
- **`-t` means `--tuples-only`,** as in `psql`. On `harlequin`, `-t` is `--theme`.
- **`--limit` is a hard limit.** In the TUI, `--limit` caps how many rows load into the Results Viewer after fetching everything, so it can report an exact total. In `hsql`, `--limit` caps how many rows leave the database, and it defaults to 500. See [Row limits and truncation](running-queries#row-limits-and-truncation).

<Tip>
Typing <code>harlequin -c "select 1"</code> out of habit? Harlequin will tell you to use <Link href="running-queries"><code>hsql -c</code></Link> instead. The <code>harlequin</code> command is unchanged by any of this.
</Tip>

## Using hsql with an AI agent

Coding agents are good at SQL and bad at remembering which of a dozen database CLIs takes which flag. `hsql` gives them one contract to learn, and gives you a way to hand over a warehouse without handing over a credential.

If you are pointing an agent at your database, tell it to:

- **Read `hsql --help` first.** It is short, and it describes what is actually installed on your machine.
- **Use `-P <profile>`, never a raw credential.** The secret stays in your config file and out of the transcript.
- **Pick a format on purpose.** `-F markdown` is the easiest for a model to read back accurately; `--json` pipes cleanly into `jq`; `-F none` reports status without spending tokens on rows.
- **Keep the limit small and check for truncation.** The default of 500 rows exists so a `select *` doesn't cost a fortune, and `hsql` always says on stderr when it truncated a result. A truncated aggregate is not an aggregate.
- **Branch on the [exit code](exit-codes), not on the error text.** Exit `1` means the database rejected the SQL; exit `3` means it never connected. Those call for different next steps.
- **Ask for `--stats`** when it wants row counts, timings, and column types as one line of JSON on stderr, without touching stdout.

Because every adapter answers to the same flags, an agent that learns `hsql` once can query all of them — and when it gets somewhere interesting, you can open Harlequin against the same profile and pick up where it left off.

## Next steps

- [Running queries with hsql](running-queries) — `-c`, `-f`, scripts, limits, and `--stats`
- [Output formats](output-formats) — the format list, and the stdout/stderr contract
- [Exit codes and errors](exit-codes) — the part scripts branch on
- [Differences from psql](differences-from-psql) — what transfers, and what doesn't
