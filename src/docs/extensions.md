---
title: Loading Extensions
menuOrder: 20
---

You can install and load [DuckDB extensions](https://duckdb.org/docs/extensions/overview.html) when starting Harlequin, by passing the `-e` or `--extension` flag one or more times:

```bash
harlequin -e spatial -e httpfs
```

If you need to load a custom or otherwise unsigned extension, you can use the
`-unsigned` flag just as you would with the DuckDB CLI, or `-u` for convenience:

```bash
harlequin -u
```

You can also install extensions from custom repos, using the `--custom-extension-repo` option. For example, this combines the options above to load the unsigned `prql` extension:

```bash
harlequin -u -e prql --custom-extension-repo welsch.lu/duckdb/prql/latest
```

Alternatively, you can use DuckDB's SQL API for loading and installing extensions, either in Harlequin's Query Editor or in an [initialization script](initialization).
