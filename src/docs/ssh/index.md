---
title: SSH Tunnels Overview
description: "Reach a database through a bastion or jump host: Harlequin runs ssh, holds a local forward open for the session, and closes it when you quit."
---

<script>
    import Tip from "$lib/components/tip.svelte"
    import Note from "$lib/components/note.svelte"
</script>

Many databases are not reachable from a laptop: they sit in a private subnet, behind a bastion, or on a host you can only reach over SSH. Harlequin and hsql can open that tunnel for you, before they connect, and close it when you quit.

Both commands do this the same way, and it works with every adapter — including adapters this project does not maintain — because no adapter is told a tunnel exists.

## The Rule

**Your connection details name the local end of the forward.** Harlequin runs `ssh`; it does not touch your connection options.

If the tunnel listens on `localhost:15439` and delivers to a Redshift cluster on port `5439`, then the port you pass to the adapter is `15439`:

```bash
harlequin -a postgres --host localhost --port 15439 --dbname prod \
  --ssh-host redshift_prod
```

Nothing is rewritten, so TLS still verifies the hostname you asked for, and a profile that already works with a hand-run `ssh -fN` keeps working unchanged.

## What You Need

An `ssh` client on your `PATH` — the OpenSSH client that ships with macOS, Linux and Windows 10 and later. Harlequin adds no dependency and starts no SSH implementation of its own, which means **your whole `~/.ssh/config` applies**: `Host` aliases, `LocalForward`, `ProxyJump`, identity files, certificates, your agent, and `Match` blocks.

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

Put the connection in a `Host` block, where the rest of your SSH tooling can see it:

```
Host redshift_prod
  HostName bastion.example.com
  User tco
  LocalForward 15439 analytics.internal:5439
```

Then a tunnel is one option, or one profile key:

```bash
harlequin -a postgres --host localhost --port 15439 --dbname prod --ssh-host redshift_prod
hsql -a postgres --host localhost --port 15439 --dbname prod --ssh-host redshift_prod -c "select 1"
```

If you have no ssh config to edit — in CI, in a container, or on a machine with no dotfiles — spell the forward on the command line instead with [`--ssh-forward`](/docs/ssh/options).

## What Happens When You Connect

1. Harlequin starts `ssh` **before** the IDE takes over the terminal, so a passphrase prompt, a password prompt, or a 2FA push still reaches you. (Pass [`--ssh-batch-mode`](/docs/ssh/options) when nobody is there to answer.)
2. It asks `ssh` what the run will forward, and waits — up to `--ssh-timeout`, 60 seconds by default — for every forwarded local port to accept a connection.
3. It says where the tunnel goes. Harlequin shows a notification; hsql writes a note to stderr, never to stdout:

   ```output
   note: ssh: localhost:15439 -> analytics.internal:5439 via redshift_prod
   ```

4. The adapter connects to the local port, and the query runs.
5. When you quit, the tunnel closes. `ssh` runs as a child process rather than in the background, so it dies with the session instead of outliving it.

<Tip>

**Forward to a distinct local port** — `15439`, not `5439`. A profile whose host is `localhost` is only correct while its tunnel is up; if you run it without one, an unusual local port gives you a connection refused instead of a query silently answered by a local database.

</Tip>

<Note>

Harlequin parses none of what you pass it. A destination and a forward spec go to `ssh` verbatim, and when something is wrong with them, `ssh`'s own message is what you get back.

</Note>

## Keep Reading

1. [Opening a Tunnel](/docs/ssh/options) — the five options, and what to put in each.
2. [Tunnels in Profiles](/docs/ssh/profiles) — the config file keys, and running unattended.
3. [When a Tunnel Fails](/docs/ssh/troubleshooting) — prompts, bound ports, and dropped connections.
