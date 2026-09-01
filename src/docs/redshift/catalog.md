---
title: "Redshift Data Catalog"
description: "Browse, search, and act on Redshift databases, schemas, relations, and columns in the Data Catalog."
---

<script>
    import Tip from "$lib/components/tip.svelte"
</script>

The catalog is four levels deep: database, schema, relation, column. Each level is loaded only when you open the one above it, so a cluster with thousands of relations costs nothing until you go looking for one.

Every level is read through the driver's own metadata calls, so a cluster answers with whichever path it supports: server-side `SHOW` discovery on current clusters, the cross-database `SVV_ALL_*` views, or the driver's legacy `pg_catalog` queries on older ones. That means datashare databases and external (Spectrum) schemas appear in the tree wherever the cluster exposes them.

System schemas (`pg_*` and `information_schema`) are not shown.

## Showing Every Database

By default, the catalog shows the connected database. Pass `--all-databases` to show every database the cluster exposes metadata for, including the ones a datashare brings in.

That flag is off by default because it is not free. It asks the server for cross-database catalog metadata, which is answered by the `SVV_ALL_*` views and is markedly slower, and on some clusters the driver's server-side metadata path cannot serve it at all. With it off, the catalog is read through the fast path, and every level is a single round trip.

Relations in another database are given three-part query names, which is how Redshift's cross-database queries address them; relations in the connected database get two-part names.

## Interactions

Right-click (or press the context-menu key on) an item in the Data Catalog:

| Item              | Actions                                                                                                                                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Database          | List Schemas, List Relations, Show Storage Summary, Drop Database                                                                                                                                       |
| Schema            | Set Search Path, List Relations, Show Storage Summary, Drop Schema                                                                                                                                      |
| Table             | Insert Columns at Cursor, Preview Data, Describe Columns, Show DDL (`SHOW TABLE`), Describe Design (dist key, sort key, encoding), Show Table Info (`SVV_TABLE_INFO`), Describe Constraints, Drop Table |
| View              | ... plus Show DDL (`SHOW VIEW`), Drop View                                                                                                                                                              |
| Materialized view | ... plus Show DDL, Show Refresh Info (`SVV_MV_INFO`), Drop Materialized View                                                                                                                            |
| External table    | ... plus Show DDL (`SHOW EXTERNAL TABLE`), Show Location & Format, Drop External Table                                                                                                                  |

Most of these write SQL into a new buffer rather than running it, so you see what will hit the cluster before it does. The `Show DDL` actions run their `SHOW` statement, because the DDL is what they return. The drops go through Harlequin's confirmation modal.

## Catalog Search

This adapter implements `search_catalog()`, so you can find an object without walking the catalog a level at a time:

```bash
hsql -a redshift "redshift://my-cluster:5439/dev" --catalog-search orders
```

A term matches a database, schema, relation, or column whose name contains it. Each level is matched with the same metadata call that builds it in the tree, so a result is the item you would have reached by opening nodes, and it can be used the same way. See [Exploring the Catalog](/docs/hsql/catalog) for more on searching from the command line.

Schemas, relations, and columns come from the connected database. The other databases on the cluster are matched by name, which is all the catalog's top level shows for them: searching every database's columns would mean a cross-database scan of `SVV_ALL_COLUMNS`, which does not finish quickly enough to sit behind a search box.

<Tip>

Redshift folds unquoted identifiers to lower case unless the cluster sets `enable_case_sensitive_identifier`, and the server matches these names with `LIKE`, which is case-sensitive. A search therefore tries both the term as typed and its lower-cased form. On a cluster that does use case-sensitive identifiers, a term must match the stored case.

</Tip>

## Autocomplete

Beyond the catalog objects Harlequin completes on its own, this adapter provides Redshift's reserved and non-reserved keywords, and the functions and stored procedures the connected cluster reports.
