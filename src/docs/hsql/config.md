---
title: Config Files and Profiles
description: How hsql discovers and merges config files, how a profile keeps credentials out of your shell history, and what the five --config modes do.
---

<script>
    import Tip from "$lib/components/tip.svelte"
</script>

hsql and Harlequin read the same config files and the same profiles, so
`hsql -P prod --catalog` and `harlequin -P prod` connect the same way.

[Configuring Harlequin](/docs/config-file) covers those files in full: [where
they are found](/docs/config-file/discovery), [how to create
one](/docs/config-file/creating-config), and [how a profile is
selected](/docs/config-file/profiles). This page is the command-line view.

## A Profile

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

Keys are the long option names with dashes turned into underscores:
`--read-only` becomes `read_only`, `--on-error` becomes `on_error`. A profile
holds two groups of them — hsql's own, and the connection options the adapter
declares. `hsql --help -a postgres` lists an adapter's; `hsql --spec` gives
both as JSON.

`--profile` is not a key: it names the profile.

```bash
hsql -P prod -c "select count(*) from orders" --csv
hsql -P None -c "select 1"
```

`-P None` skips the config files and runs on Harlequin's defaults. An option
typed on the command line beats the profile's, but only when it is actually
typed, so a profile's `limit = -1` survives.

## Which File Wins

Files are discovered in priority order: the one `--config-path` names, then the
working directory, then the user config directory, then the home directory.
Within a directory, `harlequin.toml` beats `.harlequin.toml`, which beats a
`pyproject.toml`'s `[tool.harlequin]` table.

They merge one profile at a time, nearest file first. A project-local file that
defines one profile leaves the others, and the `default_profile`, alone.

```bash
hsql --config-path ./ci.toml -P warehouse -c "select 1"
```

`--config-path` also reads the `HARLEQUIN_CONFIG_PATH` environment variable.
`hsql --info` reports the files this machine has, highest priority first.

## Credentials

A connection string on the command line lands in the shell history and the
process table. A profile keeps it out of both, and a string value can name an
environment variable, so a config file the team commits holds no secrets:

- `${VAR}` is required; hsql exits `2` if it is unset.
- `${VAR:-default}` supplies a default.
- `$${` is a literal `${`.

Values an adapter declares as secret are masked wherever hsql prints them —
`--config show`, `--info`, error messages — as is the password inside a
connection string.

A local database file is not a credential; pass it on the command line.

## The `--config` Modes

Five modes work on config files instead of running SQL, and none of them
connects to a database:

```bash
hsql --config list-profiles
hsql --config show
hsql --config show --json
hsql --config validate
hsql --config schema
hsql --config init -P prod -a sqlite ./app.db --read-only --limit -1
```

- `list-profiles` — the names `-P` takes, each one's adapter, and which is the
  default.
- `show` — the merged config, with the file each value came from.
- `validate` — every problem in every discovered file, exiting `2` if it found
  any. It names the file and the key, including a misspelled key an adapter
  would otherwise ignore.
- `schema` — a JSON Schema covering the adapters installed here.
- `init` — writes a profile from the options passed, hsql's and the adapter's
  alike, into the nearest config file. It prompts for nothing and leaves other
  profiles and the file's comments untouched.

`list-profiles` and `validate` are result sets, so `--csv`, `-t`, `-A` and `-o`
work on them as they do on a query.

<Tip>

Point an editor at the schema for completion as you type:
`hsql --config schema -o ./schema.json`. The published copy, which generated
config files already name, is at
[harlequin.sh/schemas/config/v1.json](/schemas/config/v1.json).

</Tip>

## Writing One by Hand

1. `hsql --info` — which files exist, and which wins.
2. `hsql --help -a NAME` — what the adapter's connection options are called.
3. Write the profile, with an environment variable for anything secret.
4. `hsql --config validate` — names the file and key for anything wrong.
5. `hsql -P NAME --catalog` — the cheapest proof that it connects.

`hsql --config init` writes the profile for you. `harlequin --config` is the
interactive wizard.
