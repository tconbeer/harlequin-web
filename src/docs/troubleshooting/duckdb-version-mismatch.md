---
title: DuckDB Version Mismatch
menuOrder: 991
---

<script>
    import Note from "$lib/components/note.svelte"
</script>

Harlequin depends on DuckDB, and installing it in an isolated environment (e.g., using `pipx` or in a fresh virtual environment) will cause it to install DuckDB. If you have DuckDB installed elsewhere (e.g., if you already installed DuckDB with `pipx` or Homebrew), you may want to pin the version of DuckDB that Harlequin uses. For example, attempting to open a DuckDB database file with different versions of DuckDB will result in an error that looks like this:

<p class="text-xs font-mono rounded border-black border py-1 px-1">
IO Error: Trying to read a database file with version number 64, but we can
only read version 51.
The database file was created with an newer version of DuckDB.

The storage of DuckDB is not yet stable; newer versions of DuckDB cannot
read old database files and vice versa.
The storage will be stabilized when version 1.0 releases.

For now, we recommend that you load the database file in a supported version
of DuckDB, and use the EXPORT DATABASE command followed by IMPORT DATABASE
on the current version of DuckDB.

See the storage page for more information:
https://duckdb.org/internals/storage

</p>

### Determining the Version of the DuckDB CLI on your Path

First, determine what version of DuckDB you are running outside of Harlequin, and how it was installed. You can find the path to the executable with `which duckdb` on Unix systems, or `get-command duckdb` in Windows Powershell. This path should give you a hint about how it was installed; you could also try `pipx list` or `brew list` to see if DuckDB was installed by either of those tools.

Next, run `duckdb --version`, which should display the version number and commit SHA, like `v0.9.0 0d84ccf478`.

Alternatively, the [storage page](https://duckdb.org/internals/storage) linked to in the error message provides a mapping of storage versions to DuckDB versions (e.g., we can see that storage version 64 maps to DuckDB 0.9.0, and 51 maps to DuckDB 0.8.0).

### Determining the Version of DuckDB Used by Harlequin

Open Harlequin, then in the query editor, type or paste `select version()`. In the Results Viewer, the version number should be displayed.

### Changing the Version of DuckDB Used by Harlequin

<Note>Harlequin requires DuckDB >= 0.8.0 due to changes in the Python API in that version.</Note>

You can add an explicit pin to a DuckDB version alongside Harlequin's installation. The following example assumes you would like to pin the version to `1.1.3`.

```bash
uv tool install harlequin --with 'duckdb==1.1.3'
```
