---
title: Database Adapters
menuOrder: 1
---

Harlequin uses adapter plug-ins as a generic interface to any database. Harlequin ships with adapters for DuckDB (the default) and SQLite; additional adapters are distributed as their own Python packages that need to be [installed](getting-started/index#installing-database-adapters) into the same environment as Harlequin.

Once it is installed, to select an adapter other than DuckDB, you use the `--adapter` option (alias `-a`) at the command-line:

```bash
harlequin -a sqlite
```

Each adapter has its own configuration options, detailed in their own section in these docs. Running Harlequin with the `--help` option will dynamically include the options for all installed adapters so you can easily reference them.

## Core Adapters

Core adapters are created and maintained by the maintainer of Harlequin, Ted Conbeer.

- [DuckDB](duckdb/index)
- [SQLite](sqlite/index)
- [Postgres](postgres/index) (also supports Redshift)
- [MySQL](mysql/index)
- [ODBC](odbc/index) (supports MS SQL Server, Oracle, and others)

## Community Adapters

Community adapters are created and maintained by other members of the Harlequin community. To add your adapter to this list, please [open a PR](https://github.com/tconbeer/harlequin-web).

- [BigQuery](bigquery/index), contributed by [Josh Temple](https://github.com/joshtemple)
- [Trino](trino/index), contributed by [Tyler Hillery](https://github.com/TylerHillery)
- [Databricks](databricks/index), contributed by [Zach Shirah](https://github.com/zashirah) and [Alex Malins](https://github.com/alexmalins)
- [ADBC](adbc/index), contributed by [Tyler Hillery](https://github.com/TylerHillery). Supports Snowflake and more.
- [RisingWave](risingwave/index), contributed by [ZhengYu Xu](https://github.com/zen-xu)
- [Wherobots](wherobots/index), contributed by [Wherobots](https://github.com/wherobots)
- [Cassandra](cassandra/index), contributed by [Vadim Khitrin](https://github.com/vkhitrin)
- [NebulaGraph](nebulagraph/index), contributed by [Wey Gu](https://github.com/wey-gu)
