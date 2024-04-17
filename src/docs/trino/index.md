---
title: "Adapter: Trino"
menuOrder: 110
---

## Installation

`harlequin-trino` depends on `harlequin`, so installing this package will also install Harlequin.

### Using pip

To install this adapter into an activated virtual environment:

```bash
pip install harlequin-trino
```

### Using poetry

```bash
poetry add harlequin-trino
```

### Using pipx

If you do not already have Harlequin installed:

```bash
pipx install harlequin[trino]
```

If you would like to add the Trino adapter to an existing Harlequin installation:

```bash
pipx inject harlequin harlequin-trino
```

### As an Extra

Alternatively, you can install Harlequin with the `trino` extra:

```bash
pip install harlequin[trino]
```

```bash
poetry add harlequin[trino]
```

```bash
pipx install harlequin[trino]
```

## Usage and Configuration

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
