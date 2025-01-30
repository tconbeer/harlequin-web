---
title: Installation
topic: Getting Started
menuOrder: 0
---

<script>
    import Key from "$lib/components/key.svelte"
</script>

## Installing Harlequin

Harlequin is a Python program, and there are many ways to install and run it. We strongly recommend using [uv](https://docs.astral.sh/uv):

1. [Install uv](https://docs.astral.sh/uv/getting-started/installation/#standalone-installer). From a POSIX shell, run:

   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```

   Or using Windows Powershell:

   ```powershell
   powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
   ```

2. Install Harlequin as a tool (in an isolated environment) using `uv`:

   ```bash
   uv tool install harlequin
   ```

Alternatively, if you know what you're doing, after installing Python 3.9 or above, install Harlequin using `pip`, `pipx`, `poetry`, or any other program that can install Python packages from PyPI:

```bash
pip install harlequin
```

## Installing Database Adapters

Harlequin can connect to dozens of databases using adapter plug-ins. Adapters are distributed as their own Python packages that need to be installed into the same environment as Harlequin.

For a list of known adapters provided either by the Harlequin maintainers or the broader community, see the [adapters](adapters) page.

The adapter docs also include installation instructions. Some adapters can be installed as Harlequin extras, like `postgres`. If you used `uv` to install Harlequin:

```bash
uv tool install harlequin[postgres]
```

You can install multiple extras:

```bash
uv tool install harlequin[postgres,mysql,s3]
```

Some adapters are not available as extras, and have to be installed manually. You may also wish to do this to control the version of the adapter that Harlequin uses. You can add adapters to your installation using uv's `--with` option:

```bash
uv tool install harlequin --with harlequin-odbc
```

## Using Harlequin with DuckDB

Harlequin defaults to using its DuckDB database adapter.

From any shell, to open one or more DuckDB database files:

```bash
harlequin "path/to/duck.db" "another_duck.db"
```

To open an in-memory DuckDB session, run Harlequin with no arguments:

```bash
harlequin
```

If you want to control the version of DuckDB that Harlequin uses, see the [Troubleshooting](troubleshooting/duckdb-version-mismatch) page.

## Using Harlequin with SQLite and Other Adapters

Harlequin also ships with a SQLite3 adapter. You can open one or more SQLite database files with:

```bash
harlequin -a sqlite "path/to/sqlite.db" "another_sqlite.db"
```

Like DuckDB, you can also open an in-memory database by omitting the paths:

```bash
harlequin -a sqlite
```

Other adapters can be installed using `pip install <adapter package>` or `pipx inject harlequin <adapter package>`, depending on how you installed Harlequin. Several adapters are under active development; for a list of known adapters provided either by the Harlequin maintainers or the broader community, see the [adapters](adapters) page.

## Using Harlequin with Django

[django-harlequin](https://pypi.org/project/django-harlequin/) provides a command to launch Harlequin using Django’s database configuration, like:

```bash
./manage.py harlequin
```

## Getting Help

To view these docs from within the app, press <Key>F1</Key>.

To view all command-line options for Harlequin and all installed adapters, after installation, simply type:

```bash
harlequin --help
```

See the [Troubleshooting](troubleshooting/index) guide for help with key bindings, appearance issues, copy-paste, etc.

[GitHub Issues](https://github.com/tconbeer/harlequin/issues) are the best place to report bugs.

[GitHub Discussions](https://github.com/tconbeer/harlequin/discussions) are a good place to ask questions, request features, and more.
