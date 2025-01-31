---
title: Creating Config Files
topic: Configuring Harlequin
menuOrder: 7
---

<script>
    import wizard from "$lib/assets/docs/config-wizard.png"
    import Figure from "$lib/components/figure.svelte"
</script>

You can create config files manually, using any text editor. However, Harlequin can help make that process easier with its config wizard. To launch the wizard, run Harlequin with the `--config` option:

```bash
harlequin --config
```

Harlequin will then prompt you for the path to the config file to generate or edit, the name of the profile to create or update, and to provide values for all available options.

<Figure src={wizard} alt="Example of the config wizard." caption="Example of the config wizard."></Figure>

## Config File Schema

Config files are written in [TOML](https://toml.io/en/).

Config files define one or more profiles, which contain keys that map to Harlequin options or adapter options. Each profile is a TOML table with the key `[profiles.<profile-name>]`.

Config files may also define a default profile, which Harlequin will automatically load if invoked without the `--profile` option.

For example, this is a valid config file:

```toml
default_profile = "my-duckdb-profile"

[profiles.my-duckdb-profile]
limit = 200_000
adapter = "duckdb"
conn_str = ["my-database.db"]
read_only = true
extension = ["httpfs", "spatial"]
init_path = "~/.duckdbrc"

[profiles.local-postgres]
theme = "gruvbox"
limit = 10_000
adapter = "postgres"
host = "localhost"
user = "postgres"
password = "secretadminpassword"
dbname = "postgres"
port = 5432
```

### Using pyproject.toml

If configuring Harlequin using `pyproject.toml`, you must nest the above config under the `tool.harlequin` table. An example `pyproject.toml` file:

```toml
[tool.harlequin]
default_profile = "my-duckdb-profile"

[tool.harlequin.profiles.my-duckdb-profile]
limit = 200_000
conn_str = ["my-database.db"]

[tool.harlequin.profiles.local-postgres]
theme = "gruvbox"
limit = 10_000
...
```

### Option names

To view a list of available options (including options for your installed adapters), run `harlequin --help`.

The names of options in the config file are the `snake_case` version of the command-line option. For example, the command-line option `--read-only` becomes `read_only` in the config file.
