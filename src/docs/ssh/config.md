---
title: SSH Configuration
description: "Four worked examples, from a tunnel spelled entirely on the command line to one only your ssh config can express."
---

<script>
    import Warning from "$lib/components/warning.svelte"
</script>

To open a tunnel, Harlequin needs two things: an SSH destination, and a local forward. You can give it both on the command line, or let your `~/.ssh/config` supply either or both.

The four examples below build on each other, and all of them connect to the same Postgres database behind the same bastion — the one in the [overview](/docs/ssh).

## 1. Everything on the Command Line

With no ssh config to rely on, two options describe the whole tunnel:

```bash
harlequin -a postgres --host localhost --port 15432 --dbname analytics \
  --ssh-host my_ssh_username@bastion.example.com \
  --ssh-forward 15432:db.internal:5432
```

`--ssh-host` is the SSH destination, and Harlequin hands it to `ssh` the way you typed it: a hostname, `user@host`, `ssh://user@host:port`, or a `Host` alias like the one in the next example.

`--ssh-forward` is spelled the way `ssh -L` takes a local forward — `LOCAL:HOST:REMOTE`. Here that means "listen on port 15432 on this machine, and deliver to `db.internal:5432`," where `db.internal` is resolved by the bastion rather than by your computer. Repeat the option for a second forward.

The rest of the command line is the ordinary Postgres connection, pointed at the local end of the tunnel: `localhost`, port `15432`.

hsql takes the same options:

```bash
hsql -a postgres --host localhost --port 15432 --dbname analytics \
  --ssh-host my_ssh_username@bastion.example.com \
  --ssh-forward 15432:db.internal:5432 \
  -c "select count(*) from orders"
```

## 2. The Tunnel in Your ssh Config

The same tunnel, moved into `~/.ssh/config`. `LocalForward 15432 db.internal:5432` is the same directive as `--ssh-forward 15432:db.internal:5432`, written with a space instead of a colon:

```
Host db_prod
  HostName bastion.example.com
  User my_ssh_username
  LocalForward 15432 db.internal:5432
```

Harlequin now needs only the alias, and finds the forward where `ssh` finds it:

```bash
harlequin -a postgres --host localhost --port 15432 --dbname analytics --ssh-host db_prod
```

This is the setup we recommend. The `Host` block is read by everything else that speaks SSH — `ssh`, `scp`, `rsync`, your editor's remote tooling — so the tunnel is described once, in the place those tools already look.

## 3. The Tunnel in a Profile

The connection details are still on the command line in both examples above. A [profile](/docs/config-file) holds all of it, and the SSH options are profile keys like any other:

```toml
[profiles.prod]
adapter = "postgres"
host = "localhost"
port = 15432
dbname = "analytics"
user = "my_db_username"
ssh_host = "db_prod"
```

```bash
harlequin -P prod
hsql -P prod -c "select count(*) from orders"
```

Each SSH option has a profile key of the same name, spelled with underscores:

| Option                  | Profile key      | What it does                                                                |
| ----------------------- | ---------------- | --------------------------------------------------------------------------- |
| `--ssh-host TEXT`       | `ssh_host`       | The SSH destination. Setting it is what opens a tunnel.                     |
| `--ssh-forward TEXT`    | `ssh_forward`    | A local forward, as `ssh -L` spells one. Repeatable.                        |
| `--ssh-batch-mode`      | `ssh_batch_mode` | Fail rather than prompt for a passphrase, password, or host key.            |
| `--ssh-timeout SECONDS` | `ssh_timeout`    | How long to wait for the forwards to start answering. Default `60` seconds. |

`ssh_forward` takes one spec or an array of them, so a profile can describe the whole tunnel the way example 1 does:

```toml
[profiles.prod]
adapter = "postgres"
host = "localhost"
port = 15432
dbname = "analytics"
user = "my_db_username"
ssh_host = "my_ssh_username@bastion.example.com"
ssh_forward = ["15432:db.internal:5432"]
ssh_timeout = 30
```

The [config wizard](/docs/config-file/creating-config) asks about the tunnel while it builds the profile:

```bash
harlequin --config
```

```output
? Do you connect via SSH? Yes
? What SSH destination should this profile tunnel through? db_prod
? What should it forward?
? Should ssh fail rather than prompt for a passphrase or password? No
? How many seconds should Harlequin wait for the forwards?
```

`hsql --config init` writes the same keys from the options you typed, without prompting:

```bash
hsql --config init -P prod -a postgres --host localhost --port 15432 \
  --dbname analytics --ssh-host db_prod
```

<Warning>

**A profile whose host is `localhost` is only correct while its tunnel is up.** Run it with `ssh_host` removed — or as a second profile that forgot the key — and it connects to whatever is on that port on your own machine. Forward to an unusual local port, like `15432`, so that mistake is a connection refused instead of the wrong database.

</Warning>

## 4. What Only Your ssh Config Can Express

Harlequin's options describe a destination and a forward, which is the common case. Everything else about the connection is `ssh_config`'s to say — and Harlequin gets all of it, because it runs the `ssh` client you already have:

```
Host db_prod
  HostName bastion.example.com
  User my_ssh_username
  Port 2222
  IdentityFile ~/.ssh/id_ed25519_work
  IdentityAgent ~/.1password-agent.sock
  ProxyJump jump.example.com
  ServerAliveInterval 60
  LocalForward 15432 db.internal:5432
  LocalForward 16432 replica.internal:5432

Match host bastion.example.com exec "nc -z -w1 vpn.internal 443"
  ProxyJump none
```

A jump host in front of the bastion, a key held in a hardware token or a password manager's agent, an SSH certificate, keepalives tuned for your network, two forwards on one connection, a `Match` block that skips the jump when you are already on the VPN: `ssh` handles all of it, and Harlequin still needs only `--ssh-host db_prod`. Point a second profile at `localhost:16432` and it reaches the replica through the same tunnel.

This split is deliberate. Harlequin accepts a destination, a forward spec, a boolean, and a number; anything richer belongs to the file you control, for the reasons on [SSH Security](/docs/ssh/security).

## Reusing a Listener That Is Already There

By default, a local port that is already bound is an error: `ssh` exits rather than connecting without its forward, and Harlequin quotes it. That is the safe direction, because a port that answers might belong to any listener at all.

`--ssh-allow-reuse` says to connect anyway, as long as _every_ forwarded port is answering:

```output
note: ssh: localhost:15432 is already bound; connecting through the existing listener (--ssh-allow-reuse)
```

It is for the person who keeps `ssh -fN db_prod` running all day and would rather Harlequin used that tunnel than fought it. Harlequin reads this option from the command line only, and never from a config file — see [SSH Security](/docs/ssh/security).
