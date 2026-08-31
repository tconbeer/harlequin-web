---
title: Exit Codes and Streams
description: hsql's six exit codes, what it writes to stdout and stderr, the --stats summary, and what --on-error does after a statement fails.
---

<script>
    import Warning from "$lib/components/warning.svelte"
</script>

stdout carries result sets and nothing else. Every error, warning and note goes
to stderr. The exit code is the verdict, and stdout is empty whenever it is
non-zero — so read the code before the output.

## The Codes

| Code  | Meaning                                                          |
| ----- | ---------------------------------------------------------------- |
| `0`   | Success.                                                         |
| `1`   | The database rejected the SQL.                                   |
| `2`   | A bad flag, a bad profile, or a config file hsql could not read. |
| `3`   | hsql could not connect.                                          |
| `4`   | `--timeout` ran out, and hsql stopped the run.                   |
| `130` | Interrupted.                                                     |

A `2` means hsql never opened a connection. It covers a flag that does not
exist, a `-P` naming a profile no file defines, an unset `${VAR}` in a config
file, and a single-result format asked to print three result sets. A `1` means
the connection was fine and the database said no.

```bash
if ! hsql -P prod --read-only -c "select 1" --format none; then
    echo "database is not reachable" >&2
    exit 1
fi
```

## Errors and Notes

Errors are one line, prefixed `hsql: error:`. Notes — the files `-o` wrote, a
warning that a limit truncated a result — are prefixed `note:`.

<Warning>

`2>/dev/null` hides truncation warnings and errors alike. Redirect stderr to a
log if it is noisy, but keep it.

</Warning>

`hsql --info` connects to nothing, redacts the profile it reports, and answers
even when the config is broken, so it is safe to paste into a bug report.
[Troubleshooting](/docs/troubleshooting) covers hsql and the IDE together.

## `--stats`

For any format, `--stats` writes a one-line JSON summary of the run to stderr:

```bash
hsql -c "select 1" --format none --stats
```

```output
&lbrace;"status":"ok","statements":1,"rows":1,"truncated":false,"limit":500,"elapsed_ms":1,"columns":[&lbrace;"name":"1","type":"#"&rbrace;]&rbrace;
```

The keys are `status`, `statements`, `rows`, `truncated`, `limit`, `elapsed_ms`
and `columns`. `truncated` is `true` when the [row
limit](/docs/hsql/safety) cut a result set short, which means anything computed
from those rows is wrong.

```bash
hsql --limit -1 -c "select * from orders" --csv -o data.csv --stats 2>&1 \
    | jq -e '.truncated | not' > /dev/null
```

## `--on-error`

hsql runs every statement you pass it — repeated `-c` and `-f`, and several
statements separated by `;` inside either — in the order typed, on one
connection.

- `--on-error stop` (the default) stops at the first failure.
- `--on-error continue` runs the rest.

Either way a failed statement makes the exit code non-zero. `continue` changes
what runs, not what hsql reports.

Which result sets reach stdout is a separate question:
[`--result`](/docs/hsql/formats).
