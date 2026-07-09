---
title: "Adapter: QuestDB"
menuOrder: 190
---

<script>
    import Tip from "$lib/components/tip.svelte"
    import Note from "$lib/components/note.svelte"
    import Link from "$lib/components/link.svelte"
</script>

The QuestDB adapter was contributed by community member Rik Huygen.

## Installation

You must install the `harlequin-questdb` package into the same environment as `harlequin`. The best and easiest way to do this is to use `uv` to install Harlequin with the `questdb` extra:

```bash
uv tool install 'harlequin[questdb]'
```

## Upgrading

To upgrade Harlequin, the adapter, or both, run:

```bash
uv tool upgrade harlequin --with harlequin-questdb
```

This upgrades `harlequin` to the latest compatible version and refreshes `harlequin-questdb` at the same time. Run the same command regardless of which package was bumped.

## Usage

Connect to a local QuestDB instance using the defaults (host `localhost`, port `8812`, user `admin`, password `quest`):

```bash
harlequin -a questdb
```

Pass individual connection options to override the defaults:

```bash
harlequin -a questdb --host myserver --port 8812 -u myuser --password mypassword
```

Or pass a libpq-style connection string as a positional argument:

```bash
harlequin -a questdb "host=myserver port=8812 user=myuser password=mypassword dbname=qdb"
```

## Connection Options

| Option | Short | Default | Description |
|---|---|---|---|
| `--host` | `-h` | `localhost` | QuestDB host name or IP address |
| `--port` | `-p` | `8812` | PostgreSQL wire protocol port |
| `--username` | `-u` | `admin` | QuestDB username |
| `--password` | | `quest` | QuestDB password |


<Note>QuestDB only supports a single database named `qdb`. The `dbname` field in a connection string must be `qdb` (or omitted).</Note>
