---
title: Running Safely
description: The row limit, --read-only and --timeout, the adapter capabilities that back them, and how hsql refuses rather than pretending.
---

<script>
    import Warning from "$lib/components/warning.svelte"
    import Note from "$lib/components/note.svelte"
</script>

Three options bound a run: how many rows it fetches, whether it can write, and
how long it can take. hsql refuses to connect when the adapter cannot enforce
the last two, rather than running unbounded.

## `--limit`

hsql fetches 500 rows per result set by default, and the database applies the
limit.

```bash
hsql -P prod --limit 100 -c "select * from orders"
hsql -P prod --limit -1 -c "select * from orders" --format parquet -o orders.parquet
```

`--limit -1` removes it. That is what you want before counting or aggregating
the rows yourself, or writing them anywhere.

<Warning>

A truncated result looks like a complete one. When a limit cuts a result set
short, hsql says so on stderr and [`--stats`](/docs/hsql/exit-codes) reports
`"truncated": true`.

</Warning>

[`--display-rows`](/docs/hsql/formats) is the softer knob: it caps what a text
layout prints without changing what was fetched.

## `--read-only`

`-r` (or `--read-only`) connects in a mode the database itself refuses writes
in. The database does the refusing, not a filter over your SQL:

```bash
hsql -r "path/to/duck.db" -c "insert into orders values (1)"
```

```output
hsql: error: Invalid Input Error: Cannot execute statement of type "INSERT" on database "duck" which is attached in read-only mode!
```

An adapter that cannot connect read-only makes hsql exit
[`2`](/docs/hsql/exit-codes) instead of connecting writable.

## `--timeout`

`--timeout SECONDS` bounds executing and fetching together, and exits
[`4`](/docs/hsql/exit-codes) when it runs out:

```bash
hsql --timeout 0.5 -c "select count(*) from range(100000000000) t(i)"
```

```output
hsql: error: timed out after 0.5s
```

hsql attributes the timeout explicitly, because a cancelled cursor comes back
empty and error-free, exactly like a query that matched nothing. As with
`--read-only`, hsql refuses to start when the adapter cannot cancel a query.

When a timeout fires, `explain`, a missing filter, or aggregating in SQL is
usually a better answer than a larger number.

## Adapter Capabilities

`hsql --info` reports what each installed adapter declares it supports, and
connects to nothing. `-a NAME` narrows it to one adapter, which is faster than
importing them all:

```bash
hsql --info -a sqlite | jq '.adapters.sqlite'
```

```output
&lbrace;
  "distribution": "harlequin",
  "version": "2.10.0",
  "capabilities": &lbrace;
    "implements_cancel": true,
    "implements_catalog_search": true,
    "implements_read_only": true,
    "implements_validate_sql": false
  &rbrace;,
  "error": null
&rbrace;
```

| Capability                  | What depends on it                       |
| --------------------------- | ---------------------------------------- |
| `implements_read_only`      | `-r`, `--read-only`                      |
| `implements_cancel`         | `--timeout`                              |
| `implements_catalog_search` | [`--catalog-search`](/docs/hsql/catalog) |
| `implements_validate_sql`   | Checking a statement without running it  |

<Note>

An adapter that is installed but will not import is reported with its
capabilities unknown and the import error beside it. That is a broken
installation rather than a broken config; see
[Troubleshooting](/docs/troubleshooting).

</Note>

## A Profile for Automation

`read_only`, `timeout` and `limit` are [profile keys](/docs/hsql/config), so no
invocation has to remember them:

```toml
[profiles.agent]
adapter = "postgres"
host = "$&lbrace;PGHOST&rbrace;"
password = "$&lbrace;PGPASSWORD&rbrace;"
read_only = true
timeout = 30
limit = -1
```

```bash
hsql -P agent -tAc "select count(*) from orders"
```

The [hsql Agent Skill](/docs/hsql/skill) covers the habits around these
options: read the catalog before guessing at a name, say what a write will
change before running it, and hand off to `harlequin` when a human should
drive.
