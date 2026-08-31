---
title: Formats and Layouts
description: Every hsql output format, the shorthand flags, the layout switches that shape a text layout, and how -o writes results to files.
---

<script>
    import Tip from "$lib/components/tip.svelte"
    import Note from "$lib/components/note.svelte"
</script>

One `--format` option covers both _how a result set is laid out_ and _what file
format it is written in_, because from hsql's side those are the same question:
the rows are the same either way, and the difference is who is going to read
them.

```bash
hsql -c "select 1" --format csv
hsql -c "select 1" --csv
```

The two lines above are identical. `--format NAME` takes any format's name;
five of them also have a shorthand flag of their own: `--csv`, `--json`,
`--jsonl`, `--markdown`, and `--vertical` (also `-x`, as in psql).

## The Formats

**Text layouts**, meant to be read by a person, and the only ones that draw any
chrome:

- `table` — the default: aligned columns, a header, and a row-count footer.
- `markdown` (alias `md`) — a markdown table, for pasting into a document, an
  issue, or an agent's own reply.
- `vertical` — one field per line, for a row too wide to read across.

**File formats**, meant to be read by another program:

- `csv`, `tsv`
- `json`, `jsonl` (alias `ndjson`)
- `parquet`, `orc`, `feather` (alias `arrow`)

And `none`, which runs the SQL and writes nothing at all — for a statement you
are running for its side effects, or a connection check.

<Note>

Only the text layouts, `jsonl` and `none` can carry more than one result set.
`csv`, `json`, `parquet` and the other file formats hold exactly one, and exit
[`2`](/docs/hsql/exit-codes) rather than silently concatenating two —
so pass `--result last` (or `--result 2`, or `--jsonl`) when a run produces
several. The generated [CLI reference](/docs/hsql/reference) has the table,
suffix by suffix.

</Note>

## Choosing One

| What you want                            | What to use                       |
| ---------------------------------------- | --------------------------------- |
| One value, for a shell variable          | `-tAc "select …"`                 |
| A few rows you will read yourself        | the default `table`               |
| Rows to paste into a document or a reply | `--markdown`                      |
| A wide row, read field by field          | `-x`                              |
| Input for another program                | `--csv`, or `--jsonl`             |
| More rows than belong in a terminal      | `--format parquet -o out.parquet` |
| The run's side effects, not its rows     | `--format none`                   |

`-tAc "select count(*) from orders"` is the idiom worth memorizing: `-t` drops
the header and footer, `-A` drops the alignment padding, and what comes back is
the bare value with a newline after it.

```bash
row_count=$(hsql -P prod -tAc "select count(*) from orders")
```

## Layout Switches

These shape the text layouts. They are independent of `--format`, and a file
format ignores the ones that do not apply to it.

| Option                        | What it does                                                                                                              |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `-t`, `--tuples-only`         | Rows only: no header, no footer. As in psql.                                                                              |
| `-A`, `--no-align`            | Unaligned output. As in psql.                                                                                             |
| `--no-header`                 | Drop the header row, keeping the rest of the chrome.                                                                      |
| `--no-footer`                 | Drop the row-count footer, keeping the rest.                                                                              |
| `--null-string TEXT`          | Render NULL as TEXT. Text layouts default to `NULL`, csv to empty.                                                        |
| `--display-rows N`            | How many rows a text layout _prints_; `-1` for all of them. Defaults to 40 for `table` and `markdown`, 10 for `vertical`. |
| `--color auto\|always\|never` | Color text output. `never` by default; `auto` follows the terminal and `NO_COLOR`.                                        |

<Tip>

`--display-rows` is not a limit: hsql fetched every row, and this is how many of
them it prints. `--limit` is the one that changes what the database returns —
see [Running Safely](/docs/hsql/safety).

</Tip>

## Writing to a File

`-o PATH` writes the results to a file instead of stdout. The bytes are
identical to a shell redirect, so pick whichever reads better:

```bash
hsql -P prod --limit -1 -c "select * from users" --format parquet -o users.parquet
hsql -P prod --limit -1 -c "select * from users" --csv > users.csv
```

`-o` also takes a directory, which is how one invocation writes one file per
result set. hsql names them itself, using the format's own suffix, and reports
the names it chose on stderr:

```bash
hsql -P prod --limit -1 --csv -o ./out/ -f ./three_reports.sql
```

## Which Result Set Reaches stdout

`--result` picks, when a run produced more than one:

- `--result all` (the default) emits every result set.
- `--result last` emits only the final one — the usual choice for a script that
  sets things up and ends in a `select`.
- `--result N` emits the Nth.

```bash
hsql -P prod --limit -1 --format md --result last --on-error stop \
    -f ./setup.sql \
    -c "select count(*) from raw_table" \
    -f ./build-models.sql \
    -c "select count(*) from modeled_table"
```

Every statement still runs; `--result` only decides what is printed. What
happens after one of them fails is
[`--on-error`](/docs/hsql/exit-codes)'s business.

<Tip>

Exporting from the IDE rather than the CLI? Harlequin writes the same formats
from its results viewer — see [Exporting Data](/docs/export).

</Tip>
