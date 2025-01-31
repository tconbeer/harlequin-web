---
title: "DuckDB Basic Usage"
topic: "Adapter: DuckDB"
menuOrder: 35
---

## Installation

The DuckDB adapter ships with Harlequin; you do not need to do anything else to install it.

If you want to control the version of DuckDB that Harlequin uses, see the [Troubleshooting](troubleshooting/duckdb-version-mismatch) page.

## Using Harlequin with DuckDB

To open an in-memory DuckDB session, run Harlequin with no arguments:

```bash
harlequin
```

To open one or more DuckDB database files, pass in relative or absolute paths as connection strings (Harlequin will create DuckDB databases if they do not exist):

```bash
harlequin "path/to/duck.db" "another_duck.db"
```

## Connection Options

### Read-Only

You can open a database in read-only mode using the `--read-only` or `-r` flag:

```bash
harlequin -r "path/to/duck.db"
```
