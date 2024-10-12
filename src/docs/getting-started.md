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

You may want to install Harlequin with one or more extras, which provide additional features like [additional database support](adapters) or [remote file viewing](files/remote). That would look like this:

```bash
pipx install harlequin[postgres,s3]
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
