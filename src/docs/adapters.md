---
title: Selecting an Adapter
menuOrder: 1
---

Harlequin uses adapter plug-ins as a generic interface to any database. Harlequin ships with adapters for DuckDB (the default) and SQLite; additional adapters can be installed by installing additional `pip` packages in the same virtual environment as Harlequin, or by installing Harlequin while specifying extras.

To select an adapter other than DuckDB, you use the `--adapter` option (alias `-a`) at the command-line:

```bash
harlequin -a sqlite
```

Each adapter has its own configuration options, detailed in their own section in these docs. Harlequin `--help` option will dynamically include the options for all installed adapters so you can easily reference them.

## Core Adapters

Core adapters are created and maintained by the maintainers of Harlequin.

- [DuckDB](duckdb/index)
- [SQLite](sqlite)
- [Postgres](postgres/index)
- [MySQL](mysql/index)

## Community Adapters

Community adapters are created and maintained by other members of the Harlequin community. To add your adapter to this list, please [open a PR](https://github.com/tconbeer/harlequin-web).

- [BigQuery](bigquery/index), contributed by [Josh Temple](https://github.com/joshtemple)
- ClickHouse (Coming Soon!)
