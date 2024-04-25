---
title: Loading Extensions
menuOrder: 32
---

You can install and load [SQLite extensions](https://www.sqlite.org/loadext.html) when starting Harlequin, by invoking the `-e` or `--extension` option one or more times:

```bash
harlequin -e ./fts5 -e ./json1
```

The argument to the option should be a path to a SQLite extension executable.

Alternatively, you can use SQLite's SQL API or dot commands for loading and installing extensions in an [initialization script](initialization), or execute `select load_extension(...)` in Harlequin's Query Editor.
