---
title: "If you like Harlequin, your agent's going to love hsql"
publishedAt: 2026-08-12T12:00:00Z
lede: Harlequin is a SQL IDE for humans. hsql is the same engine, headless, for everything else.
---

<script>
    import Tip from "$lib/components/tip.svelte"
    import Note from "$lib/components/note.svelte"
</script>

I built Harlequin because I wanted a SQL IDE that lived where I already worked: in a terminal, over SSH, inside tmux, next to my editor. That hasn't changed. But something else has. A lot of the SQL being written against your database this year isn't being typed by a person at all — it's being written by a coding agent, and that agent is not going to enjoy your Data Catalog, your themes, or your F10 full-screen mode.

Agents need something else. They need a command that takes SQL, prints data, and exits with a number that means something.

So Harlequin now ships one: `hsql`.

```bash
hsql -P prod -c "select count(*) from orders"
```

It's the same engine as the TUI — the same [adapters](/docs/adapters), the same [config files and profiles](/docs/config-file), the same statement splitter, the same query execution — with the interface taken off. If Harlequin is installed, you already have it.

## The problem isn't SQL. It's the CLIs.

Models are good at SQL. What they're bad at is remembering that `psql` wants `-c` but the DuckDB CLI wants the query as a positional argument, that `-t` means tuples-only in one place and something else in another, that one tool exits 1 on a bad query and another exits 0 with an error on stdout, and that the flag to get CSV out is `--csv` here and `-csv` there and a `.mode csv` dot-command somewhere else.

Every one of those differences is a chance for an agent to guess, guess wrong, and then confidently hand you a truncated CSV with an error message glued to the top of it.

`hsql` collapses all of that into one contract. Same flags, same output formats, same exit codes, against every database Harlequin supports:

```bash
hsql -a duckdb   -f report.sql
hsql -a postgres -f report.sql
hsql -P warehouse -f report.sql
```

An agent that learns `hsql` once can query DuckDB, Postgres, SQLite, MySQL, BigQuery, Databricks, Trino, and everything else with an adapter — without learning anything new.

## Credentials stay in your config, not in the transcript

This is the part I care most about.

The recommended way to run `hsql` — and the only way I'd recommend running it inside a script or an agent — is with a profile:

```bash
hsql -P prod -c "select count(*) from orders"
```

The host, the user, and the password live in your [config file](/docs/config-file/discovery). They never appear in an argument list, which means they never appear in a `ps` listing, your shell history, a CI log, or a conversation transcript that gets shipped off to a model provider. The agent gets a name. You keep the secret.

It's also the same profile you use interactively, which is the nice part: when your agent finds something worth a closer look, you open `harlequin -P prod` against that exact profile and pick up where it left off, catalog and all.

## Fewer tokens, on purpose

Headless output usually ends up in one of three places: a file, a pipe, or a model's context window. The third one has a price tag, so `hsql` defaults are chosen accordingly.

**Results are limited to 500 rows by default.** An accidental `select *` against a fact table is expensive in a context window and slow everywhere else. Raise it with `-l`, or turn it off with `-l 0` — and when a result is truncated, `hsql` says so, on stderr, every time:

```bash
hsql -c "select * from orders"
```

```output
note: results truncated at 500 rows (--limit)
```

A truncated aggregate is not an aggregate, and an agent that can't tell the difference will cheerfully report the wrong number. This is why the notice isn't optional.

**Pick a format for the reader.** `-F markdown` is the easiest for a model to read back accurately, because the delimiters are unambiguous. `--json` pipes into `jq`. And `-F none` runs the SQL, discards the rows, and just reports status — which is what you want for DDL and DML, where the rows aren't the point.

**Ask for the shape instead of the data.** `--stats` writes one line of JSON to stderr — row count, column names and types, elapsed time, whether the result was truncated — without touching stdout:

```bash
hsql --stats -F none -c "select * from orders"
```

```output
&lbrace;"status":"ok","statements":1,"rows":500,"truncated":true,"limit":500,"elapsed_ms":412,"columns":[&lbrace;"name":"id","type":"BIGINT"&rbrace;]&rbrace;
```

That's an agent learning the schema and size of a result set for the cost of one line.

## stdout is data. stderr is narration.

Everything above works because of one rule that `hsql` never breaks: **stdout carries results and nothing else.** No banners, no timings, no row counts, no warnings, no progress.

So this writes a clean CSV file, and still tells you what happened:

```bash
hsql --csv -l 0 -f report.sql > orders.csv
```

```output
1284 rows in 0.31s
```

The row count went to your terminal. The file got data. Nothing to strip, nothing to clean up.

And when a query fails, stdout stays completely empty — which is what lets a script tell "returned no rows" apart from "did not run."

<Tip>
Need a single value in a shell variable? <code>hsql -tAc "select count(*) from orders"</code> gives you tuples-only, unaligned output — the same idiom you already know from <code>psql</code>.
</Tip>

## Exit codes worth branching on

The last piece is knowing what happened without parsing English. `hsql` exit codes are [documented and stable](/docs/headless/exit-codes): `1` means the database rejected your SQL, `3` means it never connected. Those call for very different next steps — rewrite the query, or go find out why the host is unreachable — and an agent that branches on the number gets that right without a language model in the loop at all.

```bash
hsql -P prod -f checks.sql -F none
```

```output
hsql: error: could not connect to host
```

## Try it

`hsql` ships with Harlequin, so if you have Harlequin, run:

```bash
hsql --help
```

It's deliberately short: every option that applies to every database, the formats, and the exit codes. Add `-a postgres` or `-P prod` and it'll show you that adapter's connection options too, loading only the adapter you asked about.

<Note>
There's also an <code>hsql</code> package on PyPI. It's a small metapackage that installs Harlequin, so <code>pip install hsql</code> works if that's what you reach for first.
</Note>

The [docs](/docs/headless/index) cover the rest: [running queries](/docs/headless/running-queries), [output formats](/docs/headless/output-formats), [exit codes](/docs/headless/exit-codes), and [what transfers from psql](/docs/headless/differences-from-psql) — the last one is worth skimming even if you never plan to type `hsql` yourself, because your agent will.

Harlequin is still for you. `hsql` is for everything else you've got working on your data.
