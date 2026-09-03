---
title: SSH Security
description: "The security model of Harlequin's SSH integration: what it accepts, what it refuses, and why a config file gets a smaller vocabulary than your ssh config."
---

<script>
    import Note from "$lib/components/note.svelte"
    import Warning from "$lib/components/warning.svelte"
</script>

Harlequin's SSH integration is small on purpose. It runs the `ssh` client you already have, hands it a destination and a forward, and leaves authentication, host keys, and everything else to `ssh` and to the config file you control.

## Where the Values Come From

Harlequin discovers config files rather than requiring one: the current working directory first, then your user config directory, then your home directory — and a `pyproject.toml` with a `[tool.harlequin]` section counts. That is convenient, and it is also the reason for the rules on this page: **a profile can arrive with a repository you cloned**, so a `ssh_host` or `ssh_forward` is not necessarily a value its user typed.

## What Harlequin Accepts

| Option              | Value                                            |
| ------------------- | ------------------------------------------------ |
| `--ssh-host`        | One SSH destination, handed to `ssh` verbatim    |
| `--ssh-forward`     | Local forward specs, handed to `ssh -L` verbatim |
| `--ssh-batch-mode`  | A boolean                                        |
| `--ssh-allow-reuse` | A boolean, from the command line only            |
| `--ssh-timeout`     | A number of seconds                              |

A destination, a forward spec, a boolean, and a number. Everything else about the connection comes from your `~/.ssh/config`, which `ssh` reads exactly as it does when you run `ssh` yourself.

## What Harlequin Refuses

| Refused                                          | Why                                                                                                                                           |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| A destination or forward starting with `-`       | `ssh` has no `--`, so such a value would reach it as an option rather than as a value                                                         |
| Shell metacharacters in a destination or forward | A destination reaches your ssh config as `%h`, `%r` and `%p`, where a `ProxyCommand` runs it through a shell (CVE-2023-51385, CVE-2025-61984) |
| `ssh_allow_reuse` in a config file               | It turns off the check that the local port belongs to the tunnel Harlequin opened, so it stays a deliberate act at the command line           |
| An SSH tunnel described with no `ssh_host`       | The connection would run past the forward to whatever answers locally                                                                         |

The characters refused inside a destination or a forward spec are the ones a shell acts on: whitespace and control characters, `` ` ``, `$`, `\`, `"`, `'`, `|`, `&`, `;`, `<`, `>`, `(`, `)`, `{`, and `}`. A hostname, a `Host` alias, and a `LOCAL:HOST:REMOTE` forward have no use for any of them.

## ssh Options Stay in Your ssh Config

Every other `ssh` option reaches the connection through your ssh config. Passing `-o KEY=VALUE` through Harlequin, or naming an alternate config file the way `ssh -F` does, would let a discovered config file set `ProxyCommand`, `LocalCommand`, or `KnownHostsCommand` — which is to say, run a command of its choosing on your machine. A deny list of such keywords would have to be revisited with every OpenSSH release, and a miss would be a hole; a vocabulary of four value types has nothing to deny.

A `ProxyCommand` in your own `~/.ssh/config` is unaffected, and always was.

## Forwards Are Local Forwards

`--ssh-forward` becomes `ssh -L`, and that is the whole of it: remote forwards (`ssh -R`) and SOCKS proxies (`ssh -D`) are outside Harlequin's vocabulary. A forward whose local end is a Unix socket path is passed through to `ssh` like any other, but Harlequin polls TCP ports to know a tunnel is ready, so it connects without waiting on a socket path.

Harlequin always adds `ExitOnForwardFailure=yes`, so a run never continues without the forward it asked for.

<Warning>

A forward bound to `0.0.0.0` or `*` listens on every interface, so anything that can reach your machine can reach the database through it. Harlequin opens it and says so:

```output
note: ssh: 0.0.0.0:15432 is bound to every interface, so anything that can
reach this machine can reach the database through it.
```

Bind to `localhost` — which is what a bare port number in a forward spec does — unless you meant to share it.

</Warning>

## The Client, and the Tunnel's Lifetime

Harlequin resolves `ssh` against your `PATH` and nothing else, so a repository that ships an `ssh.exe` cannot stand in for your client on Windows, where the working directory would otherwise be searched first. `hsql --info` reports the client that would run.

The tunnel is a child process rather than a backgrounded `ssh -f`. It is closed when the session ends, when the process is terminated or its terminal goes away, and by a backstop at interpreter exit — so a forward is not left listening after Harlequin is gone.

## Secrets in Output

An `ssh://user:password@host` destination is a credential, and so are the values an adapter declares secret. Harlequin masks them wherever it prints your configuration back — the IDE's Debug Info screen, `hsql --info`, `hsql --config show` — and in what it quotes from `ssh` on stderr.

<Note>

`ssh`'s output is third-party text: a server's pre-authentication banner, or a helper's instructions. Harlequin strips the control characters out of it before printing, so what a remote host writes cannot drive your terminal or become markup in the IDE.

</Note>
