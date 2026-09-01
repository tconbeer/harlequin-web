---
title: "Redshift Basic Usage"
description: "Install the Redshift adapter and connect Harlequin to an Amazon Redshift cluster or Serverless workgroup."
---

<script>
    import Key from "$lib/components/key.svelte"
    import Note from "$lib/components/note.svelte"
</script>

The Redshift adapter is built on [`redshift_connector`](https://github.com/aws/amazon-redshift-python-driver), Amazon's own Python driver.

<Note>

Harlequin's [Postgres adapter](/docs/postgres) uses `psycopg`, which [cannot talk to Redshift](https://github.com/tconbeer/harlequin-postgres/issues/43). Use this adapter instead: it leans on what the official driver and the server offer, including cross-database catalog metadata, `CANCEL`, `SHOW TABLE` / `SHOW VIEW` DDL, the `SVV_*` tuning views, IAM and Redshift Serverless authentication, and federated identity providers.

</Note>

## Installation

You must install the `harlequin-redshift` package into the same environment as `harlequin`. The best and easiest way to do this is to use `uv`:

```bash
uv tool install harlequin --with harlequin-redshift
```

To add the adapter to an existing Harlequin installation:

```bash
uv tool install --upgrade harlequin --with harlequin-redshift
```

## Using Harlequin with Redshift

To connect to a Redshift cluster, run Harlequin with the `-a redshift` option and pass a connection string as an argument:

```bash
harlequin -a redshift "redshift://my-user:my-pass@my-cluster.abc123.us-east-1.redshift.amazonaws.com:5439/dev"
```

A connection string may be a URL, with a `redshift://`, `postgres://`, or `postgresql://` scheme, or a libpq-style keyword string:

```bash
harlequin -a redshift "host=localhost port=5439 dbname=dev user=awsuser"
```

## Connection Options

You can also pass all or part of the connection string as separate options. The following is equivalent to the URL above:

```bash
harlequin -a redshift -h my-cluster.abc123.us-east-1.redshift.amazonaws.com -p 5439 -d dev -u my-user --password my-pass
```

Options set at the command line, in a [profile](/docs/config-file/profiles), or in the environment override the same setting in the connection string. Extra driver options can also ride along in a URL's query string:

```bash
harlequin -a redshift "redshift://my-cluster:5439/dev?iam=true&region=us-east-1"
```

For descriptions of each option, run:

```
harlequin --help
```

For IAM, Redshift Serverless, and federated identity providers, see [Authentication](/docs/redshift/auth).

## Cancelling a Query

Press <Key>ctrl+c</Key> while a query is running. The adapter sends Redshift's `CANCEL <pid>` statement on a second connection, and the cancelled query returns no result instead of raising an error.

## Transaction Modes

Click the `Tx:` label in the Run Query Bar to switch between `Auto` and `Manual`. In `Manual`, one transaction stays open across statements, and Harlequin shows Commit and Rollback buttons. See [Managing Transactions](/docs/transactions) for more.

## Read-Only Mode

```bash
harlequin --read-only -a redshift "redshift://my-cluster:5439/dev"
```

The adapter asks the server for a session-wide read-only default first, and confirms that the server reports it as on. If the server has no such setting, it opens every transaction with `BEGIN READ ONLY` instead, and confirms that the server reports `transaction_read_only` as on inside one. If neither holds, Harlequin refuses to start rather than hand back a connection that would happily write.

Read-only mode applies to both Auto and Manual transaction modes.
