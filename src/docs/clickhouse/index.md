---
title: "Adapter: ClickHouse"
description: "Connect Harlequin to a ClickHouse server over HTTP or the native protocol."
---

The ClickHouse adapter was contributed by [John DaCosta](https://github.com/johndacosta).

See the [harlequin-clickhouse repository](https://github.com/johndacosta/harlequin-clickhouse) for the most up-to-date documentation.

This adapter connects to a **ClickHouse server**. It is not the [chDB adapter](/docs/chdb), which runs ClickHouse locally. It is also not the older PyPI releases `harlequin-clickhouse` (0.1.1) or `harlequin-clickhouse-adapter` (0.1.2). Those names are already taken, so install this package from Git. It keeps the useful parts of both earlier adapters: HTTP and native TCP, a `system` catalog, ClickHouse type names, real completions, and query cancel.

## Installation

Install Harlequin and this adapter into the same environment:

```bash
uv tool install harlequin --with "harlequin-clickhouse @ git+https://github.com/johndacosta/harlequin-clickhouse"
```

## Usage

Select the adapter with `-a clickhouse`. The port chooses the protocol. Ports **8123** and **8443** use HTTP. Ports **9000**, **9004**, and **9440** use the native protocol. An omitted port uses HTTP 8123.

```bash
harlequin -a clickhouse "clickhouse://user:password@localhost:8123/default"
harlequin -a clickhouse "clickhouse://user:password@localhost:9000/default"
```

The same connection can be passed as options:

```bash
harlequin -a clickhouse \
  --host localhost --port 8123 \
  --user user --password "$CLICKHOUSE_PASSWORD" \
  --database default \
  --setting max_threads=4
```

`--secure` turns on TLS. Repeat `--setting key=value` for ClickHouse settings. `--interface http` or `--interface native` overrides the port guess. `--read-only` sets ClickHouse `readonly=1` on the server.

ClickHouse has no schemas. The catalog is a database, then a table or view, then a column. Column labels keep ClickHouse types such as `Array`, `Map`, `Tuple`, `Decimal`, `DateTime64`, and `Nullable`.

Put the password in a Harlequin profile as `${CLICKHOUSE_PASSWORD}` so it is not visible in the process list.

## hsql

`hsql` loads the same adapter. It is the command an agent should run.

```bash
hsql -a clickhouse \
  "clickhouse://localhost:8123/default" \
  --user user --password "$CLICKHOUSE_PASSWORD" \
  --limit 500 \
  -c "SELECT 1"
```

`-r` is server-side read-only. `--timeout` works because the adapter can cancel a query. `--catalog-search` is not implemented; list one catalog level with `--catalog --path`.

A Python caller can use `connect`, `get_catalog`, and `execute` from `harlequin_clickhouse`. This adapter does not add an MCP server.
