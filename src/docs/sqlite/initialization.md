---
title: Initialization Scripts
menuOrder: 31
---

Each time you start Harlequin, it will execute commands from a SQLite [initialization script](https://sqlite.org/cli.html). Such a script can contain both SQL and SQLite CLI [dot commands](https://sqlite.org/cli.html#special_commands_to_sqlite3_dot_commands_). For example:

```sql
.open './my-database.sqlite'
create table foo as
    select 1;
```

Multi-line SQL is allowed, but must be terminated by a semicolon. Dot commands must be newline-terminated.

## Configuring the Script Location

By default, Harlequin will execute the script found at `~/.sqliterc`. However, you can provide a different path using the `--init-path` option (aliased to `-i` or `-init`):

```bash
harlequin -a sqlite --init-path path/to/my/script.sql
```

## Disabling Initialization

If you would like to open Harlequin without running the script you have at `~/.sqliterc`, you can either pass a nonexistent path (or `/dev/null`) to the option above, or start Harlequin with the `--no-init` option:

```bash
harlequin -a sqlite --no-init
```

## Supported Dot Commands

Most SQLite CLI dot commands affect the behavior of the CLI, like the format of its output. Since these are irrelevant to Harlequin, they are ignored.

Currently Harlequin rewrites the following dot commands to SQL and executes the SQL:

- `.open` is rewritten to an `attach ...` statement.
- `.load` is rewritten to a `select load_extension(...)` statement. Note: Loading extensions may not be possible with your Python's SQLite distribution. See [extensions](extensions) for more info.

To request additional dot command support in Harlequin, [open an issue](https://github.com/tconbeer/harlequin/issues/new/choose).
