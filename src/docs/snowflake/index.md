---
title: "Snowflake Basic Usage"
description: "Install the Snowflake adapter and connect Harlequin to a Snowflake account."
---

<script>
    import Key from "$lib/components/key.svelte"
</script>

The Snowflake adapter is built on the official [snowflake-connector-python](https://docs.snowflake.com/en/developer-guide/python-connector/python-connector) driver, so everything the connector can do, the adapter can do: every authenticator, `connections.toml`, session parameters, proxies, and Arrow result sets.

## Installation

You must install the `harlequin-snowflake` package into the same environment as `harlequin`. The best and easiest way to do this is to use `uv`:

```bash
uv tool install harlequin --with harlequin-snowflake
```

To add the adapter to an existing Harlequin installation:

```bash
uv tool install --upgrade harlequin --with harlequin-snowflake
```

Harlequin finds the adapter through its `harlequin.adapter` entry point; there is nothing else to configure.

## Using Harlequin with Snowflake

To connect to Snowflake, run Harlequin with the `-a snowflake` option:

```bash
harlequin -a snowflake <connection>
```

There are three ways to say which account to connect to, and they can be mixed; an option always overrides what the connection string said.

### A connections.toml Entry, by Name

This is the recommended way, and it uses the same file that the Snowflake CLI and every other Snowflake tool reads. Put this in `~/.snowflake/connections.toml`:

```
[my_account]
account = "myorg-myaccount"
user = "me@example.com"
authenticator = "externalbrowser"
warehouse = "COMPUTE_WH"
role = "ANALYST"
database = "ANALYTICS"
schema = "PUBLIC"
```

then:

```bash
harlequin -a snowflake my_account
```

A connection string with no `://` in it names an entry this way. The `--connection-name` option does the same thing, and `--connections-file-path` points at a file somewhere other than `~/.snowflake/connections.toml`.

### The Default Connection

With no connection string and no account options, the adapter uses the connector's own default connection — the entry named by `default_connection_name` in `config.toml`, or by the `SNOWFLAKE_DEFAULT_CONNECTION_NAME` environment variable:

```bash
harlequin -a snowflake
```

### A Connection String

Connection strings are spelled the way `snowflake-sqlalchemy` spells them:

```bash
harlequin -a snowflake "snowflake://me:my-password@myorg-myaccount/ANALYTICS/PUBLIC?warehouse=COMPUTE_WH&role=ANALYST"
```

The path is `/database/schema`, and any connector parameter can go in the query string.

## Connection Options

Every connection parameter is also a CLI option, which Harlequin will also read from `HARLEQUIN_*` environment variables:

```bash
harlequin -a snowflake --account myorg-myaccount --user me --warehouse COMPUTE_WH
```

For descriptions of each option, run:

```
harlequin --help
```

## Using a Profile

Anything you would pass at the command line can live in a [profile](/docs/config-file/profiles) instead, in `~/.config/harlequin/config.toml` or in a `.harlequin.toml` beside the project you are working in. With a `default_profile`, `harlequin` on its own is the whole command:

```
default_profile = "dev"

[profiles.dev]
adapter = "snowflake"
theme = "harlequin"
keymap_name = ["vscode"]
viewer_max_rows = 100_000

account = "myorg-myaccount"
user = "me@example.com"
role = "ANALYST"
warehouse = "COMPUTE_WH"
database = "ANALYTICS"
schema = "PUBLIC"

# key-pair auth; private_key_file selects it on its own
private_key_file = "~/.snowflake/rsa_key.p8"
private_key_file_pwd = "..."

[profiles.sso]
adapter = "snowflake"
account = "myorg-myaccount"
user = "me@example.com"
authenticator = "externalbrowser"
client_store_temporary_credential = true
warehouse = "COMPUTE_WH"
```

```bash
harlequin              # the default profile
harlequin -P sso       # a named one
```

## Interactions

Right-click (or press <Key>.</Key>) on an item in the Data Catalog to run an interaction against it:

- **Database** — Use Database, List Objects, Show DDL, Show Grants, Drop Database
- **Schema** — Use Schema, List Objects, Show DDL, Show Grants, Drop Schema
- **Relation** — Insert Columns at Cursor, Preview Data, Describe Relation, Show Grants, plus per-kind items: Sample Data, Count Rows, Show DDL, Show View Definition, Show Refresh History (dynamic tables), and the matching Drop
- **Column** — Show Value Counts
