---
title: "Adapter: Cassandra"
menuOrder: 160
---

<script>
    import Warning from "$lib/components/warning.svelte"
    import Note from "$lib/components/note.svelte"
    import Link from "$lib/components/link.svelte"
</script>

The Cassandra adapter was contributed by community member Vadim Khitrin.

<Warning>
This adapter is unstable and experimental. Some quirks are to be expected.

Python 3.13 is not supported by this adapter, due to the <Link href="https://github.com/datastax/python-driver/pull/1242">underlying DataStax Cassandra python driver.</Link>
</Warning>

<Note> This adapter does not aim to support <Link href="https://www.scylladb.com">Scylla</Link>.</Note>

## Integration With Harlequin

Cassandra doesn't use cursor(s), thus `HarlequinCursor` and `HarlequinConnection`
behave differently in this adapter.

A manual translation of `cassandra-driver` objects types to Python types is
required for Apache Arrow to work correctly.

In this adapter, [`Transaction Modes`](https://harlequin.sh/docs/transactions) refers to
Cassandra's consistency levels.

## Installation

You must install the `harlequin-cassandra` package into the same environment as `harlequin`. The best and easiest way to do this is to use `uv` to install Harlequin with the `cassandra` extra:

```bash
uv tool install 'harlequin[cassandra]'
```

## Connection Options

- `--host` - Specifies the initial host to connect to. After the driver successfully connects to the node, it will auto discoverthe rest of the nodes in the cluster and will connect to them.
- `--port` - Port number to connect to at the server host.
- `--keyspace` - The keyspace name to use when connecting with the Cassandra server.
- `--username` - Cassandra user name to connect as.
- `--password` - Password to be used if the server demands password authentication.
- `--protocol-version` - The maximum version of the native protocol to use. If not specified, will be auto-discovered by the driver.
- `--consistency-level` - Specifies how many replicas must respond for an operation to be considered asuccess.

To see the full list of options, run:

```bash
harlequin --help
```
