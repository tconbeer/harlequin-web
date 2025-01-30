---
title: "DuckDB Basic Usage"
topic: "Adapter: DuckDB"
menuOrder: 35
---

## Installation

The DuckDB adapter ships with Harlequin; you do not need to do anything else to install it.

## Using Harlequin with DuckDB

From any shell, to open one or more DuckDB database files:

```bash
harlequin "path/to/duck.db" "another_duck.db"
```

To open an in-memory DuckDB session, run Harlequin with no arguments:

```bash
harlequin
```

You can also open a database in read-only mode:

```bash
harlequin -r "path/to/duck.db"
```

The following pages detail more advanced options of Harlequin with DuckDB: running initialization scripts, loading extensions, and using MotherDuck.
