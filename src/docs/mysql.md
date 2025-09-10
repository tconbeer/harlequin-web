---
title: "Adapter: MySQL/MariaDB"
menuOrder: 55
---

## Installation

You must install the `harlequin-mysql` package into the same environment as `harlequin`. The best and easiest way to do this is to use `uv` to install Harlequin with the `mysql` extra:

```bash
uv tool install 'harlequin[mysql]'
```

## Using Harlequin with MySQL or MariaDB

To connect to a MySQL or MariaDB database, run Harlequin with the `-a mysql` option and pass connection parameters as CLI options:

```bash
harlequin -a mysql -h localhost -p 3306 -U root --password example --database dev
```

The MySQL/MariaDB adapter does not accept a connection string or DSN.

## Connection Options

The supported connection options are:

```
host
port
unix_socket
database
user
password
password2
password3
connection_timeout
ssl-ca
ssl-cert
ssl-disabled
ssl-key
openid-token-file
pool-size
```

For descriptions of each option, run:

```
harlequin --help
```
