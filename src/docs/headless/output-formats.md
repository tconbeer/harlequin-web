---
title: Output Formats
menuOrder: 12
---

<script>
    import Note from "$lib/components/note.svelte"
    import Tip from "$lib/components/tip.svelte"
    import Link from "$lib/components/link.svelte"
</script>

`hsql` can write a result set as an aligned table, a Markdown table, CSV, TSV, JSON, JSONL, a vertical record listing, Parquet, Arrow, or ORC — or discard it entirely and just report status.

Choose one with `-F` (`--format`):

```bash
hsql -F markdown -c "select * from orders limit 3"
```

Every format also has a shorthand flag, because a format is the thing you change most often:

```bash
hsql --json -c "select * from orders limit 3"
```

## The contract: stdout is data, stderr is narration

This is the rule that makes every format above usable in a pipeline:

- **stdout carries results and nothing else.** No banners, no timings, no row counts, no warnings, no progress.
- **stderr carries everything a human or a script needs to know about the run** — row counts, elapsed time, truncation notices, warnings, and errors.

So this writes a clean CSV file and still reports what it did:

```bash
hsql --csv -l 0 -c "select * from orders where order_date = '2026-08-09'" > orders.csv
```

```output
1284 rows in 0.31s
```

And this is safe, because a failed query writes _nothing_ to stdout:

```bash
hsql --json -c "select * from orders" | jq '.[0]'
```

Two more guarantees follow from the same rule:

- **Adding `--stats` never changes stdout.** The JSON summary goes to stderr.
- **Output does not depend on where it is going.** The bytes are identical whether stdout is a terminal, a pipe, a file, or a pty, and identical across platforms and locales. `hsql` writes `\n` line endings everywhere and never formats numbers according to `LC_ALL`. Color is the single exception, and it is [opt-in](running-queries#color).

## The formats

### table

The default. Aligned plain text, sized to the widest value in each column, and measured in terminal cells so that CJK and emoji line up like everything else.

```bash
hsql -c "select 1 as id, 'widget' as name, null as sku"
```

```output
 id | name   | sku
----+--------+------
 1  | widget | NULL
```

### markdown (`md`)

A pipe table. This is the format to reach for when the reader is a language model — the delimiters are unambiguous, and models reproduce them accurately.

```bash
hsql --markdown -c "select 1 as id, 'widget' as name"
```

```output
| id | name   |
| -- | ------ |
| 1  | widget |
```

### csv, tsv

For pipelines and spreadsheets. RFC 4180 quoting and escaping, with `tsv` differing only in its separator.

```bash
hsql --csv -c "select * from orders" -o orders.csv
```

### json

An array of row objects, matching what `duckdb -json` produces. Numbers are unquoted, booleans are bare `true`/`false`, SQL `NULL` is JSON `null`, and nested structs and lists are preserved as nested JSON.

```bash
hsql --json -c "select 1 as id, 'widget' as name"
```

```output
[&lbrace;"id":1,"name":"widget"&rbrace;]
```

### jsonl (`ndjson`)

One JSON object per line. The right choice for large results and for line-oriented tooling, and — unlike `json` — it can hold several result sets in one stream.

### vertical

One column per line, like `\x` in `psql`. The best way to read a single wide row without horizontal scrolling.

```bash
hsql --vertical -c "select * from orders limit 1"
```

```output
-[ RECORD 1 ]-------------------
id          | 1
customer_id | 4172
total       | 129.95
```

### parquet, arrow (`feather`), orc

Columnar files, for handing a lot of data to another tool without paying to serialize it as text. These are the same exporters the TUI's [Data Exporter](../export) uses.

```bash
hsql --format parquet -c "select * from orders" -o orders.parquet
```

<Note>
Columnar formats are binary, so give them a destination with <code>-o</code> rather than piping them into a terminal.
</Note>

### none

Runs the SQL, discards the rows, and reports status on stderr. Use it for DDL, DML, and ETL, where the row payload is not the point.

```bash
hsql -F none -f migration.sql
```

## Shaping text output

Four options adjust the text formats, and they compose freely:

- **`-t`, `--tuples-only`** — rows only: no header, no footer.
- **`-A`, `--no-align`** — unaligned output: no padding.
- **`--no-header`** — drop the header row but keep the rest of the chrome.
- **`--null-string STR`** — how `NULL` is rendered. Defaults to empty for `csv` and `tsv`, and `NULL` for `table`.

`-t` and `-A` are the `psql` flags, and they mean the same thing here. Together they give you the standard way to capture one value in a shell script:

```bash
hsql -tAc "select count(*) from orders"
```

```output
128411
```

Nothing else — no header, no footer, no padding, no quotes. Just the number and a newline.

<Tip>
Distinguishing an empty string from <code>NULL</code> in CSV output? Set <code>--null-string</code> to something unmistakable, like <code>--null-string '\N'</code>.
</Tip>

## One serializer, every database

`hsql` renders values the same way no matter which adapter produced them. A `timestamptz` from Postgres, from BigQuery, and from DuckDB all print identically; a boolean is always `true` or `false`; a blob is always hex, never a Python `repr`.

That consistency is the point of the whole exercise. It means a script that parses `hsql` output keeps working when you point it at a different warehouse, and it means the strings you see in `-F table` are exactly the strings you get in `-F csv`.

<Note>
This is also why <code>hsql</code> output looks a little different from the Results Viewer. The TUI formats values for a human reading a screen — thousands separators according to your locale, check marks for booleans. <code>hsql</code> serializes values for a machine reading a file. Same data, different job.
</Note>

## Several result sets in one run

`table`, `markdown`, `vertical`, and `jsonl` can hold more than one result set and will emit them in order. `csv`, `tsv`, and `json` cannot, and `hsql` raises a usage error rather than writing two headers into one file. See [Multiple result sets](running-queries#multiple-result-sets).

<Note>
Nothing streams: <code>hsql</code> materializes a result set before writing it, in every format. That is a known limitation for very large results, and the reason the default <Link href="running-queries#row-limits-and-truncation">row limit</Link> is 500.
</Note>
