---
title: "Adapter: BigQuery"
menuOrder: 100
---

The BigQuery adapter was contributed by community member Josh Temple. You can view the source for the adapter on [GitHub](https://github.com/joshtemple/harlequin-bigquery).

## Installation

`harlequin-bigquery` depends on `harlequin`, so installing `harlequin-bigquery` will also install Harlequin.

### Using pip

To install this adapter into an activated virtual environment:

```bash
pip install harlequin-bigquery
```

### Using poetry

```bash
poetry add harlequin-bigquery
```

### Using pipx

If you do not already have Harlequin installed:

```bash
pip install harlequin-bigquery
```

If you would like to add the BigQuery adapter to an existing Harlequin installation:

```bash
pipx inject harlequin harlequin-bigquery
```

### As an Extra

Alternatively, you can install Harlequin with the `bigquery` extra:

```bash
pip install harlequin[bigquery]
```

```bash
poetry add harlequin[bigquery]
```

```bash
pipx install harlequin[bigquery]
```

## Usage and Configuration

You can open Harlequin with the BigQuery adapter by selecting it with the `-a` option and passing the `--project` and `--location` options:

```bash
harlequin -a bigquery --project my-gcp-project --location us-west1
```

**See the [next page](/docs/bigquery/auth) for information on authentication and authorization for BigQuery.**

## Configuration

This adapter supports the following options:

- `project`: The ID of the Google Cloud project to run Harlequin against. Defaults to whatever it can infer from the user's environment, i.e. `gcloud config list project`.

- `location`: The [location](https://cloud.google.com/compute/docs/regions-zones#available) used to run the catalog queries, which [must be region-qualified](https://cloud.google.com/bigquery/docs/information-schema-intro#syntax). Defaults to `US`.
