---
title: "Adapter: Wherobots"
menuOrder: 150
---

*This documentation is Copyright Wherobots, reproduced here under an [Apache 2.0 License](https://github.com/wherobots/harlequin-wherobots/blob/main/LICENSE). See the [repository](https://github.com/wherobots/harlequin-wherobots) for the most up-to-date documentation.*

This is an adapter for Wherobots DB, using
the Wherobots Spatial SQL API and its
[wherobots-python-dbapi-driver](https://github.com/wherobots/wherobots-python-dbapi-driver).

## Installation

```
$ pip install git+https://github.com/wherobots/harlequin-wherobots
```

## Usage

Procure an API key from Wherobots, and start Harlequin with the
required parameters:

```
$ harlequin -a wherobots --api-key <key>
```

Alternatively, you can use your session token:

```
$ harlequin -a wherobots --token <token>
```

The Harlequin adapter for Wherobots will automatically start a Wherobots
SQL session with the default runtime (Sedona, 4 executors) in the
default Wherobots public compute region (AWS `us-west-2`). You can
override those defaults with the `--runtime` and `--region` options,
respectively:

```
$ harlequin -a wherobots --api-key <key> --runtime NEW_YORK --region aws-us-west-2
```

## Advanced options

If your SQL session is already provisioned and running, you can force
the driver to directly connect to it via its WebSocket URL:

```
$ harlequin -a wherobots --api-key <key> --ws-url <session-url>
```

You can also specify the base hostname of the Wherobots stack to
interact with. By default, the driver connects to `cloud.wherobots.com`,
the official public Wherobots service. You may want or need to use
`govcloud.wherobots.com`, `staging.wherobots.com`, or another local
target during development.

```
$ harlequin -a wherobots --api-key <key> staging.wherobots.com
```
