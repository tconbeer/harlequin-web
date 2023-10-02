---
title: Getting Started
menuOrder: 0
---

<script>
    import Key from "$lib/components/key.svelte"
</script>

## Installing Harlequin

After installing Python 3.8 or above, install Harlequin using `pip` or `pipx` with:

```bash
pipx install harlequin
```

**Note:** Harlequin depends on DuckDB, and installing it in an isolated environment (e.g., using `pipx` or in a fresh virtual environment) will cause it to install DuckDB. If you have DuckDB installed elsewhere (e.g., if you already installed DuckDB with `pipx` or Homebrew), you may want to pin the version of DuckDB that Harlequin uses. For more info, see the [Troubleshooting](troubleshooting#duckdb-version-mismatch) page.

## Using Harlequin

From any shell, to open one or more DuckDB database files:

```bash
harlequin "path/to/duck.db" "another_duck.db"
```

To open an in-memory DuckDB session, run Harlequin with no arguments:

```bash
harlequin
```

You can also open a database in read-only mode:

```bash
harlequin -r "path/to/duck.db"
```

## Getting Help

To view all command-line options for Harlequin, after installation, simply type:

```bash
harlequin -h
```

To view a list of all key bindings (keyboard shortcuts) within the app, press <Key>F1</Key>. You can also view this list outside the app [here](bindings).
