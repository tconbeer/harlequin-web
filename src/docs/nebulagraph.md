---
title: "Adapter: NebulaGraph"
menuOrder: 170
---

The NebulaGraph adapter was contributed by community member Wey Gu.

## Installation

You must install the `harlequin-nebulagraph` package into the same environment as `harlequin`. The best and easiest way to do this is to use `uv` to install Harlequin with the additional package:

```bash
uv tool install harlequin --with harlequin-nebulagraph
```

## Usage and Configuration

Run Harlequin with the `-a nebulagraph` option and pass connection parameters as CLI options:

```bash
harlequin -a nebulagraph -h 127.0.0.1 -p 9669 -u root --password password
```

## Demo

<video autoplay loop muted playsinline controls class="my-4">
    Your browser does not support .mp4
    <source src="https://github.com/wey-gu/harlequin-nebulagraph/assets/1651790/b27c0ea2-4080-4313-9607-285e477d1898" type="video/mp4" />
</video>

Many more options are available; to see the full list, run:

```bash
harlequin --help
```
