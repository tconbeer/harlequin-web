---
title: "Multiple Databases"
menuOrder: 52
---

Currently, the Postgres adapter only supports connections to a single database at a time. To connect to a different database, exit Harlequin and restart it, passing a different DSN, or using the `-d` option to pass a different database name (the `-d` option overrides the database name in the DSN if it is provided).
