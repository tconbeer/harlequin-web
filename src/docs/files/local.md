---
title: Local Files
menuOrder: 3
---

Harlequin's Data Catalog will show remote files in a second tab in the Data Catalog if Harlequin is initialized with the `--show-files` option (alias `-f`). `--show-files` takes an absolute or relative file path to a directory as its argument:

For example, an absolute path:

```bash
harlequin --show-files /path/to/my/data
```

For the current working directory:

```bash
harlequin -f .
```
