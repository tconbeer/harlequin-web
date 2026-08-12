---
title: Exit Codes and Errors
menuOrder: 13
---

<script>
    import Key from "$lib/components/key.svelte"
    import Note from "$lib/components/note.svelte"
    import Tip from "$lib/components/tip.svelte"
    import Link from "$lib/components/link.svelte"
</script>

`hsql`'s exit codes are part of its contract. They are documented, they are stable, and they are distinct enough that a script can decide what to do next without reading a single line of error text.

## The codes

- **`0`** — Success.
- **`1`** — Query error. The database connected fine and rejected your SQL.
- **`2`** — Usage or config error. A bad flag, an unknown profile, invalid TOML, or a request that doesn't make sense (like three result sets into one CSV).
- **`3`** — Connection error. `hsql` could not reach or authenticate to the database.
- **`4`** — Timed out or cancelled.
- **`130`** — Interrupted by <Key>ctrl+c</Key> (`SIGINT`).

The distinction between `1` and `3` is the one that pays for itself: a query error means fix the SQL, and a connection error means fix the connection. They call for completely different next steps, and guessing which one happened by matching strings against a driver's error message is a losing game.

<Note>
These are <code>hsql</code>'s codes, not <code>psql</code>'s. <code>psql</code> uses a different scheme, and the numbers do not line up. See <Link href="differences-from-psql">Differences from psql</Link>.
</Note>

## What an error looks like

Errors are one plain line on stderr. No panels, no boxes, no ANSI escapes, no traceback:

```bash
hsql -c "select * from usres"
```

```output
hsql: error: relation "usres" does not exist
```

Rich, boxed error panels are a feature of the Harlequin interface. Headless, an error is a string a script will read, so it is formatted like one.

**stdout stays completely empty when a query fails.** That is what lets you tell "the query returned no rows" apart from "the query did not run" — an empty result set is an empty file plus exit `0`, and a failure is an empty file plus a non-zero exit.

## Branching on the result

The simple case needs nothing but `if`:

```bash
if hsql -P prod -f checks.sql -F none; then
  echo "checks passed"
else
  echo "checks failed"
  exit 1
fi
```

When the difference matters, branch on the code:

```bash
hsql -P prod -tAc "select count(*) from orders" > count.txt
case $? in
  0) echo "ok" ;;
  1) echo "bad SQL — fix the query" ;;
  2) echo "bad invocation — check flags and profile" ;;
  3) echo "cannot reach the warehouse — retry or page someone" ;;
  4) echo "timed out" ;;
esac
```

<Tip>
Exit code <code>3</code> is the one worth retrying with a backoff. Exit codes <code>1</code> and <code>2</code> will fail exactly the same way the second time.
</Tip>

## Errors inside a multi-statement script

By default, `hsql` stops at the first statement the database rejects and exits `1`. With [`--on-error continue`](running-queries#handling-errors-in-a-script), the remaining statements still run, each failure is reported on stderr as it happens, and the process still exits non-zero if any statement failed. A script that half-worked never reports success.

## Truncation is not an error

If a result hits the [row limit](running-queries#row-limits-and-truncation), `hsql` writes a note to stderr and exits `0`. Truncation is a normal outcome, not a failure — but it _is_ something you have to notice, because a truncated `sum()` is a wrong number rather than a smaller one.

Two reliable ways to notice it:

- Read the note on stderr: `note: results truncated at 500 rows (--limit)`
- Check the `truncated` field in [`--stats`](running-queries#reporting-stats)

```bash
hsql --stats --csv -c "select * from orders" > orders.csv
```

```output
&lbrace;"status":"ok","statements":1,"rows":500,"truncated":true,"limit":500,"elapsed_ms":412,"columns":[&lbrace;"name":"id","type":"BIGINT"&rbrace;]&rbrace;
```
