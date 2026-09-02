---
title: Opening a Tunnel
description: "The five --ssh options that Harlequin and hsql share: the destination, the forwards, batch mode, the readiness timeout, and reusing a listener."
---

<script>
    import Note from "$lib/components/note.svelte"
    import Warning from "$lib/components/warning.svelte"
</script>

Both `harlequin` and `hsql` take the same five options, and each has a [profile key](/docs/ssh/profiles) of the same name:

| Option                  | Profile key      | What it does                                                                    |
| ----------------------- | ---------------- | ------------------------------------------------------------------------------- |
| `--ssh-host TEXT`       | `ssh_host`       | The SSH destination to tunnel through. Setting it is what opens a tunnel.       |
| `--ssh-forward TEXT`    | `ssh_forward`    | A local forward, as `ssh -L` spells one. Repeatable.                            |
| `--ssh-batch-mode`      | `ssh_batch_mode` | Fail rather than prompt for a passphrase, password, or host key.                |
| `--ssh-timeout SECONDS` | `ssh_timeout`    | How long to wait for the forwards. Default `60`.                                |
| `--ssh-allow-reuse`     | —                | Connect through a listener that already has the local port, instead of failing. |

## `--ssh-host`

The destination, passed to `ssh` verbatim. Anything `ssh` accepts works: a `Host` alias from your ssh config, a hostname, `user@host`, or `ssh://user@host:port`.

```bash
harlequin -P analytics --ssh-host redshift_prod
harlequin -P analytics --ssh-host tco@bastion.example.com
```

There is no `--ssh-user`, `--ssh-port`, or `--ssh-identity`, and no way to pass `ssh -o` options through Harlequin. **Everything else about the connection belongs in your ssh config**, where the rest of your tooling can already see it:

```
Host redshift_prod
  HostName bastion.example.com
  User tco
  Port 2222
  IdentityFile ~/.ssh/id_ed25519_work
  ProxyJump jump.example.com
  LocalForward 15439 analytics.internal:5439
```

<Note title_text="Why no --ssh-option">

`ssh -o ProxyCommand=...` runs a command, and Harlequin discovers config files in the working directory — so a cloned repository's `pyproject.toml` could otherwise run whatever it liked on your machine. A destination, a forward spec, a boolean and a number cannot. A `ProxyCommand` in your own ssh config is unaffected.

For the same reason, a destination or forward spec that starts with `-`, or that contains characters a `ProxyCommand` would expand into a shell, is refused before `ssh` runs.

</Note>

## `--ssh-forward`

A local forward, spelled the way `ssh -L` takes one: `LOCAL:HOST:REMOTE`. **The remote host is resolved on the SSH host**, so it can be a name that means nothing on your laptop.

```bash
hsql -a postgres --host localhost --port 15439 --dbname prod \
  --ssh-host tco@bastion.example.com \
  --ssh-forward 15439:analytics.internal:5439 \
  -c "select count(*) from orders"
```

Omit it when your ssh config already declares a `LocalForward` for that host — `LocalForward 15439 analytics.internal:5439` and `--ssh-forward 15439:analytics.internal:5439` are the same directive in two places. If you pass both, you get both forwards.

Some shapes worth knowing:

| Situation                                | Forward                                                              |
| ---------------------------------------- | -------------------------------------------------------------------- |
| The database runs on the SSH host itself | `--ssh-forward 15432:localhost:5432` (`localhost` is the far side's) |
| Your local `5432` is already in use      | `--ssh-forward 15432:db.internal:5432`, and connect on `15432`       |
| Two databases behind one host            | Repeat `--ssh-forward`; one `ssh` holds both open                    |
| A jump host in front of the bastion      | `ProxyJump` in the `Host` block — `ssh` chains them for you          |

A tunnel with no forward — nothing on the command line and no `LocalForward` in your ssh config — is an error, because it would connect somewhere and carry nothing.

<Warning>

A forward bound to `0.0.0.0` or `*` reaches everything that can reach your machine, not just your machine. Harlequin will open it and warn you that it did.

</Warning>

## `--ssh-batch-mode`

Sets `ssh`'s own `BatchMode=yes`: it fails immediately, saying which credential it wanted, instead of prompting. **Set it in scripts, cron jobs, CI, and anything an agent runs** — otherwise an unattended run waits out the whole timeout at an invisible prompt, then reports something vague.

```bash
hsql -P analytics --ssh-batch-mode -c "select count(*) from orders"
```

```output
tco@bastion.example.com: Permission denied (publickey).
hsql: error: ssh exited with code 255 without opening the forward.
```

`ssh` writes its own diagnostics to stderr as they happen, and Harlequin passes them straight through — so what went wrong is in `ssh`'s words, not in a paraphrase of them.

## `--ssh-timeout`

Seconds to wait for the forwarded ports to start answering; `60` by default. The wait is often on a person rather than on a network — an `ssh` that opens a browser for an identity provider, or asks you to tap a hardware key, is a minute of someone reading a screen — so the default is generous, and `--ssh-batch-mode` is the way to fail fast instead of shortening it.

## `--ssh-allow-reuse`

By default, a local port that is already bound is an error: `ssh` exits rather than connecting without its forward, and Harlequin quotes it. That is the safe direction, because a port that answers is no proof the right tunnel is behind it.

`--ssh-allow-reuse` says to connect anyway, as long as _every_ forwarded port is answering:

```output
note: ssh: localhost:15439 is already bound; connecting through the existing listener (--ssh-allow-reuse)
```

It is for the person who keeps `ssh -fN redshift_prod` running all day and does not want Harlequin fighting it. This is the one SSH option that **cannot** be set in a config file: it turns off a check, and config files are discovered in the working directory, so turning it off stays yours to do deliberately.

## What Harlequin Adds to `ssh`

Harlequin imposes almost nothing of its own on the connection. Beyond `-N` (forward only, run no remote command) and the `-L` flags you asked for, it adds:

- `ExitOnForwardFailure=yes`, always — a forward that silently did not happen is the one failure you cannot diagnose.
- `ServerAliveInterval=30` and `ServerAliveCountMax=3`, **only** when your own config resolves the keepalive interval to zero. Set `ServerAliveInterval` in your `Host` block and Harlequin leaves it alone.
- `BatchMode=yes`, when you asked for it — and on an automatic [reconnect](/docs/ssh/troubleshooting), when there is nowhere for a prompt to go.
