---
title: SSH Configuration
description: "How to configure both simple and complex SSH tunnels with Harlequin."
---

<script>
    import Tip from "$lib/components/tip.svelte"
</script>

To open a tunnel, Harlequin needs two things: an SSH destination (the address of the SSH server, or bastion), and instructions for the bastion on how to forward connections (what is known as a local forward). You can configure these elements directly in Harlequin, or Harlequin can use configurations found in your SSH config file.

## Configuring an SSH Tunnel with CLI Options

A simple tunnel can be configured with just two Harlequin options:

```bash
harlequin -a postgres --host localhost --port 15432 --dbname analytics \
  --ssh-host my_ssh_username@bastion.example.com \
  --ssh-forward 15432:db.internal:5432
```

The first options specify the Postgres adapter, connecting to the local end of the SSH tunnel, with `--host localhost` and `--port 15432`.

`--ssh-host` defines the SSH destination. Harlequin accepts any of the forms used by `ssh`: a hostname, `user@host`, `ssh://user@host:port`, or the alias of a Host defined in an SSH config file.

`--ssh-forward` defines the local forward of the tunnel. It accepts the form that ssh's `-L` option takes: `LOCAL:HOST:REMOTE`. In the example above, `15432:db.internal:5432`, connections on port 15432 on your laptop will be forwarded to `db.internal` on port 5432 (as resolved by the bastion). You can repeat this option to define a second forward.

hsql takes the same options:

```bash
hsql -a postgres --host localhost --port 15432 --dbname analytics \
  --ssh-host my_ssh_username@bastion.example.com \
  --ssh-forward 15432:db.internal:5432 \
  -c "select count(*) from orders"
```

## Using an SSH Config File

By default, `ssh` looks for a config file in your user's `.ssh` directory: `~/.ssh/config`, or `%USERPROFILE%\.ssh\config` on Windows.

We can define the same SSH destination and local forward as the example above by defining a Host in an SSH config file:

```
Host db_prod
  HostName bastion.example.com
  User my_ssh_username
  LocalForward 15432 db.internal:5432
```

Now we can invoke Harlequin with only the `--ssh-host` option, where we pass the alias of the Host defined in the SSH config file:

```bash
harlequin -a postgres --host localhost --port 15432 --dbname analytics \
  --ssh-host db_prod
```

<Tip>

Defining a Host in an SSH config file allows it to be found by all programs that integrate with SSH, like `ssh`, `scp`, and `rsync`.

</Tip>

## Using a Harlequin Profile

Above we defined both the connection parameters and the SSH host on the command line. However, it is usually more convenient to create a [profile](/docs/config-file) that can automatically load this configuration:

```toml
[profiles.prod]
adapter = "postgres"
host = "localhost"
port = 15432
dbname = "analytics"
user = "my_db_username"
ssh_host = "db_prod"
```

Now invoking Harlequin with the profile option will automatically open the SSH tunnel:

```bash
harlequin -P prod
```

## More Complex SSH Configurations

Since Harlequin's SSH configurations live on the command line or in a profile, they are [intentionally limited](/docs/ssh/security), and only describe a subset of all SSH configurations. However, Harlequin can support arbitrarily complex SSH configurations; you just have to define the Host in an SSH config file:

```
Host db_prod
  HostName bastion.example.com
  User my_ssh_username
  Port 2222
  IdentityAgent ~/.1password-agent.sock
  ProxyJump jump.example.com
  ServerAliveInterval 60
  LocalForward 15432 db.internal:5432
  LocalForward 16432 replica.internal:5432

Match host bastion.example.com exec "nc -z -w1 vpn.internal 443"
  ProxyJump none
```

This config is quite complex: a jump host in front of the bastion, an identity agent, custom keepalives, two forwards on one connection, and a `Match` block that skips the jump when it isn't required. However, this works just fine with Harlequin. Both forwards are opened by the same tunnel, so two profiles can name the same Host and connect to different databases through it (note the different ports):

```toml
[profiles.prod]
adapter = "postgres"
host = "localhost"
port = 15432
dbname = "analytics"
user = "my_db_username"
ssh_host = "db_prod"

[profiles.replica]
adapter = "postgres"
host = "localhost"
port = 16432
dbname = "analytics"
user = "my_db_username"
ssh_host = "db_prod"
```

## Reusing an Open SSH Tunnel

By default, if the local port requested by Harlequin is already bound, then Harlequin and hsql will exit with an error.

When invoked with `--ssh-allow-reuse`, both programs will print a warning and then use the existing tunnel to connect to the database:

```output
note: ssh: localhost:15432 is already bound; connecting through the existing listener (--ssh-allow-reuse)
```

This option helps Harlequin play nicely with other dev tools, which might already have a tunnel open to the same database (e.g. with `ssh -fN db_prod`). However, reusing an existing tunnel runs the risk of exposing database connection secrets to a different, unintended listener. To help protect your connection secrets, this option must be passed on the command line, and will not be read from a Harlequin profile.
