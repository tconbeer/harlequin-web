---
title: "Adapter: Trino"
menuOrder: 110
---

The Trino adapter was contributed by community member Tyler Hillery.

## Installation

You must install the `harlequin-trino` package into the same environment as `harlequin`. The best and easiest way to do this is to use `uv` to install Harlequin with the `trino` extra:

```bash
uv tool install 'harlequin[trino]'
```

## Using Harlequin with Trino

For a minimum connection you are going to need:

- host
- port
- user

```bash
harlequin -a trino -h localhost -p 8080 -U my_user
```

If your trino instance requires a password you can set the `--require_auth` flag to password and use the `--password` flag for your password

```bash
harlequin -a trino -h localhost -p 8080 -U my_user --password my-pass --require_auth password
```

Many more options are available; to see the full list, run:

```bash
harlequin --help
```
