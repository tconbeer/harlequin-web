---
title: Loading Extensions
menuOrder: 32
---

## Warning: May not work on your platform!

Harlequin uses Python's distribution of SQLite, via its built-in `sqlite3` library. On some (most?) platforms, including MacOS and Ubuntu, this library [disables support for extensions](https://docs.python.org/3/library/sqlite3.html#sqlite3.Connection.enable_load_extension). Windows is the notable exception where this should "just work."

To allow Harlequin to load SQLite extensions, you may have to rebuild your Python from source, passing specific [config](https://docs.python.org/3/using/configure.html#cmdoption-enable-loadable-sqlite-extensions) during the Python build process.

## Loading Extensions Using CLI Option

You can install and load [SQLite extensions](https://www.sqlite.org/loadext.html) when starting Harlequin, by invoking the `-e` or `--extension` option one or more times:

```bash
harlequin -e ./fts5 -e ./json1
```

The argument to the option should be a path to a SQLite extension executable. Loading specific entrypoints is not supported via the CLI option.

## Loading Extensions via Init Script or SQL API

You can use a `.load` command in an [initialization script](initialization) to load an extension (optionally specifying an entrypoint).

Or you can execute a `select load_extension(...)` statement in Harlequin's Query Editor.
