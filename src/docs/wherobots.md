---
title: "Adapter: Wherobots"
menuOrder: 150
---
<script>
    import Tip from "$lib/components/tip.svelte"
    </script>

_This documentation is Copyright Wherobots, reproduced here under an [Apache 2.0 License](https://github.com/wherobots/harlequin-wherobots/blob/main/LICENSE). See the [repository](https://github.com/wherobots/harlequin-wherobots) for the most up-to-date documentation._

This repository provides the Harlequin adapter for WherobotsDB, using
the Wherobots Spatial SQL API and its
[wherobots-python-dbapi-driver](https://github.com/wherobots/wherobots-python-dbapi-driver).

## Installation

You must install the `harlequin-wherobots` package into the same environment as `harlequin`. The best and easiest way to do this is to use `uv` to install Harlequin with the additional package:

```bash
uv tool install harlequin --with harlequin-wherobots
```

## Usage

Procure an API key from Wherobots, and start Harlequin with the
required parameters:

```bash
harlequin -a wherobots --api-key <key>
```

Alternatively, you can use your session token:

```bash
harlequin -a wherobots --token <token>
```

The Harlequin adapter for Wherobots will automatically start a Wherobots
SQL session with the default runtime (Tiny, 4 executors) in the
default Wherobots public compute region (AWS `us-west-2`). You can
override those defaults with the `--runtime` and `--region` options,
respectively:

```bash
harlequin -a wherobots --api-key <key> --runtime MEDIUM --region AWS_US_WEST_2
```

<Tip>
Community Edition users of Wherobots Cloud are restricted to the "Tiny" runtime size. See Wherobots
<a class="underline hover:decoration-green hover:decoration-4 hover:underline-offset-4" href="https://www.wherobots.com/pricing" target="_blank">Pricing</a> for more information.
</Tip>

## Advanced options

If your SQL session is already provisioned and running, you can force
the driver to directly connect to it via its WebSocket URL (without
protocol version):

```bash
harlequin -a wherobots --api-key <key> --ws-url <session-url>
```

You can also specify the base hostname of the Wherobots stack to
interact with as the first positional parameter. By default, the driver
connects to `cloud.wherobots.com`, the official public Wherobots
service.

```bash
harlequin -a wherobots --api-key <key> [host]
```
