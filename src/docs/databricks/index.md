---
title: "Adapter: Databricks"
menuOrder: 120
---

## Installation

`harlequin-databricks` depends on `harlequin`, so installing this package will also install Harlequin.

### Using pip

To install this adapter into an activated virtual environment:

```bash
pip install harlequin-databricks
```

### Using poetry

```bash
poetry add harlequin-databricks
```

### Using pipx

If you do not already have Harlequin installed:

```bash
pipx install harlequin[databricks]
```

If you would like to add the Databricks adapter to an existing Harlequin installation:

```bash
pipx inject harlequin harlequin-databricks
```

### As an Extra

Alternatively, you can install Harlequin with the `databricks` extra:

```bash
pip install harlequin[databricks]
```

```bash
poetry add harlequin[databricks]
```

```bash
pipx install harlequin[databricks]
```

## Usage and Configuration

For a minimum connection you are going to need:

- server-hostname
- http-path
- access-token

```bash
harlequin -a databricks --server-hostname my_databricks.cloud.databricks.com --http-path /sql/1.0/endpoints/1234567890abcdef --access-token dabpi***
```

Authentication is also possible using a username and password (known as basic authentication):

```bash
harlequin -a databricks --server-hostname my_databricks.cloud.databricks.com --http-path /sql/1.0/endpoints/1234567890abcdef --username my_user --password my_pass
```

Or by using [OAuth user-to-machine (U2M) authentication](https://docs.databricks.com/en/dev-tools/python-sql-connector.html#auth-u2m):

```bash
harlequin -a databricks --server-hostname my_databricks.cloud.databricks.com --http-path /sql/1.0/endpoints/1234567890abcdef --auth-type databricks-oauth
```

For more details on command line options, run:

```bash
harlequin --help
```

## Using Unity Catalog and experiencing slow legacy `hive_metastore` indexing?

Indexing legacy metastores is slow on Databricks because it requires a SQL call for every table in
the legacy metastore to extract column metadata. This means refreshing Harlequin's Data Catalog
pane takes a long time for Databricks instances with lots of tables in legacy metastores like
`hive_metastore`.

If your Databricks instance runs Unity Catalog, and you only want the Unity Catalog assets
listed in the Data Catalog pane, supply the `--skip-legacy-indexing` CLI flag when loading
Harlequin.

This flag means only Unity Catalogs will be indexed - legacy metastores will not appear.

Indexing Unity Catalogs is a super-fast operation requiring Harlequin to send only two SQL queries
to Databricks because of
[Information Schema](https://docs.databricks.com/en/sql/language-manual/sql-ref-information-schema.html).

## Issues and Contributing

Head over to the [alexmalins/harlequin-databricks](https://github.com/alexmalins/harlequin-databricks/) repo on GitHub.
