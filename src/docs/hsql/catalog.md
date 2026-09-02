---
title: Exploring the Catalog
description: How --catalog, --path and --catalog-search list a database's databases, schemas, relations and columns without running any SQL.
---

<script>
    import Note from "$lib/components/note.svelte"
</script>

`--catalog` lists the objects one level below `--path`, and exits without
running SQL. `--catalog-search` finds objects by name at every level at once.
Neither runs a query, and both produce ordinary result sets.

```bash
hsql "path/to/duck.db" --catalog
```

```output
 path | name | query_name | type     | type_label
------+------+------------+----------+------------
 duck | duck | "duck"     | database | db
(1 row)
```

Every row has five columns:

| Column       | What it is                                                              |
| ------------ | ----------------------------------------------------------------------- |
| `path`       | What to pass to `--path` to list this object's children.                |
| `name`       | The object's name, unquoted.                                            |
| `query_name` | The name already quoted for this database. Paste this into SQL.         |
| `type`       | The database's own word for it: `database`, `schema`, `VIEW`, `BIGINT`. |
| `type_label` | The short label Harlequin shows in its data catalog.                    |

## Navigating the Catalog

Pass a row's `path` back to `--path`:

```bash
hsql "path/to/duck.db" --catalog --path duck
```

```output
 path           | name      | query_name         | type   | type_label
----------------+-----------+--------------------+--------+------------
 duck.analytics | analytics | "duck"."analytics" | schema | sch
 duck.main      | main      | "duck"."main"      | schema | sch
(2 rows)
```

```bash
hsql "path/to/duck.db" --catalog --path duck.analytics
```

```output
 path                        | name         | query_name                 | type       | type_label
-----------------------------+--------------+----------------------------+------------+------------
 duck.analytics.customers    | customers    | "analytics"."customers"    | BASE TABLE | t
 duck.analytics.order_totals | order_totals | "analytics"."order_totals" | VIEW       | v
 duck.analytics.orders       | orders       | "analytics"."orders"       | BASE TABLE | t
(3 rows)
```

One level further down is the columns, with their types:

```bash
hsql "path/to/duck.db" --catalog --path duck.analytics.orders
```

```output
 path                              | name        | query_name    | type          | type_label
-----------------------------------+-------------+---------------+---------------+------------
 duck.analytics.orders.customer_id | customer_id | "customer_id" | BIGINT        | ##
 duck.analytics.orders.id          | id          | "id"          | BIGINT        | ##
 duck.analytics.orders.placed_at   | placed_at   | "placed_at"   | TIMESTAMP     | ts
 duck.analytics.orders.total       | total       | "total"       | DECIMAL(18,2) | #.#
(4 rows)
```

The adapter names the segments, so how deep the catalog goes and what each
level is called varies by database.

A trailing `*` filters a listing. Quote it, or the shell expands it against the
working directory:

```bash
hsql "path/to/duck.db" --catalog --path 'duck.analytics.ord*'
```

## Searching

`--catalog-search TERM` searches every level at once, for objects whose name
contains TERM:

```bash
hsql "path/to/duck.db" --catalog-search customer_id
```

```output
 path                                    | name        | query_name    | type   | type_label
-----------------------------------------+-------------+---------------+--------+------------
 duck.analytics.order_totals.customer_id | customer_id | "customer_id" | BIGINT | ##
 duck.analytics.orders.customer_id       | customer_id | "customer_id" | BIGINT | ##
 duck.main.staging_events.customer_id    | customer_id | "customer_id" | BIGINT | ##
(3 rows)
```

`--path` narrows a search to one subtree:

```bash
hsql "path/to/duck.db" --catalog-search order --path duck.analytics -tA
```

```output
duck.analytics.order_totals|order_totals|"analytics"."order_totals"|VIEW|v
duck.analytics.orders|orders|"analytics"."orders"|BASE TABLE|t
```

<Note>

Not every adapter can search. `hsql --info -a NAME` reports
`implements_catalog_search`; see [Running Safely](/docs/hsql/safety).

</Note>

## Formats and Files

A listing is a result set, so every [format and output
option](/docs/hsql/formats) applies:

```bash
hsql "path/to/duck.db" --catalog --path duck.analytics -tA --csv
```

```output
duck.analytics.customers,customers,"""analytics"".""customers""",BASE TABLE,t
duck.analytics.order_totals,order_totals,"""analytics"".""order_totals""",VIEW,v
duck.analytics.orders,orders,"""analytics"".""orders""",BASE TABLE,t
```

```bash
hsql -P prod --catalog --path prod.public --json -o ./schema.json
```

They are modes rather than options: hsql either reads the catalog or runs SQL.
Passing `-c` or `-f` beside `--catalog` [exits `2`](/docs/hsql/exit-codes). Use
two invocations.

For the same catalog as a tree you can click through, use the Harlequin IDE.
