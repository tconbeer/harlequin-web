---
title: Running Safely
description: The row limit, --read-only and --timeout, the adapter capabilities that back them, and how hsql refuses rather than pretending.
---

<script>
    import Tip from "$lib/components/tip.svelte"
    import Warning from "$lib/components/warning.svelte"
    import Note from "$lib/components/note.svelte"
</script>

Three options bound what an invocation can do: how many rows it may fetch,
whether it may write, and how long it may run. hsql's part of the bargain is
that it never pretends — if the adapter cannot enforce a bound, hsql refuses to
connect at all rather than running unbounded and reporting success.

## The Row Limit Is Real

hsql fetches at most **500 rows per result set** unless you tell it otherwise,
and the limit is applied by the database, not by the printer. It is there
because the most common way for an agent to waste a context window — or a
person to wait ten minutes for a mistake — is `select * from` a table nobody
looked at first.

```bash
hsql -P prod --limit 100 -c "select * from orders"
hsql -P prod --limit -1 -c "select * from orders" --format parquet -o orders.parquet
```

`--limit -1` removes the limit, and that is what you want before counting or
aggregating the rows yourself, or writing them anywhere.

<Warning>

A truncated result is a wrong answer that looks like a right one. When a limit
cuts a result set short, hsql says so on stderr and
[`--stats`](/docs/headless/exit-codes) reports
`"truncated": true` — which is why hsql should never be run with
`2>/dev/null`.

</Warning>

`--display-rows` is the other, softer knob: it caps what a text layout
[prints](/docs/headless/formats) without changing what was fetched. If a number
looks short, `--limit` is the one to check.

## `--read-only`

`-r` (or `--read-only`) connects in a mode the database itself refuses writes
in. It is not a filter over your SQL — the database is the one saying no:

```bash
hsql -r "path/to/duck.db" -c "insert into orders values (1)"
```

```output
hsql: error: Invalid Input Error: Cannot execute statement of type "INSERT" on database "duck" which is attached in read-only mode!
```

An adapter that cannot connect read-only makes hsql exit
[`2`](/docs/headless/exit-codes) rather than connect writable and hope.

## `--timeout`

`--timeout SECONDS` bounds the whole run — executing _and_ fetching — and exits
[`4`](/docs/headless/exit-codes) when it runs out:

```bash
hsql --timeout 0.5 -c "select count(*) from range(100000000000) t(i)"
```

```output
hsql: error: timed out after 0.5s
```

hsql attributes the timeout explicitly, because a cancelled cursor comes back
empty and error-free — exactly like a query that matched nothing — and an empty
result should never be reported as a success it was not.

As with `--read-only`, hsql refuses to start when the adapter cannot cancel a
query, so the bound is a real one rather than a hope.

<Tip>

In a scheduled job, set it. An unbounded query holds a connection until
something else kills it — and when a timeout fires, the fix is usually
`explain`, a filter you forgot, or aggregating in SQL rather than fetching rows
to count them; not a larger number.

</Tip>

## What an Adapter Can Do

`hsql --info` reports what each installed adapter declares it supports, and
connects to nothing to do it. `-a NAME` narrows it to one adapter, which is much
faster than importing them all:

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

| Capability                  | What depends on it                           |
| --------------------------- | -------------------------------------------- |
| `implements_read_only`      | `-r`, `--read-only`                          |
| `implements_cancel`         | `--timeout`                                  |
| `implements_catalog_search` | [`--catalog-search`](/docs/headless/catalog) |
| `implements_validate_sql`   | Checking a statement without running it      |

<Note>

An adapter that is installed but will not import is reported with its
capabilities unknown and the import error beside it. That is a broken
installation rather than a broken config; see
[Troubleshooting](/docs/troubleshooting).

</Note>

## A Profile That Carries the Bounds

`read_only`, `timeout` and `limit` are all [profile
keys](/docs/headless/config), so a profile meant for automation can carry them
and no invocation has to remember:

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

That is the shape to hand an agent: no credential on the command line, no write
it did not ask for, and a bound on how long it can hold a connection. The
[hsql Agent Skill](/docs/headless/skill) teaches the rest of the habits — ask
before you write, read the catalog before you guess at a name, and hand off to
`harlequin` when a human should be driving.
