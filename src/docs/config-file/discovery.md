---
title: Discovering Config Files
menuOrder: 8
---

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

You can also use the `$HARLEQUIN_CONFIG_PATH` environment variable as an alternative way to specify a custom config file path.

```bash
export HARLEQUIN_CONFIG_PATH=/path/to/my/file.toml
harlequin
```

If both are provided, the CLI option takes precedence over the environment variable.
