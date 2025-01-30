---
title: "Adapter: SQLite"
menuOrder: 45
---

## Installation

The SQLite adapter ships with Harlequin; you do not need to do anything else to install it.

## Using Harlequin with SQLite

From any shell, to open one or more SQLite database files:

```bash
harlequin -a sqlite "path/to/sqlite.db" "another_sqlite.db"
```

To open an in-memory SQLite session, run Harlequin with no arguments:

```bash
harlequin -a sqlite
```

You can also open databases in read-only mode:

```bash
harlequin -a sqlite -r "path/to/sqlite.db"
```

As an alternative to the `-r` flag, you can specify a mode parameter directly using the `--mode` option:

```bash
harlequin -a sqlite --mode rw
```

Other configuration options are available for SQLite, including specifying the timeout, isolation level, and statement cache. For more information, run:

```bash
harlequin --help
```
