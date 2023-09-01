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
