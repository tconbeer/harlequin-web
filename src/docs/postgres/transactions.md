---
title: Transaction Handling
menuOrder: 43
---

`harlequin-postgres` v0.3 and higher defines two transaction modes: Auto and Manual. You can toggle between these modes using the button in the Run Query Bar.

## Auto Mode

In Auto mode, statements are auto-committed by default. That means, for example, a standalone `create table` statement will be committed as soon as the statement finishes executing.

## Manual Mode

In Manual mode, new transactions will be automatically opened, but not committed. You can commit that transaction either by executing a `commit;` query, or pressing the "🡅" button in the Run Query bar. Analogously, you can roll back a transaction by executing `rollback;` or pressing the "⮌" button.

In Manual Mode, the Data Catalog will not reflect uncommitted changes, since it uses a separate database connection.
