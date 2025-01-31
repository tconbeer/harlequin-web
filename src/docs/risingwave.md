---
title: "Adapter: RisingWave"
menuOrder: 140
---

_This documentation is Copyright 2024 ZhengYu, Xu, reproduced here under an [MIT License](https://github.com/zen-xu/harlequin-risingwave/blob/main/LICENSE). See the [repository](https://github.com/zen-xu/harlequin-risingwave) for the most up-to-date documentation._

## Installation

You must install the `harlequin-risingwave` package into the same environment as `harlequin`. The best and easiest way to do this is to use `uv` to install Harlequin with the additional package:

```bash
uv tool install harlequin --with harlequin-risingwave
```

## Usage and Configuration

Run Harlequin with the `-a risingwave` option and pass a [Posgres DSN](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING) as an argument:

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

For more information, see the [Postgres docs](postgres).
