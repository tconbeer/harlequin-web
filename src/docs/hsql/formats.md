---
title: Formats and Layouts
description: Every hsql output format, the shorthand flags, the layout switches that shape a text layout, and how -o writes results to files.
---

<script>
    import Note from "$lib/components/note.svelte"
</script>

`--format NAME` picks how results are laid out, or what file format they are
written in. Five formats also have a shorthand flag: `--csv`, `--json`,
`--jsonl`, `--markdown`, and `--vertical` (also `-x`, as in psql).

```bash
hsql -c "select 1" --format csv
hsql -c "select 1" --csv
```

## The Formats

Text layouts, which draw chrome and are meant to be read:

- `table` — the default: aligned columns, a header, a row-count footer.
- `markdown` (alias `md`) — a markdown table.
- `vertical` — one field per line, for a row too wide to read across.

File formats, meant for another program:

- `csv`, `tsv`
- `json`, `jsonl` (alias `ndjson`)
- `parquet`, `orc`, `feather` (alias `arrow`)

And `none`, which runs the SQL and writes nothing.

<Note>

Only the text layouts, `jsonl` and `none` carry more than one result set.
`csv`, `json`, `parquet` and the rest hold exactly one and exit
[`2`](/docs/hsql/exit-codes) rather than concatenating, unless `-o` names a
directory, which gets one file per result set. Otherwise a run with several
result sets wants `--result last` or `--jsonl`. The [CLI
reference](/docs/hsql/reference) has the table, suffix by suffix.

</Note>

## Choosing One

| What you want                            | What to use                       |
| ---------------------------------------- | --------------------------------- |
| One value, for a shell variable          | `-tAc "select …"`                 |
| A few rows to read                       | the default `table`               |
| Rows to paste into a document or a reply | `--markdown`                      |
| A wide row, read field by field          | `-x`                              |
| Input for another program                | `--csv`, or `--jsonl`             |
| More rows than belong in a terminal      | `--format parquet -o out.parquet` |
| The run's side effects, not its rows     | `--format none`                   |

`-t` drops the header and footer, `-A` drops the alignment padding, so `-tAc`
prints a bare value with a newline after it:

```bash
row_count=$(hsql -P prod -tAc "select count(*) from orders")
```

## Layout Switches

These shape the text layouts, independently of `--format`. A file format
ignores the ones that do not apply to it.

| Option                        | What it does                                                                                                    |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `-t`, `--tuples-only`         | Rows only: no header, no footer. As in psql.                                                                    |
| `-A`, `--no-align`            | Unaligned output. As in psql.                                                                                   |
| `--no-header`                 | Drop the header row, keep the rest.                                                                             |
| `--no-footer`                 | Drop the row-count footer, keep the rest.                                                                       |
| `--null-string TEXT`          | Render NULL as TEXT. Text layouts default to `NULL`, csv to empty.                                              |
| `--display-rows N`            | How many rows a text layout prints; `-1` for all. Defaults to 40 for `table` and `markdown`, 10 for `vertical`. |
| `--color auto\|always\|never` | Color text output. `never` by default; `auto` follows the terminal and `NO_COLOR`.                              |

`--display-rows` is not a limit: the rows were fetched, and this is how many
print. [`--limit`](/docs/hsql/safety) is the one that changes what the database
returns.

## Writing to a File or Directory

`-o PATH` writes results to a file instead of stdout, in the same bytes a
redirect would produce:

```bash
hsql -P prod --limit -1 -c "select * from users" --format parquet -o users.parquet
hsql -P prod --limit -1 -c "select * from users" --csv > users.csv
```

`-o` also takes a directory, and then writes one file per result set, named
with the format's suffix and reported on stderr:

```bash
hsql -P prod --limit -1 --csv -o ./out/ -f ./three_reports.sql
```

## `--result`

`--result` picks which result sets reach stdout when a run produced more than
one:

- `--result all` (the default) — every one.
- `--result last` — the final one. The usual choice for a script that sets
  things up and ends in a `select`.
- `--result N` — the Nth.

```bash
hsql -P prod --limit -1 --format md --result last --on-error stop \
    -f ./setup.sql \
    -c "select count(*) from raw_table" \
    -f ./build-models.sql \
    -c "select count(*) from modeled_table"
```

Every statement still runs. What happens after one of them fails is
[`--on-error`](/docs/hsql/exit-codes).

Harlequin writes the same formats from its results viewer; see [Exporting
Data](/docs/export).
