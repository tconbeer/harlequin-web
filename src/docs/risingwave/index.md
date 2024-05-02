---
title: "Adapter: RisingWave"
menuOrder: 140
---

*This documentation is Copyright 2024 ZhengYu, Xu, reproduced here under an [MIT License](https://github.com/zen-xu/harlequin-risingwave/blob/main/LICENSE). See the [repository](https://github.com/zen-xu/harlequin-risingwave) for the most up-to-date documentation.*


## Installation

`harlequin-risingwave` depends on `harlequin` and `risingwave-postgres`, so installing this package will also install these packages.

### Using pip

To install this adapter into an activated virtual environment:
```bash
pip install harlequin-risingwave
```

### Using poetry

```bash
poetry add harlequin-risingwave
```

### Using pipx

If you do not already have Harlequin installed:

```bash
pipX install harlequin
pipx inject harlequin harlequin-risingwave
```

## Usage and Configuration

You can open Harlequin with the Risingwave adapter by selecting it with the `-a` option and passing a [Posgres DSN](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING):

```bash
harlequin -a risingwave "postgres://my-user:my-pass@localhost:5432/my-database"
```

You can also pass all or parts of the connection string as separate options. The following is equivalent to the above DSN:

```bash
harlequin -a risingwave -h localhost -p 5432 -U my-user --password my-pass -d my-database
```

Many more options are available; to see the full list, run:

```bash
harlequin --help
```

For more information, see the [Postgres docs](postgres/index).
