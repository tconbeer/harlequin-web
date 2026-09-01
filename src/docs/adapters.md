---
title: Database Adapters
---

Harlequin uses adapter plug-ins as a generic interface to any database. Harlequin ships with adapters for DuckDB (the default) and SQLite; additional adapters are distributed as their own Python packages that need to be [installed](/docs/getting-started#installing-database-adapters) into the same environment as Harlequin.

Once it is installed, to select an adapter other than DuckDB, you use the `--adapter` option (alias `-a`) at the command-line:

```bash
harlequin -a sqlite
```

Each adapter has its own configuration options, detailed in their own section in these docs. Running Harlequin with the `--help` option will dynamically include the options for all installed adapters so you can easily reference them.

## Core Adapters

Core adapters are created and maintained by the maintainer of Harlequin, Ted Conbeer.

- [DuckDB](/docs/duckdb)
- [SQLite](/docs/sqlite)
- [Postgres](/docs/postgres)
- [Redshift](/docs/redshift) (Amazon Redshift and Redshift Serverless)
- [Snowflake](/docs/snowflake)
- [MySQL/MariaDB](/docs/mysql)
- [ODBC](/docs/odbc) (supports MS SQL Server, Oracle, and others)

## Community Adapters

Community adapters are created and maintained by other members of the Harlequin community. To add your adapter to this list, please [open a PR](https://github.com/tconbeer/harlequin-web).

- [BigQuery](/docs/bigquery), contributed by [Josh Temple](https://github.com/joshtemple)
- [Trino](/docs/trino), contributed by [Tyler Hillery](https://github.com/TylerHillery)
- [Databricks](/docs/databricks), contributed by [Zach Shirah](https://github.com/zashirah) and [Alex Malins](https://github.com/alexmalins)
- [ADBC](/docs/adbc), contributed by [Tyler Hillery](https://github.com/TylerHillery). Supports any database with an Arrow Database Connectivity driver.
- [RisingWave](/docs/risingwave), contributed by [ZhengYu Xu](https://github.com/zen-xu)
- [Wherobots](/docs/wherobots), contributed by [Wherobots](https://github.com/wherobots)
- [Cassandra](/docs/cassandra), contributed by [Vadim Khitrin](https://github.com/vkhitrin)
- [NebulaGraph](/docs/nebulagraph), contributed by [Wey Gu](https://github.com/wey-gu)
- [Exasol](/docs/exasol), contributed by [Nicola Coretti](https://github.com/Nicoretti)
- [H2](/docs/h2), contributed by [clang-engineer](https://github.com/clang-engineer)
