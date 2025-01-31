---
title: Transaction Handling
menuOrder: 38
---

In DuckDB, statements are auto-committed by default. That means, for example, a standalone `create table` statement will be committed as soon as the statement finishes executing.

To combine multiple statements in a transaction, you must explicitly `begin` a transaction, as in this [example from the DuckDB docs](https://duckdb.org/docs/sql/statements/transactions.html#example):

```sql
CREATE TABLE person (name VARCHAR, age BIGINT);  -- auto-committed

BEGIN TRANSACTION;
INSERT INTO person VALUES ('Ada', 52);
COMMIT;

BEGIN TRANSACTION;
DELETE FROM person WHERE name = 'Ada';
INSERT INTO person VALUES ('Bruce', 39);
ROLLBACK;

SELECT * FROM person;
```

This behavior is not configurable in Harlequin.
