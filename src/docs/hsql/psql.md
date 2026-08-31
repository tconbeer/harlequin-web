---
title: Differences from psql
description: What carries over from psql to hsql — -c, -f, -t, -A, -x — and the places where the same job has a different flag.
---

<script>
    import Warning from "$lib/components/warning.svelte"
</script>

`-c`, `-f`, `-t`, `-A` and `-x` mean what they mean in psql, so this prints a
bare number in either program:

```bash
hsql -tAc "select count(*) from orders"
```

It prints it the same way against every [adapter](/docs/adapters), which is the
part psql cannot do.

## What Is Different

|                             | psql                                                | hsql                                                                                    |
| --------------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `-P`                        | `--pset`, an output setting                         | `--profile`, a [config-file profile](/docs/hsql/config)                                 |
| Field separator             | `-F`                                                | `--csv`, `--format tsv`, or any other [`--format`](/docs/hsql/formats)                  |
| Listing databases           | `-l`                                                | [`--catalog`](/docs/hsql/catalog)                                                       |
| Describing an object        | `\d`, `\dt`                                         | `--catalog --path`, `--catalog-search`                                                  |
| Stopping on the first error | `-v ON_ERROR_STOP=1`                                | `--on-error stop`, the default                                                          |
| One transaction             | `-1`                                                | write `begin` and `commit` in your script                                               |
| `-o`                        | a file for query output                             | a file, or a directory that gets one file per result set                                |
| Connection flags            | `-h`, `-p`, `-U`, built in                          | the adapter's, so `hsql --help -a postgres` lists them                                  |
| Row limits                  | none                                                | [500 rows by default](/docs/hsql/safety); `--limit -1` removes it                       |
| Suppressing chatter         | `-q`                                                | nothing to suppress: stdout is only ever results                                        |
| Exit codes                  | `1` its own error, `2` connection, `3` script error | [`1` query error, `2` usage/config, `3` connection, `4` timeout](/docs/hsql/exit-codes) |

<Warning>

`-t` is _tuples only_, as in psql, not Harlequin's theme flag. Connection
strings are positional, so `hsql -t nord -c "..."` parses, `nord` becomes a
connection string, and hsql says so on stderr.

</Warning>

## No Backslash Commands

hsql has no meta-commands. What they do, options do:

- `\d`, `\dt`, `\l` — [`--catalog` and `--catalog-search`](/docs/hsql/catalog),
  which produce ordinary result sets.
- `\copy` — [`--csv` and `-o`](/docs/hsql/formats), or `--format parquet`.
- `\timing` — `--stats`, which reports `elapsed_ms` on stderr.
- `\c` — a different profile: `-P NAME`.
- `\set` — the profile, or the command line. One invocation, no session
  variables.

## No Interactive Session

hsql executes what it was passed and exits; there is no prompt. For an
interactive session, [Harlequin](/docs/getting-started/usage) uses the same
adapters, config files and profiles: `harlequin -P prod`.
