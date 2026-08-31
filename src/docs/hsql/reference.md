---
title: "Reference: hsql CLI"
description: Every hsql option, argument, format and exit code, generated from hsql itself and published with the release it came from.
---

<script>
    import HsqlReference from "$lib/components/hsql_reference.svelte"
</script>

This page is generated from `hsql --spec` with no adapters loaded, in
[Harlequin's repository](https://github.com/tconbeer/harlequin), and published
with the release it describes.

It does not cover any adapter's connection options. Four commands answer that,
and none of them connects to a database:

```bash
hsql --help
hsql --help -a postgres
hsql --spec
hsql --info
```

`--help` is this list for a person, `--help -a NAME` adds one adapter's options
to it, and `--spec` is the whole surface as JSON. `--info` describes the
installation: versions, config files, the active profile, and what each adapter
supports.

What the options are _for_ is on the other pages under [The hsql
CLI](/docs/hsql).

<HsqlReference />
