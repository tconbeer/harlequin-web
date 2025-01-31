---
title: "Adapter: NebulaGraph"
menuOrder: 170
---

The NebulaGraph adapter was contributed by community member Wey Gu. You can view the source for the adapter on [GitHub](https://github.com/wey-gu/harlequin-nebulagraph).

## Installation

`harlequin-nebulagraph` depends on `harlequin`, so installing `harlequin-nebulagraph` will also install Harlequin.

### Using pip

To install this adapter into an activated virtual environment:

```bash
pip install harlequin-nebulagraph
```

### Using poetry

```bash
poetry add harlequin-nebulagraph
```

### Using pipx

If you do not already have Harlequin installed:

```bash
pipx install harlequin[nebulagraph]
```

If you would like to add the nebulagraph adapter to an existing Harlequin installation:

```bash
pipx inject harlequin harlequin-nebulagraph
```

## Usage and Configuration

You can open Harlequin with the NebulaGraph adapter by selecting it with the `-a` option and passing connection parameters as CLI options:

```bash
harlequin -a nebulagraph -h 127.0.0.1 -p 9669 -u root --password password
```

## Demo

<video autoplay loop muted playsinline controls class="mt-6">
    Your browser does not support .mp4
    <source src="https://github.com/wey-gu/harlequin-nebulagraph/assets/1651790/b27c0ea2-4080-4313-9607-285e477d1898" type="video/mp4" />
</video>

Many more options are available; to see the full list, run:

```bash
harlequin --help
```
