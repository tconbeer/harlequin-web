---
title: Config Modes
description: hsql's five --config modes — list-profiles, show, validate, schema and init — which read and write config files instead of running SQL.
---

<script>
    import Tip from "$lib/components/tip.svelte"
</script>

hsql reads the same config files as Harlequin, and
[Configuring Harlequin](/docs/config-file) covers them: [where they are
found](/docs/config-file/discovery), [how to write
one](/docs/config-file/creating-config), and [how a profile is
selected](/docs/config-file/profiles). `-P NAME`, `-P None` and
`--config-path PATH` mean the same thing to hsql that they mean to the IDE.

What hsql adds is five modes that work on those files instead of running SQL.
None of them connects to a database.

```bash
hsql --config list-profiles
hsql --config show
hsql --config show --json
hsql --config validate
hsql --config schema
hsql --config init -P prod -a sqlite ./app.db --read-only --limit -1
```

## `list-profiles`

The names `-P` takes, each one's adapter, and which one is the default.

## `show`

The merged config, with the file each value came from beside it. `--json` for a
parser. Values an adapter declares as secret are masked here, as they are
everywhere else hsql prints them.

## `validate`

Every problem in every discovered file, exiting [`2`](/docs/hsql/exit-codes) if
it found any. It names the file and the key, including a misspelled key an
adapter would otherwise ignore, and an environment variable a `${VAR}` needs
and does not have.

Two commands are the whole check that a profile works:

```bash
hsql --config validate
hsql -P prod --catalog
```

## `schema`

A JSON Schema for a config file, covering the adapters installed here.

<Tip>

Point an editor at it for completion as you type:
`hsql --config schema -o ./schema.json`. The published copy, which generated
config files already name, is at
[harlequin.sh/schemas/config/v1.json](/schemas/config/v1.json).

</Tip>

## `init`

Writes a profile from the options passed — hsql's and the adapter's alike —
into the nearest config file:

```bash
hsql --config init -P prod -a postgres --host db.example.com --read-only
```

It prompts for nothing, and leaves other profiles and the file's comments
untouched, so it is the mode for a script or an agent.
`harlequin --config` is the interactive wizard.

## Output

`list-profiles` and `validate` are result sets, so every
[format and output option](/docs/hsql/formats) applies:

```bash
hsql --config list-profiles --csv
hsql --config validate -tA
```

Like [`--catalog`](/docs/hsql/catalog), these are modes rather than options:
passing `-c` or `-f` beside one exits `2`.
