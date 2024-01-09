---
title: "Adapter: ODBC"
menuOrder: 60
---

The ODBC adapter allows Harlequin to work with most databases that support an Open Database Connect driver, including Microsoft SQL Server, Oracle, Teradata, Vertica, and even the best database of all time, Microsoft Excel.

## Installation

`harlequin-odbc` depends on `harlequin`, so installing this package will also install Harlequin.

### Pre-requisites

You will need an ODBC driver manager installed on your OS. Windows has one built-in, but for Unix-based OSes, you will need to download and install one before installing `harlequin-odbc`. You can install unixODBC with `brew install unixodbc` or `sudo apt install unixodbc`. See the [pyodbc docs](https://github.com/mkleehammer/pyodbc/wiki/Install) for more info.

Additionally, you will need to install the ODBC driver for your specific database (e.g., `ODBC Driver 18 for SQL Server` for MS SQL Server). For more information, see the docs for your specific database.

### Using pip

To install this adapter into an activated virtual environment:

```bash
pip install harlequin-odbc
```

### Using poetry

```bash
poetry add harlequin-odbc
```

### Using pipx

If you do not already have Harlequin installed:

```bash
pip install harlequin-odbc
```

If you would like to add the ODBC adapter to an existing Harlequin installation:

```bash
pipx inject harlequin harlequin-odbc
```

### As an Extra

Alternatively, you can install Harlequin with the `odbc` extra:

```bash
pip install harlequin[odbc]
```

```bash
poetry add harlequin[odbc]
```

```bash
pipx install harlequin[odbc]
```

## Usage and Configuration

You can open Harlequin with the ODBC adapter by selecting it with the `-a` option and passing an ODBC connection string:

```bash
harlequin -a odbc 'Driver=&lbrace;ODBC Driver 18 for SQL Server&rbrace;;Server=tcp:harlequin-example.database.windows.net,1433;Database=dev;Uid=harlequin;Pwd=my_secret;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;'
```

The ODBC adapter does not accept other options.
