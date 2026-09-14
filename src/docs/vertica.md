---
title: "Adapter: Vertica"
description: "Install the community Vertica ODBC adapter and connect Harlequin to a Vertica database."
---

The Vertica ODBC adapter was contributed by community member [clang-engineer](https://github.com/clang-engineer). See the [adapter repository](https://github.com/clang-engineer/harlequin-odbc-vertica) for the most up-to-date documentation.

This adapter extends the standard ODBC adapter to handle Vertica-specific catalog and column metadata behavior. It uses the current database when the Vertica driver does not return a catalog name, and it queries `SQLColumns` without the unsupported catalog parameter. These fixes allow Harlequin to display Vertica tables and columns correctly.

## Prerequisites

Before installing the adapter, install an ODBC driver manager. Windows includes one; on macOS and Linux, install unixODBC. You must also install the [Vertica ODBC driver](https://www.vertica.com/download/vertica/odbc-driver/) and register it with your ODBC driver manager.

## Installation

Install `harlequin-odbc-vertica` into the same environment as Harlequin:

```bash
uv tool install harlequin --with harlequin-odbc-vertica
```

## Usage

The adapter name is `odbc-vertica`. Run Harlequin with the `-a odbc-vertica` option and pass an ODBC connection string. For example, using a configured DSN:

```bash
harlequin -a odbc-vertica 'DSN=vertica-example'
```
