---
title: Config Files and Profiles
description: How hsql discovers and merges config files, how a profile keeps credentials out of your shell history, and what the five --config modes do.
---

<script>
    import Tip from "$lib/components/tip.svelte"
    import Warning from "$lib/components/warning.svelte"
</script>

hsql and Harlequin read the same config files, in the same order, and store
their options under the same profiles. One profile serves both, which is what
makes _hand this off to a human_ a one-liner: the agent runs
`hsql -P prod --catalog`, and the human runs `harlequin -P prod`.

[Configuring Harlequin](/docs/config-file) covers config files in full —
[where they are found](/docs/config-file/discovery),
[how to create one](/docs/config-file/creating-config), and
[how a profile is selected](/docs/config-file/profiles). This page is the part
that matters at a command line: what a profile looks like, how to keep secrets
out of it, and the modes that read and write one without connecting to
anything.

## What a Profile Looks Like

```toml
default_profile = "dev"

[profiles.dev]
adapter = "duckdb"
conn_str = [ "./dev.db" ]

[profiles.prod]
adapter = "postgres"
host = "$&lbrace;PGHOST:-localhost&rbrace;"
port = 5432
user = "reporting"
password = "$&lbrace;PGPASSWORD&rbrace;"
read_only = true
timeout = 30
limit = -1
```

Keys are the long option names with their dashes turned into underscores:
`--read-only` becomes `read_only`, `--on-error` becomes `on_error`. Two groups
of keys live in a profile — hsql's own, and the connection options the adapter
declares — and `hsql --help -a postgres` lists the second group for one
adapter, `hsql --spec` gives both as JSON.

`--profile` itself is not a key: it names the profile.

```bash
hsql -P prod -c "select count(*) from orders" --csv
hsql -P None -c "select 1"
```

`-P None` skips the config files entirely and runs on Harlequin's own defaults.
An option you type on the command line beats the profile's — but only when you
actually type it, so a profile's `limit = -1` is not quietly undone by the
default 500.

## Which File Wins

Files are discovered in priority order — the one `--config-path` names, then the
working directory, then your user config directory, then your home directory —
and within a directory, `harlequin.toml` beats `.harlequin.toml`, which beats a
`pyproject.toml`'s `[tool.harlequin]` table.

They merge **one profile at a time**, nearest file first. A project-local file
that defines a single profile leaves every other profile, and the
`default_profile` that names one of them, exactly as it was.

```bash
hsql --config-path ./ci.toml -P warehouse -c "select 1"
```

`--config-path` is also read from the `HARLEQUIN_CONFIG_PATH` environment
variable, and `hsql --info` reports which files this machine actually has,
highest priority first.

## Keeping Credentials Out

<Warning>

A connection string on the command line is in your shell history and in the
process table, where other people can read it. Put credentials in a profile,
and the secret itself in an environment variable.

</Warning>

A profile's string values can name environment variables, so a config file your
team shares — and commits — holds no credentials:

- `${VAR}` is required: hsql exits `2` if it is unset.
- `${VAR:-default}` supplies a default when it is not.
- `$${` is how a value that really does start with a literal `${` is written.

Values an adapter declares as secret are masked wherever hsql prints them —
`--config show`, `--info`, and error messages — as is the password inside a
connection string.

A local database file is not a credential. Pass it on the command line and move
on.

## The Five `--config` Modes

None of them connects to a database, and each one exits without running SQL:

```bash
hsql --config list-profiles
hsql --config show
hsql --config show --json
hsql --config validate
hsql --config schema
hsql --config init -P prod -a sqlite ./app.db --read-only --limit -1
```

- **`list-profiles`** — the names `-P` takes, each one's adapter, and which is
  the default.
- **`show`** — the merged config, with the file each value came from beside it.
- **`validate`** — every problem in every discovered file, exiting `2` if it
  found any. It names the file and the key, including a misspelled key that an
  adapter would otherwise have silently ignored.
- **`schema`** — a JSON Schema for a config file, covering the adapters you have
  installed.
- **`init`** — the one that writes. It takes the options you typed, hsql's and
  the adapter's alike, writes them into that profile in the nearest config file,
  prompts for nothing, and leaves the other profiles and the file's comments
  untouched.

`list-profiles` and `validate` are result sets, so `--csv`, `-t`, `-A` and `-o`
work on them exactly as they work on a query.

<Tip>

Point your editor at the schema for completion and validation as you type. The
schema for your own installation is `hsql --config schema -o ./schema.json`;
the published one, which every config file Harlequin generates already names, is
at [harlequin.sh/schemas/config/v1.json](/schemas/config/v1.json).

</Tip>

## Writing One by Hand

1. `hsql --info` — see which files exist, and which would win.
2. `hsql --help -a NAME` — see what that adapter's connection options are
   called.
3. Write the profile, with an environment variable for anything secret.
4. `hsql --config validate` — it names the file and the key for anything wrong.
5. `hsql -P NAME --catalog` — the cheapest proof that the profile connects.

`hsql --config init` does steps 3 through 5's worth of typing for you, and
`harlequin --config` is the interactive wizard for a human who would rather
click.
