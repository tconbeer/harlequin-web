---
title: "Installation and Basic Usage"
topic: "Adapter: Databricks"
menuOrder: 120
---

<script lang="ts">
  import Warning from "$lib/components/warning.svelte"
</script>

The Databricks adapter was contributed by community member Alex Malins.

## Installation

You must install the `harlequin-databricks` package into the same environment as `harlequin`. The best and easiest way to do this is to use `uv` to install Harlequin with the `databricks` extra:

```bash
uv tool install --python 3.13 'harlequin[databricks]'
```

<Warning>
Due to packaging conflicts, currently the databricks extra will not install the Databricks adapter on Python 3.14. You must use Python 3.10 - 3.13. The command above instructs uv to use Python 3.13.
</Warning>


## Using Harlequin with Databricks

To connect to Databricks you are going to need to provide as CLI arguments:

- server-hostname
- http-path
- credentials for one of the following authentication methods:
  - a personal access token (PAT)
  - a username and password
  - an OAuth U2M type
  - a service principle client ID and secret for OAuth M2M

### Personal Access Token (PAT) authentication:

```bash
harlequin -a databricks --server-hostname ***.cloud.databricks.com --http-path /sql/1.0/endpoints/*** --access-token dabpi***
```

### Username and password (basic) authentication:

```bash
harlequin -a databricks --server-hostname ***.cloud.databricks.com --http-path /sql/1.0/endpoints/*** --username *** --password ***
```

### OAuth U2M authentication:

For [OAuth user-to-machine (U2M) authentication](https://docs.databricks.com/en/dev-tools/python-sql-connector.html#auth-u2m)
supply either `databricks-oauth` or `azure-oauth` to the `--auth-type` CLI argument:

```bash
harlequin -a databricks --server-hostname ***.cloud.databricks.com --http-path /sql/1.0/endpoints/*** --auth-type databricks-oauth
```

### OAuth M2M authentication:

For [OAuth machine-to-machine (M2M) authentication](https://docs.databricks.com/en/dev-tools/python-sql-connector.html#oauth-machine-to-machine-m2m-authentication)
you need to `pip install databricks-sdk` as an additional dependency
([databricks-sdk](https://github.com/databricks/databricks-sdk-py) is an optional dependency of
`harlequin-databricks`) and supply `--client-id` and `--client-secret` CLI arguments:

```bash
harlequin -a databricks --server-hostname ***.cloud.databricks.com --http-path /sql/1.0/endpoints/*** --client-id *** --client-secret ***
```

## Store an alias for your connection string

We recommend you include an alias for your connection string in your `.bash_profile`/`.zprofile` so
you can launch harlequin-databricks with a short command like `hdb` each time.

Run this command (once) to create the alias:

```bash
echo 'alias hdb="harlequin -a databricks --server-hostname ***.cloud.databricks.com --http-path /sql/1.0/endpoints/1234567890abcdef --access-token dabpi***"' >> .bash_profile
```

## Using Unity Catalog and want fast Data Catalog indexing?

Supply the `--skip-legacy-indexing` command line flag if you do not care about legacy metastores
(e.g. `hive_metastore`) being indexed in Harlequin's Data Catalog pane.

This flag will skip indexing of old non-Unity Catalog metastores (i.e. they won't appear in the
Data Catalog pane with this flag).

Because of the way legacy Databricks metastores works, a separate SQL query is required to fetch
the metadata of each table in a legacy metastore. This means indexing them for Harlequin's Data Catalog pane is slow.

Databricks's Unity Catalog upgrade brought
[Information Schema](https://docs.databricks.com/en/sql/language-manual/sql-ref-information-schema.html),
which allows harlequin-databricks to fetch metadata for all Unity Catalog assets with only two SQL queries.

So if your Databricks instance is running Unity Catalog, and you no longer care about the legacy
metastores, setting the `--skip-legacy-indexing` CLI flag is recommended as it will mean
much faster indexing & refreshing of the assets in the Data Catalog pane.

## Other CLI options:

For more details on other command line options, run:

```bash
harlequin --help
```

## Issues, Contributions and Feature Requests

Please report bugs/issues with the harlequin-databricks adapter via its GitHub
[issues](https://github.com/alexmalins/harlequin-databricks/issues) page. You are welcome to
attempt fixes yourself by forking that repo then opening a [PR](https://github.com/alexmalins/harlequin-databricks/pulls).

For feature suggestions, please post in the harlequin-databricks repo
[discussions](https://github.com/alexmalins/harlequin-databricks/discussions).
