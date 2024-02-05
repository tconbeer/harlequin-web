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
pipx install harlequin-databricks
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

## Issues and Contributing

Head over to the [alexmalins/harlequin-databricks](https://github.com/alexmalins/harlequin-databricks/) repo on GitHub.
