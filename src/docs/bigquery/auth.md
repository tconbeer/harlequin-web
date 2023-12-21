---
title: "Auth and Permissions"
menuOrder: 101
---

## Authentication

This adapter will use [Application Default Credentials](https://cloud.google.com/docs/authentication/application-default-credentials) to authenticate with BigQuery and run queries, including both the queries necessary to populate the data catalog and the queries you type into Harlequin. You can use the `gcloud` CLI to pass user credentials to ADC by running:

```bash
gcloud auth application-default login
```

To install the `gcloud` CLI, see [here](https://cloud.google.com/sdk/docs/install).

## Authorization

The user will need the permission to query both [`INFORMATION_SCHEMA.TABLES`](https://cloud.google.com/bigquery/docs/information-schema-tables) and [`INFORMATION_SCHEMA.COLUMNS`](https://cloud.google.com/bigquery/docs/information-schema-columns) to load the data catalog.

To query these views, you need the following Identity and Access Management (IAM) permissions:

- `bigquery.tables.get`
- `bigquery.tables.list`
- `bigquery.routines.get`
- `bigquery.routines.list`

Each of the following predefined IAM roles includes the necessary permissions:

- `roles/bigquery.admin`
- `roles/bigquery.dataViewer`
- `roles/bigquery.metadataViewer`

For more information about BigQuery permissions, see [Access control with IAM](https://cloud.google.com/bigquery/docs/access-control).
