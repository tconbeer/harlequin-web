---
title: SSH Tunnels Overview
description: "Reach a database through a bastion or jump host: Harlequin runs ssh, holds a local forward open for the session, and closes it when you quit."
---

<script>
    import Figure from "$lib/components/figure.svelte"
    import tunnel from "$lib/assets/docs/ssh-tunnel.svg"
</script>

Many databases are not reachable from a laptop: they sit in a private subnet, behind a bastion, or on a host you can only reach over SSH. Harlequin and hsql can open that tunnel for you, before they connect, and close it when you quit.

## About SSH

An SSH tunnel is an encrypted connection to a server you can reach — a bastion, a jump box, or the database host itself — carrying a **local forward**. Your `ssh` client listens on a port on your own machine, and everything sent to that port travels over the encrypted connection to the server, which delivers it to an address that it can reach.

<Figure src={tunnel} alt="Harlequin connects to localhost:15432, where ssh is listening. The ssh client carries that traffic over an encrypted connection to bastion.example.com, which reaches Postgres at db.internal:5432 over its own network." caption="A local forward: ssh listens on localhost:15432, and the bastion delivers to Postgres at db.internal:5432."></Figure>

In this example, `ssh` listens on `localhost:15432` and forwards any connection on that port to the remote Postgres that the bastion (or server) can reach at `db.internal:5432`. This is considered a "tunnel." A tunnel can be configured for a specific Host with a `LocalForward` key in your `~/.ssh/config`:

```
Host db_prod
  HostName bastion.example.com
  User my_ssh_username
  LocalForward 15432 db.internal:5432
```

`User` is your username on the SSH host; the database has its own user, which you give to Harlequin with your other connection details.

Harlequin runs on your local machine, so it should then be configured to connect to the local end of the tunnel, open at `localhost:15432`:

```bash
harlequin -a postgres --host localhost --port 15432 --dbname prod --ssh-host db_prod
```

## Prerequisites (Dependencies)

This feature requires an `ssh` client on your `PATH`. An OpenSSH client ships with macOS, Linux, and Windows 10 and later, so you most likely already have one installed. Harlequin uses the SSH client already installed and configured on your computer, so **your whole `~/.ssh/config` applies**: `Host` aliases, `LocalForward`, `ProxyJump`, identity files, certificates, your agent, and `Match` blocks all behave exactly as they do when you run `ssh` yourself.

`hsql --info` reports the ssh client that it uses:

```bash
hsql --info | jq '.ssh'
```

```output
&lbrace;
  "client": "/usr/bin/ssh",
  "version": "OpenSSH_9.6p1, LibreSSL 3.3.6"
&rbrace;
```

## Recommended Configuration

Define a Host that configures a `LocalForward` in your `~/.ssh/config`, like the one above. Then [create a profile](/docs/config-file/creating-config) that names the SSH Host and sets the other database connection options:

```toml
[profiles.prod]
adapter = "postgres"
host = "localhost"
port = 15432
dbname = "prod"
user = "my_db_username"
ssh_host = "db_prod"
```

`harlequin -P prod` and `hsql -P prod` then open the tunnel and connect through it.

## What Happens When You Connect

1. When you run Harlequin or hsql with an `--ssh-host` option, it will attempt to establish the SSH tunnel before starting. `ssh` may prompt you for a password, 2FA, etc. (Pass [`--ssh-batch-mode`](/docs/ssh/options) to fail instead of prompting.)
2. If the tunnel is opened successfully, Harlequin will attempt to connect to your database through the tunnel. If it succeeds, you will be shown a notification that the tunnel and connection are open.
3. Harlequin keeps the SSH connection alive, and will attempt to reconnect if it fails.
4. When you quit Harlequin, it closes the tunnel during shutdown.
