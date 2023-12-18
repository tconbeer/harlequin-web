---
title: "Required Permissions"
menuOrder: 101
---

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
