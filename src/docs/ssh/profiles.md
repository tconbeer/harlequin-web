---
title: Tunnels in Profiles
description: "Put the tunnel and the connection details in the same profile, so one -P reaches the database — from the IDE, from hsql, and from a cron job."
---

<script>
    import Warning from "$lib/components/warning.svelte"
    import Note from "$lib/components/note.svelte"
</script>

A tunnel and the connection it carries belong together, so the SSH options are [profile keys](/docs/config-file) like any other. One `-P` then opens the tunnel and connects through it.

| Key              | Type            | Option             |
| ---------------- | --------------- | ------------------ |
| `ssh_host`       | string          | `--ssh-host`       |
| `ssh_forward`    | string or array | `--ssh-forward`    |
| `ssh_batch_mode` | boolean         | `--ssh-batch-mode` |
| `ssh_timeout`    | number          | `--ssh-timeout`    |

## One Key, With a `Host` Block

When your ssh config already declares the forward, the profile names the local end of it and the destination to open it through:

```toml
[profiles.redshift]
adapter = "postgres"
host = "localhost"
port = 15439
dbname = "prod"
user = "tco"
ssh_host = "redshift_prod"
```

```bash
harlequin -P redshift
hsql -P redshift -c "select count(*) from orders"
```

## Everything in the Profile

With no ssh config to rely on, spell the forward out. `ssh_forward` takes one spec or an array of them:

```toml
[profiles.redshift]
adapter = "postgres"
host = "localhost"
port = 15439
dbname = "prod"
user = "tco"
ssh_host = "tco@bastion.example.com"
ssh_forward = ["15439:analytics.internal:5439"]
ssh_timeout = 30
```

## Writing One

The [config wizard](/docs/config-file/creating-config) asks about the tunnel while it builds the profile:

```bash
harlequin --config
```

```output
? Do you connect via SSH? Yes
? What SSH destination should this profile tunnel through? redshift_prod
? What should it forward?
? Should ssh fail rather than prompt for a passphrase or password? No
? How many seconds should Harlequin wait for the forwards?
```

`hsql --config init` writes the same keys from the options you typed, without prompting:

```bash
hsql --config init -P redshift -a postgres --host localhost --port 15439 \
  --dbname prod --ssh-host redshift_prod
```

## Running Unattended

Set `ssh_batch_mode` in any profile a script, a cron job, CI, or an agent uses. Without it, an `ssh` that wants a passphrase waits at a prompt nobody can see until `ssh_timeout` runs out.

```toml
[profiles.agent]
adapter = "postgres"
host = "localhost"
port = 15439
dbname = "prod"
read_only = true
ssh_host = "redshift_prod"
ssh_batch_mode = true
```

```bash
hsql -P agent -tAc "select count(*) from orders"
```

A tunnel that will not open exits [`3`](/docs/hsql/exit-codes) — the same code as a database hsql could not reach, because it is the same problem to the caller. Make sure the key is one `ssh` can use without a human: an agent the job can reach, or an unencrypted key file with the right permissions.

<Note>

`ssh_allow_reuse` is the one SSH option with no profile key. It turns off the check that the local port is not already someone else's, and config files are discovered in the working directory — so a file that set it could quietly point your queries at a listener you did not open. Pass `--ssh-allow-reuse` on the command line instead.

</Note>

## Two Things To Watch

<Warning>

**A profile whose host is `localhost` is only correct while its tunnel is up.** Run it with `ssh_host` removed — or as a second profile that forgot the key — and it connects to whatever is on that port on your own machine. Forward to an unusual local port, like `15439`, so that mistake is a connection refused instead of the wrong database.

</Warning>

Harlequin's cached catalog and query history are keyed by the tunnel as well as by the connection details, so two bastions fronting two different databases on the same local port never share each other's catalogs.
