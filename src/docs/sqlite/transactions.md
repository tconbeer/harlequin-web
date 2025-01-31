---
title: Transaction Handling
menuOrder: 48
---

In SQLite, statements are auto-committed by default. That means, for example, a standalone `create table` statement will be committed as soon as the statement finishes executing.

To combine multiple statements in a transaction, you must explicitly `begin` a transaction, or use "Manual" transaction mode (see notes below).

## Manual Transaction Mode

### Pre-requisites

To use Manual mode with the SQLite adapter, you must be running **Harlequin v1.20.0** or higher using **Python 3.12** or higher.

### Using Manual Mode

In Manual mode, you do not explicitly need to `begin` a transaction: one will be opened for you. You can commit that transaction either by executing a `commit;` query, or pressing the "🡅" button in the Run Query bar. Analogously, you can roll back a transaction by executing `rollback;` or pressing the "⮌" button.
