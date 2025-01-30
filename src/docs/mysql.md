---
title: "Adapter: MySQL"
menuOrder: 55
---

## Installation

`harlequin-mysql` depends on `harlequin`, so installing `harlequin-mysql` will also install Harlequin.

### Using pip

To install this adapter into an activated virtual environment:

```bash
pip install harlequin-mysql
```

### Using poetry

```bash
poetry add harlequin-mysql
```

### Using pipx

If you do not already have Harlequin installed:

```bash
pipx install harlequin[mysql]
```

If you would like to add the mysql adapter to an existing Harlequin installation:

```bash
pipx inject harlequin harlequin-mysql
```

### As an Extra

Alternatively, you can install Harlequin with the `mysql` extra:

```bash
pip install harlequin[mysql]
```

```bash
poetry add harlequin[mysql]
```

```bash
pipx install harlequin[mysql]
```

## Usage and Configuration

You can open Harlequin with the MySQL adapter by selecting it with the `-a` option and passing connection parameters as CLI options:

```bash
harlequin -a mysql -h localhost -p 3306 -U root --password example --database dev
```

The MySQL adapter does not accept a connection string or DSN.

Many more options are available; to see the full list, run:

```bash
harlequin --help
```
