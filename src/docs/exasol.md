---
title: "Adapter: Exasol"
menuOrder: 180
---

The Exasol adapter was contributed by community member Nicola Coretti.

_This documentation is Copyright Exasol, reproduced and adapted here under an [MIT License](https://github.com/Nicoretti/harlequin-exasol/blob/main/LICENSE). See the [repository](https://github.com/Nicoretti/harlequin-exasol) for the most up-to-date documentation._


<script>
    import Warning from "$lib/components/warning.svelte"
    import Note from "$lib/components/note.svelte"
</script>

<Warning>
The current state of this project is a spike—an initial evaluation of what is possible and how much effort specific tasks will require. It should only be used for evaluating Exasol usage via Harlequin.

Below, you will find information if you are interested in trying it out and getting an idea of it. While issues reported beyond the mentioned limitations are welcome for tracking purposes, addressing these issues is unlikely at any point. However, having a list of issues may be helpful to other evaluators.
</Warning>

## 🚀 Features

* Basic Catalog
* Basic Query Completion
* Basic Query Support, including DDL

## Installation

You must install the `harlequin-exasol` package into the same environment as `harlequin`. The best and easiest way to do this is to use `uv` to install Harlequin with the additional package:

```bash
uv tool install harlequin --with 'harlequin-exasol'
```

## Using Harlequin with Exasol

To connect to a Postgres database, run Harlequin with the `-a exasol` option and pass connection parameters as options:

```bash
harlequin -a exasol --schema 'foo' --host '8.9.10.1' --port 8563 ...
```

For connecting to a standard [Exasol Docker DB](https://hub.docker.com/r/exasol/docker-db/), most defaults should work just fine:

```bash
harlequin -a exasol --disable-certificate-validation
```

## 💥 Known Issues

* Queries cannot be sent while metadata is loading. (@exaSR)
* Only empty error windows will be shown. (Multiple Reports)
