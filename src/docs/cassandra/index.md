---
title: "Adapter: Cassandra"
menuOrder: 160
---

**CAUTION: This adapter is unstable and experimental.**

**NOTE: This adapter does not aim to support [Scylla](https://www.scylladb.com).**

## Integration With Harlequin

**Some quirks are to be expected.**

Cassandra doesn't use cursor(s), thus `HarlequinCursor` and `HarlequinConnection`
behave differently in this adapter.

A manual translation of `cassandra-driver` objects types to Python types is
required for Apache Arrow to work correctly.

In this adapter, [`Transaction Modes`](https://harlequin.sh/docs/transactions) refers to
Cassandra's consistency levels.

## Installation

### Using pip

To install this adapter into an activated virtual environment:

```bash
pip install harlequin-cassandra
```

### Using poetry

```bash
poetry add harlequin-cassandra
```

### Using pipx

If you do not already have Harlequin installed:

```bash
pipx install harlequin[cassandra]
```

If you would like to add the Cassandra adapter to an existing Harlequin installation:

```bash
pipx inject harlequin harlequin-cassandra
```

### As an Extra

Alternatively, you can install Harlequin with the `cassandra` extra:

```bash
pip install harlequin[cassandra]
```

```bash
poetry add harlequin[cassandra]
```

```bash
pipx install harlequin[cassandra]
```

## Usage and Configuration

To see the full list of options, run:

```bash
harlequin --help
```

- `--host` - Specifies the initial host to connect to. After the driver successfully connects to the node, it will auto discoverthe rest of the nodes in the cluster and will connect to them.
- `--port` - Port number to connect to at the server host.
- `--keyspace` - The keyspace name to use when connecting with the Cassandra server.
- `--username` - Cassandra user name to connect as.
- `--password` - Password to be used if the server demands password authentication.
- `--protocol-version` - The maximum version of the native protocol to use. If not specified, will be auto-discovered by the driver.
- `--consistency-level` - Specifies how many replicas must respond for an operation to be considered asuccess.
