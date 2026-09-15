---
title: "Adapter: chDB"
description: "Run ClickHouse SQL locally with chDB."
---

The chDB adapter was contributed by the [chDB team](https://github.com/chdb-io).

See the [harlequin-chdb repository](https://github.com/chdb-io/harlequin-chdb) for the latest documentation.

## Installation

Install Harlequin with the chDB adapter:

```bash
uv tool install 'harlequin[chdb]'
```

## Usage

Run an in-memory database:

```bash
harlequin -a chdb
```

Use a persistent local database:

```bash
harlequin -a chdb /path/to/chdb-data
```

You can also pass a chDB ADBC URI with `--uri`, or use `--path` for a persistent database directory. Add `--read-only` to prevent writes and `--show-system` to include system databases in the catalog.

The adapter is also available to `hsql`:

```bash
hsql -a chdb -c "SELECT 1 AS value"
```
