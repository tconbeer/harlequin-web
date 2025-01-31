---
title: "Adapter: ODBC"
menuOrder: 60
---

The ODBC adapter allows Harlequin to work with most databases that support an Open Database Connect driver, including Microsoft SQL Server, Oracle, Teradata, Vertica, and even the best database of all time, Microsoft Excel.

## Installation

### Pre-requisites

You will need an ODBC driver manager installed on your OS. Windows has one built-in, but for Unix-based OSes, you will need to download and install one before installing `harlequin-odbc`. You can install unixODBC with `brew install unixodbc` or `sudo apt install unixodbc`. See the [pyodbc docs](https://github.com/mkleehammer/pyodbc/wiki/Install) for more info.

Additionally, you will need to install the ODBC driver for your specific database (e.g., `ODBC Driver 18 for SQL Server` for MS SQL Server). For more information, see the docs for your specific database.

### Installing harlequin-odbc

You must install the `harlequin-odbc` package into the same environment as `harlequin`. The best and easiest way to do this is to use `uv` to install Harlequin with the `odbc` extra:

```bash
uv tool install 'harlequin['odbc]'
```

## Using Harlequin with an ODBC Driver

Run Harlequin with the `-a odbc` option and pass an ODBC connection string as an argument:

```bash
harlequin -a odbc 'Driver=&lbrace;ODBC Driver 18 for SQL Server&rbrace;;Server=tcp:harlequin-example.database.windows.net,1433;Database=dev;Uid=harlequin;Pwd=my_secret;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;'
```

The ODBC adapter does not accept other options.
