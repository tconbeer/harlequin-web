---
title: SQLite Basic Usage
topic: "Adapter: SQLite"
menuOrder: 45
---

## Installation

The SQLite adapter ships with Harlequin; you do not need to do anything else to install it.

## Using Harlequin with SQLite

To open an in-memory SQLite session, run Harlequin with the `-a sqlite` option but no arguments:

```bash
harlequin -a sqlite
```

Open one or more SQLite database files by passing in their paths as arguments:

```bash
harlequin -a sqlite "path/to/sqlite.db" "another_sqlite.db"
```

## Connection Options

### Connection Modes

Open databases in read-only mode using `-r`:

```bash
harlequin -a sqlite -r "path/to/sqlite.db"
```

As an alternative to the `-r` flag, specify a mode parameter directly using the `--mode` option:

```bash
harlequin -a sqlite --mode rw
```

### Timeout

Specify a maximum number of seconds Harlequin should wait to read from a table that is locked:

```bash
harlequin -a sqlite --timeout 60
```

### Statement Caching

Specify the number of statements that SQLite should cache, to avoid parsing overhead:

```bash
harlequin -a sqlite --cached-statements 256
```
