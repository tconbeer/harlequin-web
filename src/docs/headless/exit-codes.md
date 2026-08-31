---
title: Exit Codes and Streams
description: hsql's six exit codes, what it writes to stdout and stderr, the --stats summary, and what --on-error does after a statement fails.
---

<script>
    import Warning from "$lib/components/warning.svelte"
    import Tip from "$lib/components/tip.svelte"
</script>

hsql makes three promises to whatever is calling it, and they do not vary by
adapter:

1. **stdout is data.** Result sets, and nothing else.
2. **stderr is everything else.** Errors, warnings, notes, and the names of
   files hsql wrote.
3. **The exit code is the verdict.** It is meaningful, it is stable, and stdout
   is empty whenever it is non-zero.

That is the whole contract, and it is what makes hsql safe to put in a pipe.

## The Exit Codes

| Code  | Meaning                                                          | Whose bug it usually is     |
| ----- | ---------------------------------------------------------------- | --------------------------- |
| `0`   | Success.                                                         | —                           |
| `1`   | The database rejected the SQL.                                   | the query's                 |
| `2`   | A bad flag, a bad profile, or a config file hsql could not read. | the caller's                |
| `3`   | hsql could not connect.                                          | the environment's           |
| `4`   | `--timeout` ran out, and hsql stopped the run.                   | the query's, or the bound's |
| `130` | Interrupted.                                                     | nobody's                    |

A `2` means hsql never opened a connection: it is the code you get for a flag
that does not exist, for `-P` naming a profile no file defines, for a `${VAR}`
in a config file that is unset, and for asking a format that holds one result
set to print three. A `1` means the connection was fine and the database said
no.

Branch on the code before you look at the output:

```bash
if ! hsql -P prod --read-only -c "select 1" --format none; then
    echo "database is not reachable" >&2
    exit 1
fi
```

## Reading the Errors

Errors are one line on stderr, prefixed `hsql: error:`. Notes — the file names
`-o` wrote, a warning that a limit truncated a result — are prefixed `note:`.

<Warning>

Never run hsql with `2>/dev/null`. Truncation warnings and errors
both go to stderr, and suppressing that stream is exactly what turns a detected
problem into a wrong number. If stderr is noisy, redirect it to a log — and then
have something read the log.

</Warning>

For a failure you cannot place, [Troubleshooting](/docs/troubleshooting) covers
Harlequin and hsql together, and `hsql --info` — which connects to nothing,
redacts the profile it reports, and answers even when the config is broken —
is safe to paste into a bug report.

## `--stats`: the Machine-Readable Summary

For any format, `--stats` writes one line of JSON to stderr describing the run:

```bash
hsql -c "select 1" --format none --stats
```

```output
&lbrace;"status":"ok","statements":1,"rows":1,"truncated":false,"limit":500,"elapsed_ms":1,"columns":[&lbrace;"name":"1","type":"#"&rbrace;]&rbrace;
```

The keys are `status`, `statements`, `rows`, `truncated`, `limit`,
`elapsed_ms` and `columns`. `truncated` is the one to read every time: it is
`true` when the [row limit](/docs/headless/safety) cut a result set short, which
means any number computed from those rows is wrong.

Because `--stats` goes to stderr, a check on it redirects that stream and leaves
stdout alone:

```bash
hsql --limit -1 -c "select * from orders" --csv -o data.csv --stats 2>&1 \
    | jq -e '.truncated | not' > /dev/null
```

## `--on-error`, When There Is More Than One Statement

hsql runs as many statements as you pass it — repeated `-c` and `-f`, and
several statements separated by `;` inside either — in the order you typed
them, on one connection.

- `--on-error stop` (the default) stops at the first statement that fails.
- `--on-error continue` runs the rest anyway.

Either way, a failed statement makes the exit code non-zero: `continue` changes
what runs, not what hsql reports.

<Tip>

`--result all|last|N` decides which result sets reach stdout, which is a
different question from what runs; see
[Formats and Layouts](/docs/headless/formats).

</Tip>
