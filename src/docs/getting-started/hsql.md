---
title: Using hsql
---

<script>
    import Tip from "$lib/components/tip.svelte"
    import Warning from "$lib/components/warning.svelte"
</script>

`hsql` is your agent's favorite SQL client. It's the headless CLI for
[Harlequin](https://harlequin.sh), and shares the same config and query engine,
with an interface optimized for agents, scripts, and automations.

hsql is packaged with Harlequin, so you install it by [installing Harlequin](/docs/getting-started#installing-harlequin).

hsql can connect to dozens of databases using the same adapter plug-ins as Harlequin.

## Running hsql

Once hsql is installed, you run it from the command line. If you have used psql or the duckdb CLI, hsql will feel familiar, but hsql has the major advantage that it works with most databases and provides the same interface and produces the same output, regardless of the connected database. This means you (and your agent) can learn one tool, instead of several. In your shell, all hsql commands take the same form:

```bash
hsql [OPTIONS] [CONN_STR]
```

where `[OPTIONS]` is 0 or more pairs of the form `--[option-name] [option-value]`, and `[CONN_STR]` is 0 or more connection strings. `[OPTIONS]` are composed of both hsql options and adapter options. For a full list of options, run hsql with the `--help` option:

```bash
hsql --help
```

Every option, with its type, default and help text, is also on one page:
[Reference: hsql CLI](/docs/hsql/reference).

## Database Adapters

<Tip>
hsql and Harlequin use the same options for defining adapters, connection strings, and adapter options. If you can connect
to your database with Harlequin, just replace <code>harlequin</code> with <code>hsql</code>.
</Tip>

If you are new to Harlequin, see [Running Harlequin](/docs/getting-started/running) for more information.

Like Harlequin, hsql defaults to using its DuckDB database adapter, which ships with hsql and includes the full DuckDB in-process database.

Run a query against an in-memory DuckDB session, run hsql and pass in a query with the `-c` option:

```bash
hsql -c "select 1"
```

```output
 1
---
 1
(1 row)
```

To connect to a local DuckDB or SQLite database file, pass the path as a connection string; note that the `--adapter` option has a short alias, `-a`:

```bash
hsql -a sqlite "path/to/sqlite.db" -c "select * from users"
```

```output
 id | name
----+---------
 1  | Ted
 2  | Patrick
(2 rows)
```

Other adapters take URIs or DSNs as connection strings; for example, Postgres:

```bash
hsql -a postgres "postgresql://example.com/postgres:5432" -c "select * from invoices"
```

<Tip>

You should use [profiles](/docs/config-file) to keep credentials out of your shell
history.

</Tip>

## Configuring hsql and Using Profiles

hsql supports a number of options for setting the query limit, configuring output formats, and defining connection parameters. Options can be passed as command-line flags, or read from [config files](/docs/config-file). Config files store configurations under separate profiles, so you can easily switch between databases by reading from different profiles with the `-P` option:

```bash
hsql -P prod -c "select count(*) from orders" --csv
hsql -P dev -c "select * from users" --vertical --limit 5
hsql -P warehouse -c "..." --format parquet -o invoices.pq
```

hsql can also inspect, validate and write those files without running any
SQL; see [Config Modes](/docs/hsql/config).

## Data Layouts and File Formats

hsql supports all of the following formats for displaying and writing data:

- table
- markdown (alias: md)
- vertical
- csv
- tsv
- json
- jsonl (alias: ndjson)
- parquet
- orc
- feather (alias: arrow)
- none (suppresses output)

You can select a format with the `--format <name>`. Some formats have a shorthand `--<name>`, so these are equivalent: `--format csv`, `--csv`.

Some layouts can present the results from multiple queries. Others will raise an error and exit with code 2 if multiple queries are executed.

[Formats and Layouts](/docs/hsql/formats) covers all of them, the switches that
shape a text layout, and `-o`.

Additionally, for any layout, pass `--stats` to print summary info as JSON to stderr:

```bash
hsql -c "select 1" --format none  --stats
```

```output
&lbrace;"status":"ok","statements":1,"rows":1,"truncated":false,"limit":500,"elapsed_ms":1,"columns":[&lbrace;"name":"1","type":"#"&rbrace;]&rbrace;
```

Every key in that summary, and what to do about `truncated`, is on
[Exit Codes and Streams](/docs/hsql/exit-codes).

## Scripting with hsql

<Warning>
To make hsql safe and efficient for agents, by default hsql applies a 500-row
limit to all queries. To remove this limit, use <code>--limit -1</code> or set
<code>limit = -1</code> in your profile. If limits truncate data, hsql will print
a warning on stderr; we recommend that you do NOT suppress or redirect 
that message so do NOT use hsql with <code>2>/dev/null</code>.
</Warning>

hsql can write data to files, either with the `-o` option or by piping output (hsql only writes data to stdout; other messages go to stderr):

```bash
hsql -P prod --limit -1 -c "select * from users" --format parquet -o "users.pq"
hsql -P prod --limit -1 -c "select * from users" --csv > users.csv
```

hsql can execute multiple statements in one invocation, and supports several methods for doing so:

- Pass `-c` multiple times
- Include multiple queries, separated by `;`, in one `-c` option
- Pass one or more .sql files with `-f`, with multiple statements in each
- Use `--result` to define which queries output data to stdout
- Use `--on-error` to either `stop` or `continue` if one or more queries produces an error.

In other words, this works:

```bash
hsql -P prod --limit -1 --format md --result all --on-error stop \
    -f ./setup.sql \
    -c "select count(*) from raw_table" \
    -f ./build-models.sql \
    -c "select count(*) from modeled_table"
```

hsql's [exit codes](/docs/hsql/exit-codes) are meaningful and stable.

You can also use `--stats` and `jq` together to error on a truncated query:

```bash
hsql --limit 100 -c "select * from orders" --csv -o data.csv --stats 2>&1 | jq -e '.truncated | not' > /dev/null
```
