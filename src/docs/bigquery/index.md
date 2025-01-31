---
title: "BQ Installation and Configuration"
topic: "Adapter: BigQuery"
menuOrder: 100
---

The BigQuery adapter was contributed by community member Josh Temple.


## Installation

You must install the `harlequin-bigquery` package into the same environment as `harlequin`. The best and easiest way to do this is to use `uv` to install Harlequin with the `bigquery` extra:

```bash
uv tool install 'harlequin[bigquery]'
```

## Using Harlequin with BigQuery

Run Harlequin with the `-a bigquery` option; you must also specify values for the `--project` and `--location` options:

```bash
harlequin -a bigquery --project my-gcp-project --location us-west1
```

**See the [next page](/docs/bigquery/auth) for information on authentication and authorization for BigQuery.**

## Connection Options

This adapter supports the following options:

- `project`: The ID of the Google Cloud project to run Harlequin against. Defaults to whatever it can infer from the user's environment, i.e. `gcloud config list project`.

- `location`: The [location](https://cloud.google.com/compute/docs/regions-zones#available) used to run the catalog queries, which [must be region-qualified](https://cloud.google.com/bigquery/docs/information-schema-intro#syntax). Defaults to `US`.
