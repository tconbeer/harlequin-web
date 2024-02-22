---
title: Using Config Files
menuOrder: 6
---

<script>
    import wizard from "$lib/assets/docs/config-wizard.png"
</script>

Typing in command-line options with every invocation of Harlequin can get tiring. Instead, you can create profiles (sets of configurations) and save those profiles to a config file, which Harlequin will discover and load automatically.

Harlequin also provides a tool for creating and editing profiles. For more information, see [below](#creating-and-updating-config-files).

## Config File Discovery

Harlequin loads config files from the following locations. If it finds multiple files, it merges them, with items listed first taking priority:

    1. The file located at the path provided by the `--config-path` CLI option (see below).
    2. Files named `harlequin.toml`, `.harlequin.toml`, or `pyproject.toml` in the current working directory.
    3. Files named `harlequin.toml`, `.harlequin.toml`, or `config.toml` in the user's default config directory, in the `harlequin` subdirectory. For example:
        - Linux: `$XDG_CONFIG_HOME/harlequin/config.toml` or `~/.config/harlequin/config.toml`
        - Mac: `~/Library/Application Support/harlequin/config.toml`
        - Windows: `~\AppData\Local\harlequin\config.toml`
    4. Files named `harlequin.toml`, `.harlequin.toml`, or `pyproject.toml` in the user's home directory (`~`).

### Custom Config Path

You can specify a custom path to a config file by invoking Harlequin with the `--config-path` option:

```bash
harlequin --config-path /path/to/my/file.toml
```

## Selecting a Profile

To load Harlequin with the config from a profile, invoke Harlequin with the `--profile` option (alias `-P`):

```bash
harlequin --profile my-profile
```

Config files can also define a default profile. To override the default profile and run Harlequin without any values from its config files, invoke Harlequin with the special profile named `None`:

```bash
harlequin --profile None
```

## Creating and Updating Config Files

You can create config files manually, using any text editor. However, Harlequin can help make that process easier with its config wizard. To launch the wizard, run Harlequin with the `--config` option:

```bash
harlequin --config
```

Harlequin will then prompt you for the path to the config file to generate or edit, the name of the profile to create or update, and to provide values for all available options.

<div class="flex flex-wrap justify-center py-2">
    <figure>
        <img src={wizard} alt="Example of the config wizard."  class="h-auto w-full max-h-80">
        <figcaption class="text-center text-sm text-purple font-bold">Example of the config wizard.</figcaption>
    </figure>
</div>

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
theme = "fruity"
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
theme = "fruity"
limit = 10_000
...
```

### Option names

To view a list of available options (including options for your installed adapters), run `harlequin --help`.

The names of options in the config file are the `snake_case` version of the command-line option. For example, the command-line option `--read-only` becomes `read_only` in the config file.
