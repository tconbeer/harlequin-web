---
title: SSH Security
description: "The security model of Harlequin's SSH integration."
---

<script>
    import Note from "$lib/components/note.svelte"
    import Warning from "$lib/components/warning.svelte"
</script>

Harlequin's SSH integration is small on purpose. It runs the `ssh` client you already have, hands it a destination and a forward, and leaves authentication, host keys, and everything else to `ssh` and to the SSH config file you control.

## Trust and Config Files

Harlequin discovers profiles in several places, including the current working directory. This means that a profile can arrive with a repository that you cloned, a folder you downloaded from the internet, or another source that you may not trust.

That presents a security concern for SSH configuration, which can define arbitrary shell commands that will execute on both your local and remote machines. Accordingly, a Harlequin profile may only specify a subset of the full SSH configuration, and it may not specify a custom SSH config file location.

## What Harlequin Accepts

| Option              | Value                                            |
| ------------------- | ------------------------------------------------ |
| `--ssh-host`        | One SSH destination, handed to `ssh` verbatim    |
| `--ssh-forward`     | Local forward specs, handed to `ssh -L` verbatim |
| `--ssh-batch-mode`  | A boolean                                        |
| `--ssh-allow-reuse` | A boolean, from the command line only            |
| `--ssh-timeout`     | A number of seconds                              |

## What Harlequin Refuses in Profiles

| Refused                                                 | Why                                                                         |
| ------------------------------------------------------- | --------------------------------------------------------------------------- |
| A destination or forward starting with `-`              | `ssh` would read it as an option                                            |
| Shell metacharacters in a destination or forward        | A `ProxyCommand` expands them into a shell (CVE-2023-51385, CVE-2025-61984) |
| Other `ssh` options (`ssh -o KEY=VALUE`)                | Several of them name a command for `ssh` to run                             |
| A custom SSH config file location (`ssh -F`)            | The file it names can do the same                                           |
| Remote forwards (`ssh -R`) and SOCKS proxies (`ssh -D`) | A database tunnel needs only a local forward                                |
| `ssh_allow_reuse` in a profile                          | Accepting someone else's listener stays a command-line decision             |
| A tunnel with no `ssh_host`                             | The connection would run past the forward to whatever answers locally       |

A `ProxyCommand`, `LocalCommand`, or `KnownHostsCommand` in your own SSH config file is unaffected, and always was.

## Forwards

Harlequin always adds `ExitOnForwardFailure=yes`, so a run never continues without the forward it asked for. A forward whose local end is a Unix socket path is passed through to `ssh` like any other, but Harlequin polls TCP ports to know a tunnel is ready, so it connects without waiting on a socket path.

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
