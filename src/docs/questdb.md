---
title: "Adapter: QuestDB"
menuOrder: 115
---

The QuestDB adapter was contributed by community member [John DaCosta](https://github.com/johndacosta).

QuestDB connects over **PGWire** (PostgreSQL wire protocol) on port **8812** by default. The adapter uses QuestDB meta functions (`tables()`, `table_columns()`, `functions()`) for catalog and completions—not PostgreSQL system catalogs.

## Installation

Install the `harlequin-questdb` package into the same environment as `harlequin`:

```bash
pip install harlequin harlequin-questdb
```

Or with uv:

```bash
uv tool install harlequin
uv tool install harlequin-questdb
```

## Using Harlequin with QuestDB

For local development, QuestDB **8.2.2** is recommended. Start a server (see the [harlequin-questdb](https://github.com/johndacosta/harlequin-questdb) repo for a `docker-compose.yml`), then connect:

```bash
harlequin -a questdb \
  --host 127.0.0.1 \
  --port 8812 \
  --user admin \
  --password quest \
  --dbname qdb \
  --sslmode disable
```

You can also pass a libpq connection string:

```bash
harlequin -a questdb \
  "host=127.0.0.1 port=8812 user=admin password=quest dbname=qdb sslmode=disable"
```

Harlequin does **not** auto-supply a password; pass `--password` or embed credentials in the connection string.

## Connection options

The supported connection options are:

```
host
port
user
password
dbname
connect-timeout
sslmode
```

For descriptions of each option, run:

```bash
harlequin --help
```

## Catalog hints

The sidebar shows QuestDB-specific metadata:

| Label | Meaning |
|-------|---------|
| `t·DAY` | Table partitioned by `DAY` |
| `ts★` | Designated timestamp column |

## Time-series SQL

QuestDB's dialect differs from PostgreSQL. The adapter adds completions for time-series keywords such as `SAMPLE BY`, `ASOF JOIN`, and `LATEST ON`. Example:

```sql
SELECT ts, sensor, count() AS n
FROM my_table
SAMPLE BY 1h;
```

## More documentation

- [User guide](https://github.com/johndacosta/harlequin-questdb/blob/main/docs/USER_GUIDE.md)
- [Known limitations](https://github.com/johndacosta/harlequin-questdb/blob/main/docs/KNOWN_LIMITATIONS.md)
