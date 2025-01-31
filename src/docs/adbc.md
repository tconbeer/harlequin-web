---
title: "Adapter: ADBC"
menuOrder: 130
---

<script lang="ts">
  import Tip from "$lib/components/tip.svelte"
  import Link from "$lib/components/link.svelte"
</script>

The Trino adapter was contributed by community member Tyler Hillery.

_This documentation is Copyright 2024 Tyler Hillery, reproduced here under an [MIT License](https://github.com/TylerHillery/harlequin-adbc/blob/main/LICENSE). See the [repository](https://github.com/TylerHillery/harlequin-adbc) for the most up-to-date documentation._

## Warning

ADBC is a very new database connectivity method compared to ODBC, JDBC that aims at providing a more efficient way to transfer columnar data over the wire.

Due to the recency of its development, there is various level of functionality across drivers which may cause issues.

## Installation

`harlequin-adbc` depends on `adbc_driver_manager`, `harlequin` and `pyarrow`, so installing this package with also install these dependencies.

You should also install the adbc driver(s) for the database(s) you plan on connecting to, otherwise you will have to download the driver yourself from another place and provide the `--driver-path` cli option.

The following drivers are available as Python packages:

- adbc-driver-flightsql
- adbc-driver-postgresql
- adbc-driver-snowflake
- adbc-driver-sqlite

<Tip>
If you don't install the driver but provide a <code>--drive-type</code> cli argument you will get an <code>ImportError</code> when you run Harlequin.
</Tip>

Example usage:

```bash
uv tool install 'harlequin[adbc]' --with adbc-driver-snowflake
```

## Usage and Configuration

Run Harlequin with the `-a adbc` option and pass in a connection string as an argument. The format of the connection string will depend on the driver you are using. You will also need to provide either the `--driver-type` option or the `--driver-path`.

### Driver Type (preferred)

When you use the --driver-type option it will try to dynamically use the driver package of the type selected `adbc-driver-{driver type}`. That is why it's crucial to also have that package also install in the virtual environment where Harlequin is installed.

- `--driver-type` with one of the following options
- `flightsql`, `postgresql`, `snowflake`, `sqlite`, `duckdb`

### Driver Path

The other option is to pass the file path location of the adbc driver that you are using. Note this method is not well tested.

- `--driver-path`

### DB Kwargs String (Optional)

Since the drivers implement so many different options to pass through when you connect to the database this is a way to pass through these options. The format of the string is key=value separated by ;

- `--db-kwargs-str`

Example:

```bash
`--db-kwargs-str "username=flight_username;password=flight_password;adbc.flight.sql.client_option.tls_skip_verify=true"`
```

This will parse the string and pass through these values into the `db_kwargs` value in the `dbapi.connect()` method. Note the parser relies on the ; and = so if any of of the parameters in the string contain either of these characters it's not going to work. This is a known limitation and something being worked on.

### Snowflake Driver

The Snowflake URI should be of one of the following formats:

- `user[:password]@account/database/schema[?param1=value1&paramN=valueN]`
- `user[:password]@account/database[?param1=value1&paramN=valueN]`
- `user[:password]@host:port/database/schema?account=user_account[&param1=value1&paramN=valueN]`
- `host:port/database/schema?account=user_account[&param1=value1&paramN=valueN]`

Check the [Snowflake ADBC Driver Docs](https://arrow.apache.org/adbc/main/driver/snowflake.html) for more details.

Example usage:

```bash
harlequin -a adbc "$SNOWFLAKE_URI" --driver-type snowflake
```

### FlightSQL Driver

Example usage:

```bash
harlequin -a adbc "grpc+tls://localhost:31337" --driver-type flightsql --db-kwargs-str "username=flight_username;password=flight_password;adbc.flight.sql.client_option.tls_skip_verify=true"
```

Check the [FlightSQL ADBC Driver Docs](https://arrow.apache.org/adbc/main/driver/flight_sql.html) for more details.

### Postgres Driver

<Tip>
Harlequin also has a Postgres adapter, which connects using Psycopg, instead of ADBC. For more information, see <Link href="postgres">this page</Link>.
</Tip>

The Postgres URI should be in the format of a [Postgres DSN](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING):

```bash
harlequin -a adbc --driver-type postgresql "postgres://my-user:my-pass@localhost:5432/my-database"
```

### DuckDB and SQLite

While DuckDB and SQLite both have ADBC drivers it's not recommend to use them. Harlequin natively supports both of the databases without having to install any other dependencies.

## Known Issues

- Snowflake adbc driver seems to be the only driver that returns the `xdbc_data_type` from `adbc_get_objects()`
- Snowflake adbc driver has a bug with `adbc_get_table_schema()` that returns `adbc_driver_manager.OperationalError: IO: sql: expected 12 destination arguments in Scan, not 11`
- The PostgreSQL adbc driver is overall buggy and when executing queries you might get the error `IO: [libpq] Fetch header failed: no COPY in progress`
- SQLite and DuckDB don't have the same level of `depth` for `adbc_get_objects()` compared to other dbs which causes weird issues.
- DuckDB driver uses different names for the `adbc_get_objects()` which causes things to break.
