---
title: Differences from psql
menuOrder: 14
---

<script>
    import Note from "$lib/components/note.svelte"
    import Tip from "$lib/components/tip.svelte"
    import Warning from "$lib/components/warning.svelte"
    import Link from "$lib/components/link.svelte"
</script>

`hsql` is deliberately `psql`-shaped. Where a flag already has a well-known spelling, `hsql` borrows it rather than inventing a better one — because a novel spelling costs you a trip to `--help` and costs an agent a retry.

So most of what you know transfers. This page is about the parts that don't.

## What works the same

- **`-c`** runs SQL from the command line. Repeatable in `hsql`.
- **`-f`** runs SQL from a file, and `-f -` reads stdin. Repeatable in `hsql`.
- **`-o`** writes results to a file.
- **`-t`** is tuples-only: no header, no footer.
- **`-A`** is unaligned output.
- **`--csv`** switches to CSV output.
- **`-tAc "select count(*)"`** returns a bare scalar and nothing else. This idiom is explicitly supported and explicitly tested.

## What is spelled the same but means something else

<Warning>
These three are the ones to watch, because they parse successfully and then do something you didn't ask for.
</Warning>

- **`-P`** — In `hsql`, `-P` is `--profile`, which selects a set of connection settings from your <Link href="../config-file/index">config file</Link>. In `psql`, `-P` is `--pset`. `hsql` has no `--pset`; its equivalents are the [output format options](output-formats#shaping-text-output).
- **`-l`** — In `hsql`, `-l` is `--limit`, the maximum number of rows per result set. In `psql`, `-l` lists databases. `hsql` has no equivalent of `psql -l`; use the catalog in Harlequin, or a query.
- **`-F`** — In `hsql`, `-F` is `--format`, and it takes a format name like `csv` or `markdown`. In `psql`, `-F` sets the field separator. For a different separator in `hsql`, use `-F tsv`.

## What `hsql` does not have

- **Meta-commands.** There is no `\d`, `\dt`, `\l`, `\copy`, or `\x`. `hsql` runs SQL, and Harlequin's interactive Data Catalog covers the exploration `\d` is usually for. (`-F vertical` is the equivalent of `\x`.)
- **An interactive prompt.** `hsql` is non-interactive by design: no REPL, and no prompting for a password — a prompt that blocks on stdin is the worst possible failure in a script or an agent, so `hsql` fails immediately with a message telling you where to put the credential instead. For interactive work, run `harlequin`.
- **Variables.** No `-v`/`--set`, and no `:variable` interpolation. Compose your SQL in the shell or in a file.
- **`-q`.** There is nothing to quiet: row counts, timings, and notices already go to stderr rather than stdout. If you want silence, redirect stderr with `2>/dev/null`.
- **`ON_ERROR_STOP`.** It is the default. Use [`--on-error continue`](running-queries#handling-errors-in-a-script) to opt out.
- **`~/.psqlrc`.** `hsql` reads Harlequin [config files](../config-file/discovery) instead. Some adapters, including DuckDB and SQLite, also support [initialization scripts](../duckdb/initialization).

## What `hsql` does that psql doesn't

- **It speaks to every database Harlequin supports** — DuckDB, SQLite, Postgres, MySQL, BigQuery, Trino, Databricks, ODBC, and [more](../adapters) — with one set of flags and one set of exit codes.
- **It renders values identically across all of them.** Same timestamp format, same boolean spelling, same blob encoding, whatever produced the row.
- **It defaults to 500 rows** and [always says so when it truncates](running-queries#row-limits-and-truncation). `psql` will happily print ten million rows and let you find out later.
- **It reports structured metadata.** [`--stats`](running-queries#reporting-stats) emits one line of JSON on stderr with row count, column types, elapsed time, and a `truncated` flag — in every format, including binary ones.
- **It writes Markdown, JSON, JSONL, Parquet, Arrow, and ORC** in addition to text and CSV. See [Output Formats](output-formats).
- **It shares a config file with a full IDE.** The profile your script uses is the profile you open interactively when the script surprises you.

## Exit codes do not line up

`psql` and `hsql` both use small integers, and they do not mean the same things. Do not carry a `case $?` block over from one to the other.

`hsql` uses `1` for a query error, `2` for a usage or config error, `3` for a connection error, `4` for a timeout or cancellation, and `130` for `SIGINT`. See [Exit Codes and Errors](exit-codes) for the full contract.

<Tip>
Migrating a <code>psql</code> script? The mechanical part is usually just <code>-P</code> and <code>-F</code>. Replace <code>psql "$DSN"</code> with <code>hsql -P prod</code>, move the connection details into a profile, and check any <code>$?</code> handling against the exit-code table.
</Tip>
