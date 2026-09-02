---
title: SSH Tunnels Overview
description: "Reach a database through a bastion or jump host: Harlequin runs ssh, holds a local forward open for the session, and closes it when you quit."
---

<script>
    import Tip from "$lib/components/tip.svelte"
    import Note from "$lib/components/note.svelte"
    import Figure from "$lib/components/figure.svelte"
    import tunnel from "$lib/assets/docs/ssh-tunnel.svg"
</script>

Many databases are not reachable from a laptop: they sit in a private subnet, behind a bastion, or on a host you can only reach over SSH. Harlequin and hsql can open that tunnel for you, before they connect, and close it when you quit.

Both commands do this the same way, and every adapter can use it — including adapters this project does not maintain — because a tunnel simply gives the adapter a local address to connect to.

## About SSH

An SSH tunnel is an encrypted connection to a server you can reach — a bastion, a jump box, or the database host itself — carrying a **local forward**. Your `ssh` client listens on a port on your own machine, and everything sent to that port travels over the encrypted connection to the server, which delivers it to an address that it can reach.

<Figure src={tunnel} alt="Harlequin connects to localhost:15432, where ssh is listening. The ssh client carries that traffic over an encrypted connection to bastion.example.com, which reaches Postgres at db.internal:5432 over its own network." caption="A local forward: ssh listens on localhost:15432, and the bastion delivers to Postgres at db.internal:5432."></Figure>

In the diagram, `ssh` listens on `localhost:15432`, and whatever connects there is talking to Postgres at `db.internal:5432` — a name that resolves on the bastion. That forward is one line in your ssh config:

```
Host db_prod
  HostName bastion.example.com
  User tco
  LocalForward 15432 db.internal:5432
```

Harlequin is the client that connects to the local end of it, and `--ssh-host` is what tells Harlequin to open the tunnel first:

```bash
harlequin -a postgres --host localhost --port 15432 --dbname prod --ssh-host db_prod
```

**Your connection details name the local end of the forward** — `localhost` and `15432`, the port `ssh` listens on. Harlequin runs the tunnel and hands your connection options to the adapter exactly as you typed them, so TLS still verifies the hostname you asked for, and a profile that already works alongside a hand-run `ssh -fN` works here unchanged.

## Prerequisites (Dependencies)

This feature requires an `ssh` client on your `PATH`. That is the OpenSSH client that ships with macOS, Linux, and Windows 10 and later, and most people already have one. Harlequin uses the SSH implementation already installed and configured on your computer, so **your whole `~/.ssh/config` applies**: `Host` aliases, `LocalForward`, `ProxyJump`, identity files, certificates, your agent, and `Match` blocks all behave exactly as they do when you run `ssh` yourself.

`hsql --info` reports the client that would run:

```bash
hsql --info | jq '.ssh'
```

```output
&lbrace;
  "client": "/usr/bin/ssh",
  "version": "OpenSSH_9.6p1, LibreSSL 3.3.6"
&rbrace;
```

## The Recommended Setup

Put the connection in a `Host` block, like the one above, where the rest of your SSH tooling can see it. A tunnel is then one option, or one profile key:

```bash
harlequin -a postgres --host localhost --port 15432 --dbname prod --ssh-host db_prod
hsql -a postgres --host localhost --port 15432 --dbname prod --ssh-host db_prod -c "select 1"
```

If you have no ssh config to edit — in CI, in a container, or on a machine with no dotfiles — spell the forward on the command line instead with [`--ssh-forward`](/docs/ssh/options).

## What Happens When You Connect

1. Harlequin starts `ssh` **before** the IDE takes over the terminal, so a passphrase prompt, a password prompt, or a 2FA push still reaches you. (Pass [`--ssh-batch-mode`](/docs/ssh/options) when nobody is there to answer.)
2. It asks `ssh` what the run will forward, and waits — up to `--ssh-timeout`, 60 seconds by default — for every forwarded local port to accept a connection.
3. It says where the tunnel goes. Harlequin shows a notification; hsql writes a note to stderr, keeping stdout for your results:

   ```output
   note: ssh: localhost:15432 -> db.internal:5432 via db_prod
   ```

4. The adapter connects to the local port, and the query runs.
5. When you quit, the tunnel closes. `ssh` runs as a child process, so it dies with the session instead of outliving it.

<Tip>

**Forward to a distinct local port** — `15432`, not `5432`. A profile whose host is `localhost` is only correct while its tunnel is up; if you run it without one, an unusual local port gives you a connection refused instead of a query silently answered by a local database.

</Tip>

<Note>

A destination and a forward spec reach `ssh` verbatim, so when something is wrong with either one, `ssh`'s own message is what you get back.

</Note>

## Keep Reading

1. [Opening a Tunnel](/docs/ssh/options) — the five options, and what to put in each.
2. [Tunnels in Profiles](/docs/ssh/profiles) — the config file keys, and running unattended.
3. [When a Tunnel Fails](/docs/ssh/troubleshooting) — prompts, bound ports, and dropped connections.
