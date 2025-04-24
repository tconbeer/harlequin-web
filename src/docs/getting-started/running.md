---
title: Running Harlequin
menuOrder: -99
---

<script>
    import Key from "$lib/components/key.svelte"
</script>

Once Harlequin is installed, you run it from the command line. The arguments and options you pass in at the command line affect Harlequin's behavior, like what database adapter it uses, which database it connects to, whether or not the file picker is visible, and more. Assuming you have installed Harlequin so that it is on your [PATH](<https://en.wikipedia.org/wiki/PATH_(variable)>) (`uv tool install harlequin` does this automatically), you run Harlequin by typing a command of this form into your shell:

```bash
harlequin [OPTIONS] [CONN_STR]
```

where `[OPTIONS]` is 0 or more pairs of the form `--[option-name] [option-value]`, and `[CONN_STR]` is 0 or more connection strings. `[OPTIONS]` are composed of both Harlequin options and adapter options. For a full list of options, run Harlequin with the `--help` option:

```bash
harlequin --help
```

## Using Harlequin with DuckDB

Harlequin defaults to using its DuckDB database adapter, which ships with Harlequin and includes the full DuckDB in-process database.

To open an in-memory DuckDB session, run Harlequin with no arguments:

```bash
harlequin
```

To open one or more DuckDB database files, pass in relative or absolute paths as connection strings (Harlequin will create DuckDB databases if they do not exist):

```bash
harlequin "path/to/duck.db" "another_duck.db"
```

If you want to control the version of DuckDB that Harlequin uses, see the [Troubleshooting](../troubleshooting/duckdb-version-mismatch) page.

## Using Harlequin with SQLite and Other Adapters

Harlequin also ships with a SQLite3 adapter. To use that adapter, you specify the `--adapter sqlite` option. Like DuckDB, you can open an in-memory SQLite database by omitting the connection string:

```bash
harlequin --adapter sqlite
```

You can open one or more SQLite database files by passing in their paths as connection strings; note that the `--adapter` option has a short alias, `-a`:

```bash
harlequin -a sqlite "path/to/sqlite.db" "another_sqlite.db"
```

Other adapters can be installed as plug-ins; for more information, see the [installation guide](index#installing-database-adapters), and the guides for individual [adapters](../adapters). Each adapter can define its own options, which you can view using `harlequin --help`.

## Configuring Harlequin

Harlequin contains a large number of options that allow you to [set the theme](../themes), [customize key bindings](../keymaps/index), [show remote and local files](../files/index), set the locale for number formatting, and much more. These can always be entered at the command line, but it can be convenient to define a configuration as a profile instead. For more information on configuring Harlequin, see [Using Config Files](../config-file).

## Using Harlequin with Django

[django-harlequin](https://pypi.org/project/django-harlequin/) provides a command to launch Harlequin using Django’s database configuration, like:

```bash
./manage.py harlequin
```
