---
title: When a Tunnel Fails
description: "What each SSH error means: a prompt nobody answered, a local port already in use, a forward that was never configured, and a tunnel that dropped mid-session."
---

<script>
    import Key from "$lib/components/key.svelte"
    import Note from "$lib/components/note.svelte"
</script>

Harlequin quotes `ssh` rather than paraphrasing it, so most of what you see here is `ssh`'s own diagnostic with a line of Harlequin's around it. Both commands print it before the IDE or the query starts, and exit [`3`](/docs/hsql/exit-codes) — or `2` when the problem is the configuration rather than the connection.

## Nothing Happened, Then It Gave Up

```output
ssh did not open the forward within 60s. It is most likely waiting for a
passphrase, a password, or confirmation of a host key; answer it, or pass
--ssh-batch-mode to fail immediately instead of waiting.
```

`ssh` was still running, so it was almost certainly waiting for input — a passphrase, a password, or a first-connection host key confirmation — that nobody typed. Run it once by hand to answer the prompt (`ssh -N redshift_prod`), add the key to your agent, and then add [`--ssh-batch-mode`](/docs/ssh/options) to anything unattended so the next failure is immediate and says which credential it wanted.

## ssh Exited Without Opening the Forward

```output
tco@bastion.example.com: Permission denied (publickey).
hsql: error: ssh exited with code 255 without opening the forward.
```

The lines above Harlequin's are `ssh`'s. `Permission denied` is an authentication problem, `Could not resolve hostname` is a name your machine could not look up, and `bind: Address already in use` is the case below. Harlequin always passes `ExitOnForwardFailure=yes`, so `ssh` exits rather than connecting without the forward and leaving you to wonder.

## The Local Port Is Already in Use

```output
localhost:15439 was already bound when the tunnel started, and ssh has not
exited within 60s to say whether it could take the port. Free it, forward a
different local port, or pass --ssh-allow-reuse to connect through the
listener that already has it.
```

Something already holds the port — usually an `ssh -fN` you started earlier, or another Harlequin. Any of the three suggestions works; [`--ssh-allow-reuse`](/docs/ssh/options) is the one for when the listener that has it is the tunnel you wanted anyway.

## Nothing Configures a Forward

```output
redshift_prod configures no local forward, so a tunnel to it would carry
nothing. Pass --ssh-forward LOCAL:HOST:REMOTE, or add a LocalForward line to
the redshift_prod block of your ssh config.
```

`--ssh-host` on its own opens a connection that carries no traffic. Say what to forward in either place — the error names both.

## Harlequin Could Not Run ssh

```output
Harlequin could not run ssh: [Errno 2] No such file or directory: 'ssh'
```

There is no `ssh` on your `PATH`. `hsql --info` reports what it found, or did not:

```bash
hsql --info | jq '.ssh'
```

```output
&lbrace;
  "client": null,
  "version": null
&rbrace;
```

Install an OpenSSH client — on Windows, "OpenSSH Client" is an optional feature in Settings → Apps → Optional Features.

## Warnings You May See Beside the Notice

```output
note: ssh: 0.0.0.0:15439 is bound to every interface, so anything that can
reach this machine can reach the database through it.
```

The forward is not limited to your own machine. That is what a bind address of `0.0.0.0` or `*` means; bind to `localhost` unless you meant to share it.

```output
note: ssh: ssh did not say what it forwards, so Harlequin did not wait for a
local port to answer before connecting.
```

Harlequin asks `ssh -G` what a run will forward so it knows which port to wait on. When that answer is missing or unreadable, it skips the wait and lets the adapter's connection be the test — the tunnel still opens, but a failure will show up as a connection error instead of an SSH one.

## The Tunnel Dropped While You Were Working

Harlequin keeps the connection alive: where your ssh config sets no `ServerAliveInterval`, it sets one, so an idle forward behind a NAT or a corporate firewall is not silently reaped. When the tunnel goes anyway, it says so rather than letting the failure surface as a wall of query errors:

```output
tunnel closed: Timeout, server bastion.example.com not responding.
```

The next thing that needs the database — a query, a catalog refresh — reopens the tunnel and reconnects the adapter, then does what you asked. Because the IDE owns the terminal by now, the restart always runs in batch mode: if it needs a credential nobody can type, it fails once, says why, and does not try again. Restart Harlequin at that point.

A reconnect is a **new session**, and Harlequin says so:

```output
The tunnel dropped and has been reopened, so this is a new session: an open
transaction, a temp table, and anything set with SET went with the old one.
```

<Note>

Refresh the Data Catalog with <Key>ctrl+r</Key> after a reconnect. Catalog items that have not been expanded yet still hold the connection that died with the old tunnel, so expanding one can fail with a Catalog Error until the tree is rebuilt.

</Note>

hsql does none of this. It is short-lived, and its statements are not idempotent, so a lost tunnel fails the run rather than quietly re-running anything.

## Reporting a Problem

The IDE's Debug Info screen (<Key>F12</Key> with the default keymap) includes the tunnel's description alongside your config, with credentials masked, ready to paste into an issue. See [Getting Help](/docs/getting-started/help).
