---
title: Exploring the Catalog
description: How --catalog, --path and --catalog-search list a database's databases, schemas, relations and columns without running any SQL.
---

<script>
    import Tip from "$lib/components/tip.svelte"
    import Note from "$lib/components/note.svelte"
</script>

Before you can write a query, you have to know what is in the database.
`--catalog` lists the objects one level below `--path`, and exits without
running any SQL:

```bash
hsql "path/to/duck.db" --catalog
```

```output
 path | name | query_name | type     | type_label
------+------+------------+----------+------------
 duck | duck | "duck"     | database | db
(1 row)
```

Every row is five columns, and the first is the one that does the work:

| Column       | What it is                                                              |
| ------------ | ----------------------------------------------------------------------- |
| `path`       | What to pass to `--path` to list this object's own children.            |
| `name`       | The object's name, unquoted.                                            |
| `query_name` | The name already quoted for this database — paste this into SQL.        |
| `type`       | The database's own word for it: `database`, `schema`, `VIEW`, `BIGINT`. |
| `type_label` | The short label Harlequin shows in its data catalog.                    |

## Walking Down One Level at a Time

Pass a row's `path` back to `--path` to list what is under it:

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

One more level down is the columns, with their types:

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

The segments of a path are named by the adapter, so how deep the catalog goes,
and what each level is called, is the database's business rather than hsql's.

A trailing `*` filters a listing to the names that start with it:

```bash
hsql "path/to/duck.db" --catalog --path 'duck.analytics.ord*'
```

<Tip>

Quote a path containing `*`, or your shell will try to expand it
against the files in the working directory.

</Tip>

## Searching Instead of Walking

Walking is the wrong tool for _where does `orders` live_ and _which tables have
a `customer_id`_. `--catalog-search TERM` searches every level of the catalog at
once, for objects whose name contains TERM:

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

Not every adapter can search. An adapter that cannot says so and exits, rather
than walking its whole catalog for you. `hsql --info -a NAME` reports
`implements_catalog_search` for each installed adapter; see
[Running Safely](/docs/hsql/safety) for the rest of what it reports.

</Note>

## A Listing Is a Result Set

`--catalog` and `--catalog-search` produce rows, so every format and output
option applies to them exactly as it does to a query:

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

They are modes, though, not options: hsql either reads the catalog or runs SQL,
and passing `-c` or `-f` beside `--catalog` is a usage error that
[exits `2`](/docs/hsql/exit-codes). Run them as two invocations.

<Tip>

The same catalog, in a tree you can click through, is the data catalog in
Harlequin itself: `harlequin -P prod` opens it on the same profile.

</Tip>
