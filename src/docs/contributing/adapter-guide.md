---
title: Creating an Adapter
menuOrder: 2100
---

Database adapters enable Harlequin to work with any relational database by abstracting the actual interface into a standard that Harlequin can use. The interface is minimal: adapters were designed to be easy to implement and maintain. Adapter authors only need familiarity with Python and the database they wish to use; no knowledge of Textual, user interfaces, or async programming is required.

## What, Exactly, Is an Adapter?

An adapter is a Python package that declares an [entry point](https://packaging.python.org/en/latest/specifications/entry-points/) in the `harlequin.adapters` group. That entry point should reference a subclass of the `HarlequinAdapter` abstract base class. This allows Harlequin to discover installed adapters and instantiate a selected adapter at run-time.

Harlequin has two built-in adapters that are distributed with the `harlequin` package. All other adapters should be distributed as their own packages. They may be named `harlequin_<database>`, but the naming convention is not necessary.

## Interfaces

There are three interfaces defined as abstract base classes in the [`harlequin.adapter`](https://github.com/tconbeer/harlequin/blob/main/src/harlequin/adapter.py) module. You will have to implement each of them.

### HarlequinAdapter

The first is the `HarlequinAdapter`, which is initialized with `conn_str` (a tuple of connection strings) and any options passed into Harlequin at the command line or through a config file. The adapter declares its options via the `ADAPTER_OPTIONS` and `COPY_FORMATS` class variables (more info [below](#adapter-options)).

The primary purpose of an adapter is to provide its `connect()` method, which creates and returns an instance of `HarlequinConnection`.

### HarlequinConnection

A connection must provide two methods: `get_catalog` and `execute`.

`get_catalog()` introspects the connection and returns a `Catalog`, whose items represent each database, relation, column, etc. available through the connection. The information in the `Catalog` is displayed to users in the Data Catalog sidebar in Harlequin, and is made available as autocomplete options. The schema for `Catalog` and `CatalogItem` are found in the [`harlequin.catalog`](https://github.com/tconbeer/harlequin/blob/main/src/harlequin/catalog.py) module.

`execute(query)` runs a query in the connected database. If the query returns data (like a select statement), `execute` returns a `HarlequinCursor`. Otherwise, it returns `None`.

`get_catalog` and `execute` are called by Harlequin in **different threads**, and those calls may overlap. If multiple queries are run by the user, `execute` may be called many times **serially**, in a single thread, before any of the cursors' results are fetched (currently there are no plans to execute queries in parallel using multiple threads).

A connection may also provide `get_completions`, `copy` and `validate_sql` methods.

`get_completions()` should return a list of [`HarlequinCompletion`](https://github.com/tconbeer/harlequin/blob/main/src/harlequin/autocomplete/completion.py) instances, which represent additional, adapter-specific keywords, functions, or other strings for editor autocomplete (Harlequin automatically builds completions for each `CatalogItem`, so they should not be included).

`copy(query, path, format_name, options)` should use the database's native capabilities to export the results of a query. It will receive a `format_name` and dict of `options` that are defined by the adapter's `COPY_FORMATS` class variable (more [below](#copy-formats)).

`validate_sql(query)` should very quickly parse the passed query: it is used to validate the selected text in Harlequin and determine whether the selection or entire query should be executed. If it is implemented, Harlequin will not attempt to execute the selected text if it is not a valid query; otherwise, Harlequin will always execute the selected text.

The transaction behavior of an adapter is undefined, and is up to the adapter author. The SQLite and Postgres adapters both use auto-commit mode on their connections. If desired, you may create an Adapter Option to configure this at Harlequin start-up; in the [future](https://github.com/tconbeer/harlequin/issues/334), we may standardize this behavior and add a UI element to change the transaction behavior.

It is not possible for Harlequin to cancel queries it has submitted for execution. Research on this is planned in the future; please comment on [this issue](https://github.com/tconbeer/harlequin/issues/333) if you would like to contribute to this feature.

### HarlequinCursor

A cursor must provide three methods: `columns`, `set_limit`, and `fetchall`.

`columns()` returns a list of tuples; each tuple is a `(column_name, column_type)` pair. The name and type will be printed in the column header in Harlequin's Results Viewer. The column type should be abbreviated to 1-3 characters: for example, the built-in adapters use `s` for string/varchar fields, `##` for integer fields, and `#.#` for floating-point fields.

`set_limit(limit)` should limit the number of records returned by a subsequent call to `fetchall()`. It is used by Harlequin to implement the limit checkbox on the Run Query Bar.

`fetchall()` should return all of the data returned by the query, in one of several accepted formats. It will be called exactly once on each cursor. The acceptable formats are declared by the `AutoBackendType` of Harlequin's Data Table widget (source [here](https://github.com/tconbeer/textual-fastdatatable/blob/a64308ea7e2e6de24df2f1d9c6cc1d024b2a6395/src/textual_fastdatatable/backend.py#L20-L27)). They are:

1. A PyArrow [`Table`](https://arrow.apache.org/docs/python/generated/pyarrow.Table.html) or [`RecordBatch`](https://arrow.apache.org/docs/python/generated/pyarrow.RecordBatch.html).
1. A `Mapping` of `str` to `Sequence`, where keys represent column names and the sequences are the data in each column. For example: `{"col_a": [1, 2, 3], "col_b": ["a", "b", "c"]}`
1. A `Sequence` of `Iterable`s, like a `list` of `tuple`s, representing rows of data (or records). Such a sequence **MUST NOT** contain a header row.
1. A `pathlib.Path` or `str` path to a local Parquet file.

### Adapter Options

Adapters will be initialized with `conn_str`, a sequence of connection strings. Adapters may interpret these strings however they like; Harlequin neither imposes constraints nor performs validation on them.

Beyond that, adapters can declare CLI options by setting the `ADAPTER_OPTIONS` class variable on their subclass of `HarlequinAdapter`. The class variable should be a list of instances of subclasses of [`AbstractOption`](https://github.com/tconbeer/harlequin/blob/main/src/harlequin/options.py), like `TextOption`, `FlagOption`, `SelectOption`, etc. Each `Option` instance must have a name and description. See the [`harlequin.options`](https://github.com/tconbeer/harlequin/blob/main/src/harlequin/options.py) module or the implementations by the [DuckDB](https://github.com/tconbeer/harlequin/blob/main/src/harlequin_duckdb/cli_options.py) and [SQLite](https://github.com/tconbeer/harlequin/blob/main/src/harlequin_sqlite/cli_options.py) adapters for more information.

### Copy Formats

Some adapters may facilitate exporting data locally. By setting the `COPY_FORMATS` class variable on their subclass of `HarlequinAdapter` and implementing `HarlequinConnection.copy()`, they can enable their users to use Harlequin's Data Exporter UI.

`COPY_FORMATS` is a list of `HarlequinCopyFormat` instances, which define a name, label, one or more file extensions associated with the format, and a list of `AbstractOption` subclass instances that define options for the format. For more information, see the source in the [`harlequin.options`](https://github.com/tconbeer/harlequin/blob/main/src/harlequin/options.py) module, or the [DuckDB implementation](https://github.com/tconbeer/harlequin/blob/main/src/harlequin_duckdb/copy_formats.py).

## Packaging and Distributing Adapters

You can use the [harlequin-adapter-template](https://github.com/tconbeer/harlequin-adapter-template) repo as a starting point for your adapter. It uses `MyAdapter` as a placeholder class name (along with `MyConnection` and `MyCursor`) and creates a plugin registered as `my-adapter`.

Your adapter should require a compatible version of Harlequin as a dependency. We suggest using `harlequin = "^1.4"` as the dependency specification.

### Making Your Adapter Discoverable as a Plug-in

Your adapter must register an [entry point](https://packaging.python.org/en/latest/specifications/entry-points/) in the `harlequin.adapters` group, using the packaging software you use to build your project. We recommned Poetry. If you use Poetry, you can define the entry point in your `pyproject.toml` file:

```toml
[tool.poetry.plugins."harlequin.adapter"]
my-adapter = "my_package_name:MyAdapter"
```

In this example, `my-adapter` is the _name_ of the plugin. Harlequin users will select this adapter with `--adapter my-adapter`. `my_package_name` is the import name of your package (which may or may not be the same name as your _distribution_ or PyPI name). Finally, `MyAdapter` is the subclass of `HarlequinAdapter`, which is available in the `my_package_name` namespace, probably because it was imported into the top-level `__init__.py` file.

The template repo includes a test to ensure that your adapter is discoverable as a plug-in.

### Adding Your Adapter a Harlequin Extra

If you would like your adapter installable as a Harlequin extra (e.g., `pip install harlequin[my-adapter]`), open a PR against [`tconbeer/harlequin`](https://github.com/tconbeer/harlequin) that adds the extra **and** the optional dependency.

```toml
[tool.poetry.dependencies]
...
my-adapter-pypi-distribution = &lbrace; version = "^0.1", optional = true &rbrace;
...

[tool.poetry.extras]
...
my-adapter = ["my-adapter-pypi-distribution"]

```

## Testing Adapters

The [harlequin-adapter-template](https://github.com/tconbeer/harlequin-adapter-template) repo provides a small set of tests that cover the basic functionality of an adapter. You will need to replace references to `MyAdapter`, `MyConnection`, and `MyCursor` with imports of your actual classes. Then you can run the tests with `pytest`. You are encouraged to add tests that are specific to the functionality of your adapter.
