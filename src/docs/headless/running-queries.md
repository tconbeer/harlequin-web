---
title: Running Queries with hsql
menuOrder: 11
---

<script>
    import Note from "$lib/components/note.svelte"
    import Tip from "$lib/components/tip.svelte"
    import Warning from "$lib/components/warning.svelte"
    import Link from "$lib/components/link.svelte"
</script>

Every `hsql` invocation has the same shape: pick a database, give it some SQL, and choose what comes out.

```bash
hsql [OPTIONS] [CONN_STR]...
```

The database comes from a [profile](../config-file/profiles) (`-P prod`), an adapter (`-a postgres`), a connection string, or all three. The SQL comes from `-c`, from `-f`, or from stdin. Everything else is [output](output-formats).

## Passing SQL

### From the command line

`-c` (`--command`) takes SQL as a string:

```bash
hsql -c "select * from orders limit 5"
```

`-c` is repeatable, and the statements run in the order you wrote them:

```bash
hsql -c "create table t as select 1 as a" -c "select * from t"
```

### From a file

`-f` (`--file`) reads SQL from a file, and is also repeatable:

```bash
hsql -f setup.sql -f report.sql
```

A file may contain any number of statements separated by semicolons. `hsql` splits them using the same parser the Query Editor uses when you run a selection, so a script that behaves one way in Harlequin behaves the same way here — semicolons inside string literals, comments, and quoted identifiers are not statement boundaries.

<Note>
On the <code>harlequin</code> command, <code>-f</code> is <code>--show-files</code>. On <code>hsql</code>, <code>-f</code> is <code>--file</code>, as in <code>psql</code>. See <Link href="differences-from-psql">Differences from psql</Link>.
</Note>

### From stdin

Pass `-` as the filename to read from stdin, which makes `hsql` a normal member of a pipeline:

```bash
cat report.sql | hsql -f - -P prod
```

```bash
hsql -f - &lt;&lt;'SQL'
select customer_id, sum(total) as revenue
from orders
group by 1
order by 2 desc
SQL
```

## Row limits and truncation

By default, `hsql` returns at most **500 rows** per result set. This is a deliberate choice: headless output usually ends up in a file, a pipe, or a language model's context, and an accidental `select *` against a fact table is expensive in all three.

Raise it, lower it, or turn it off with `-l` (`--limit`):

```bash
hsql -l 5000 -c "select * from orders"
```

```bash
hsql -l 0 -c "select * from orders"
```

`-l 0` means no limit.

**`hsql` always tells you when it truncated a result.** The notice goes to stderr, so it can never corrupt your data:

```
note: results truncated at 500 rows (--limit)
```

and the text formats add a visible footer:

```
… 500 of 500+ rows
```

The `+` is honest rather than coy. `hsql`'s limit is a _fetch_ limit — it is applied by the database, so fewer rows cross the wire — which means `hsql` knows another row existed but not how many. Only `-l 0` yields an exact count.

<Warning>
Harlequin's <code>--limit</code> and <code>hsql</code>'s <code>--limit</code> are different limits with the same name. In the TUI, <code>--limit</code> is a display cap applied after fetching every row, which is why the Results Viewer can report <code>Showing 100,000 of 3,412,887</code>. In <code>hsql</code>, it caps what leaves the database. If you set <code>limit</code> in a shared profile, both commands will read it, and neither is wrong — they just do different things with it.
</Warning>

The truncation notice fires even under `-t` (`--tuples-only`). `-t` suppresses chrome on stdout; it does not suppress warnings on stderr.

## Multiple result sets

One invocation can produce several result sets — `-c "select 1; select 2"`, or the common case of a script with a few setup statements followed by the query you care about. `--result` chooses which ones to emit:

- `--result all` (default) — every result set, in order
- `--result last` — only the final one
- `--result N` — only the Nth, counting from 1

With a single statement, which is most invocations, the flag does nothing.

The default is `all` in every format, so the same command always emits the same thing. Some formats cannot hold more than one result set, and rather than silently dropping data, `hsql` stops and tells you how to fix it:

```bash
hsql --csv -c "select 1; select 2; select 3"
```

```
hsql: error: 3 result sets, but csv holds one; use --result last or --result 3
```

That is a [usage error](exit-codes), exit code 2. `table`, `markdown`, `vertical`, and `jsonl` can all hold several result sets and will simply print them in order.

## Handling errors in a script

By default `hsql` stops at the first statement the database rejects:

```bash
hsql -f migration.sql --on-error stop
```

Use `--on-error continue` to run the remaining statements anyway. Each failure is reported on stderr as it happens, and `hsql` still exits non-zero if any statement failed, so a script that "mostly worked" never looks like a success:

```bash
hsql -f cleanup.sql --on-error continue
```

## Writing results to a file

Redirecting stdout works, because stdout carries nothing but data:

```bash
hsql --csv -c "select * from orders" > orders.csv
```

`-o` (`--output`) does the same thing without the shell:

```bash
hsql --csv -c "select * from orders" -o orders.csv
```

The two produce identical bytes. Use `-o` when you want the path recorded in the command itself, or when you are writing a binary format like `parquet` from a context where redirection is awkward.

## Reporting: --stats

`--stats` writes one line of JSON to stderr summarizing what happened:

```bash
hsql --stats --csv -c "select * from orders" > orders.csv
```

```
&lbrace;"status":"ok","statements":1,"rows":500,"truncated":true,"limit":500,"elapsed_ms":412,"columns":[&lbrace;"name":"id","type":"BIGINT"&rbrace;]&rbrace;
```

Because it goes to stderr, `--stats` works with every output format — including `parquet` and `arrow` — and adding it never changes a single byte on stdout.

<Tip>
<code>--stats</code> is the fastest way for a script or an agent to learn the shape of a result set: row count, column names, column types, elapsed time, and whether the result was truncated, all without parsing the output.
</Tip>

## Color

`hsql` writes plain text by default, whether stdout is a terminal, a pipe, or a file. Use `--color always` if you want ANSI styling in a terminal, or `--color auto` to style only when stdout is a TTY:

```bash
hsql --color auto -c "select * from orders limit 5"
```

`hsql` honors the [`NO_COLOR`](https://no-color.org/) environment variable. Color is the only thing about `hsql`'s output that depends on where that output is going; the data itself is byte-identical every time.

## Selecting a database

Everything Harlequin knows about connecting is available here. Profiles are the recommended path:

```bash
hsql -P prod -c "select 1"
```

Adapters and connection strings work as they do on the `harlequin` command:

```bash
hsql -a sqlite "path/to/sqlite.db" -c "select * from orders"
```

```bash
hsql -a postgres --host localhost --user postgres --dbname analytics -c "select 1"
```

To find an adapter's connection options, ask for help with the adapter named:

```bash
hsql --help -a postgres
```

<Warning>
Avoid passing secrets as command-line options. Anything in <code>argv</code> is visible to other users through <code>ps</code>, and it lands in your shell history and in the transcript of any agent that ran it. Put credentials in a <Link href="../config-file/index">config file</Link> and pass a profile name instead.
</Warning>

To ignore a default profile for one invocation, use the special profile name `None`:

```bash
hsql -P None -c "select 1"
```
