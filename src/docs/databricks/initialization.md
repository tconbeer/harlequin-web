---
title: Initialization Scripts
menuOrder: 121
---

Each time you start Harlequin, it will execute SQL commands from a Databricks initialization script.
For example:

```sql
USE CATALOG my_catalog;
SET TIME ZONE 'Asia/Tokyo';
DECLARE yesterday DATE DEFAULT CURRENT_DATE - INTERVAL '1' DAY;
```

Multi-line SQL is allowed, but must be terminated by a semicolon.

## Configuring the Script Location

By default, Harlequin will execute the script found at `~/.databricksrc`. However, you can provide
a different path using the `--init-path` option (aliased to `-i` or `-init`):

```bash
harlequin -a databricks --init-path /path/to/my/script.sql
```

## Disabling Initialization

If you would like to open Harlequin without running the script you have at `~/.databricksrc`, you
can either pass a nonexistent path (or `/dev/null`) to the option above, or start Harlequin with
the `--no-init` option:

```bash
harlequin -a databricks --no-init
```
