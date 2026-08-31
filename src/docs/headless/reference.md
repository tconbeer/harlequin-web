---
title: "Reference: hsql CLI"
description: Every hsql option, argument, format and exit code, generated from hsql itself and published with the release it came from.
---

<script>
    import HsqlReference from "$lib/components/hsql_reference.svelte"
    import Tip from "$lib/components/tip.svelte"
</script>

This page is generated. It is rendered from `hsql --spec` with no adapters
loaded, in [Harlequin's own repository](https://github.com/tconbeer/harlequin),
and published here with the release it describes — so it cannot drift from the
program, and nothing on this site hand-writes an option name.

What it does not cover is any adapter's own connection options, which are the
adapter's to declare:

```bash
hsql --help
hsql --help -a postgres
hsql --spec
hsql --info
```

`--help` is the same list for a person, `--help -a NAME` adds one adapter's
options to it, and `--spec` is the whole surface — hsql's and every installed
adapter's — as JSON. `--info` describes the installation instead: versions, the
config files hsql found, the profile that would be active, and what each adapter
declares it supports. None of the four connects to a database.

<Tip>

The prose pages under [Headless & Agents](/docs/headless) explain what these
options are _for_: [formats and layouts](/docs/headless/formats),
[the catalog](/docs/headless/catalog),
[config files and profiles](/docs/headless/config),
[exit codes](/docs/headless/exit-codes) and
[the safety bounds](/docs/headless/safety).

</Tip>

<HsqlReference />
