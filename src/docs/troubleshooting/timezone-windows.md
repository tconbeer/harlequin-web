---
title: Windows Timezone Database
menuOrder: 980
---

<script>
    import Warning from "$lib/components/warning.svelte"
</script>

Unlike other operating systems, Windows does not ship with an IANA-format timezone database.

Harlequin uses the Apache Arrow data format to power its results viewer, and Arrow needs a timezone database to operate on "timestamp with timezone" (`timestamptz`) data types, even to cast them to strings! See the [Arrow Docs](https://arrow.apache.org/docs/python/install.html#tzdata-on-windows) for more information.

At startup on Windows, Harlequin tries to find an IANA timezone database. If it cannot, it will attempt to download one to a Harlequin-specific location. If the download fails, Harlequin will print an error message and exit.

To prevent Harlequin from downloading the timezone database, launch Harlequin with the `--no-download-tzdata` option:

```bash
harlequin --no-download-tzdata
```

<Warning>
When using Harlequin with this option, attempting to load a <code>timestamptz</code> column into the Results Viewer may cause Harlequin to crash.
</Warning>
