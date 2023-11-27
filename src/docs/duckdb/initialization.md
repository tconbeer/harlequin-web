---
title: Initialization Scripts
menuOrder: 21
---

Each time you start Harlequin, it will execute commands from a DuckDB [initialization script](https://duckdb.org/docs/api/cli#configuring-the-cli). Such a script can contain both SQL and DuckDB CLI [dot commands](https://duckdb.org/docs/api/cli#special-commands-dot-commands). For example:

```sql
INSTALL httpfs;
LOAD httpfs;
SET s3_region='us-west-2';
.open './my-database.db'
```

Multi-line SQL is allowed, but must be terminated by a semicolon. Dot commands must be newline-terminated.

## Configuring the Script Location

By default, Harlequin will execute the script found at `~/.duckdbrc`. However, you can provide a different path using the `--init-path` option (aliased to `-i` or `-init`):

```bash
harlequin --init-path path/to/my/script.sql
```

## Disabling Initialization

If you would like to open Harlequin without running the script you have at `~/.duckdbrc`, you can either pass a nonexistent path to the option above, or start Harlequin with the `--no-init` option:

```bash
harlequin --no-init
```

## Supported Dot Commands

Most DuckDB CLI dot commands affect the behavior of the CLI, like the format of its output. Since these are irrelevant to Harlequin, they are ignored.

Currently Harlequin rewrites the following dot commands to SQL and executes the SQL:

- `.open` is rewritten to `attach` and `use` statements.

To request additional dot command support in Harlequin, [open an issue](https://github.com/tconbeer/harlequin/issues/new/choose).
