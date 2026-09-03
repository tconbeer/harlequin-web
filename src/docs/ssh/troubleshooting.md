---
title: Troubleshooting SSH
description: "More information on SSH errors and how to fix them."
---

<script>
    import Key from "$lib/components/key.svelte"
    import Note from "$lib/components/note.svelte"
</script>

A tunnel is a chain: your computer runs an `ssh` client, the client authenticates to the bastion, the bastion opens a forward back to a port on your machine, and Harlequin connects to that port to reach the database on the private network. Each link fails in its own way, and the message usually says which one gave out. Work through them in order.

Harlequin passes `ssh`'s own diagnostics through as they arrive, so most of what you see is written by `ssh` itself.

## The ssh Client on Your Computer

```output
Harlequin could not run ssh: [Errno 2] No such file or directory: 'ssh'
```

There is no `ssh` on your `PATH`. Ask hsql what it found:

```bash
hsql --info | jq '.ssh'
```

```output
&lbrace;
  "client": null,
  "version": null
&rbrace;
```

Install an OpenSSH client — on Windows, "OpenSSH Client" is an optional feature under Settings → Apps → Optional Features.

## Authenticating to the SSH Host

`ssh` runs before the IDE takes over the terminal, so a prompt reaches you and you can answer it. When nobody answers, the wait ends at `--ssh-timeout`:

```output
ssh did not open the forward within 60s. It is most likely waiting for a
passphrase, a password, or confirmation of a host key; answer it, or pass
--ssh-batch-mode to fail immediately instead of waiting.
```

An outright refusal looks like this — the first line is `ssh`'s, the second is Harlequin's:

```output
my_ssh_username@bastion.example.com: Permission denied (publickey).
hsql: error: ssh exited with code 255 without opening the forward.
```

Either way, the fix is to make the connection work by hand first: run `ssh -N db_prod` in a terminal, answer whatever it asks, and confirm the host key. Then add the key to your agent so the next run needs no answer, and add [`--ssh-batch-mode`](/docs/ssh/config) to anything unattended, so a missing credential fails immediately and names itself instead of waiting.

If your login genuinely takes a while — an identity provider that opens a browser, or a hardware key you have to reach for — raise `--ssh-timeout` rather than lowering it.

## Opening the Local End of the Tunnel

The forward listens on a port on your own machine, and something else may already have it:

```output
localhost:15432 was already bound when the tunnel started, and ssh has not
exited within 60s to say whether it could take the port. Free it, forward a
different local port, or pass --ssh-allow-reuse to connect through the
listener that already has it.
```

Usually that is an `ssh -fN` you started earlier, or another Harlequin. All three suggestions work; [`--ssh-allow-reuse`](/docs/ssh/config) is the one for when the listener that has it is the tunnel you wanted anyway.

A tunnel that forwards nothing is refused before `ssh` runs, because the connection would go straight past it:

```output
db_prod configures no local forward, so a tunnel to it would carry
nothing. Pass --ssh-forward LOCAL:HOST:REMOTE, or add a LocalForward line to
the db_prod block of your ssh config.
```

## Reaching the Database From the Bastion

When the tunnel opens and the database connection still fails, the far end of the forward is the suspect: the error comes from your adapter rather than from `ssh`, and it usually says the connection was refused or timed out.

Remember that the remote address is resolved **by the bastion**, so check it there:

```bash
ssh db_prod
nc -vz db.internal 5432
```

If that fails, the name, the port, or the bastion's own access to the database is what to fix — a security group, a firewall rule, or a `HostName` that only resolves inside a different VPC. If it succeeds, compare it against the right-hand side of your forward.

## Connecting to the Wrong Local Port

If Harlequin reports a connection refused instantly, check that your connection details name the local end of the forward — `localhost` and `15432` in these examples — rather than the database's own port. A profile pointed at `5432` reaches whatever is running locally on `5432`, which on a developer's laptop is often another Postgres. That is the reason to forward to an unusual local port: the mistake becomes an error instead of a wrong answer.

## A Tunnel That Drops While You Work

Harlequin keeps the connection alive — where your ssh config sets no `ServerAliveInterval`, it sets one — so an idle forward behind a NAT or a corporate firewall is not silently reaped. When the tunnel goes anyway, it says so rather than letting the failure surface as a wall of query errors:

```output
tunnel closed: Timeout, server bastion.example.com not responding.
```

The next thing that needs the database — a query, a catalog refresh — reopens the tunnel and reconnects the adapter, then does what you asked. Because the IDE owns the terminal by now, the restart runs in batch mode: if it needs a credential nobody can type, it fails once and says why. Restart Harlequin at that point, so `ssh` can ask you for it again.

A reconnect is a **new session**, and Harlequin says so:

```output
The tunnel dropped and has been reopened, so this is a new session: an open
transaction, a temp table, and anything set with SET went with the old one.
```

<Note>

Refresh the Data Catalog with <Key>ctrl+r</Key> after a reconnect. Catalog items that have not been expanded yet still hold the connection that died with the old tunnel, so expanding one can fail with a Catalog Error until the tree is rebuilt.

</Note>

hsql runs one short session, and its statements are not idempotent — so a lost tunnel ends the run and reports it, leaving the decision to retry with you.

## One More Warning You May See

```output
note: ssh: ssh did not say what it forwards, so Harlequin did not wait for a
local port to answer before connecting.
```

Harlequin asks `ssh -G` what a run will forward so it knows which port to wait on. When that answer is missing or unreadable, it skips the wait and lets the adapter's connection be the test — the tunnel still opens, but a failure shows up as a connection error rather than an SSH one.

## Exit Codes

Both commands report a tunnel that will not open before the IDE or the query starts. hsql exits [`3`](/docs/hsql/exit-codes) — the same code as any other database it could not reach — or `2` when the problem is the configuration itself, like a tunnel with no forward.
