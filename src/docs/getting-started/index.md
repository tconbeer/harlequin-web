---
title: Installing Harlequin
topic: Getting Started
menuOrder: -100
---

<script>
    import Key from "$lib/components/key.svelte"
</script>

## Installing Harlequin

Harlequin is a Python program, and there are many ways to install and run it. We strongly recommend using [uv](https://docs.astral.sh/uv):

1. [Install uv](https://docs.astral.sh/uv/getting-started/installation/#standalone-installer). From a POSIX shell, run:

   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```

   Or using Windows Powershell:

   ```powershell
   powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
   ```

2. Install Harlequin as a tool (in an isolated environment) using `uv`:

   ```bash
   uv tool install harlequin
   ```

Alternatively, if you know what you're doing, after installing Python 3.9 or above, install Harlequin using `pip`, `pipx`, `poetry`, or any other program that can install Python packages from PyPI:

```bash
pip install harlequin
```

## Installing Database Adapters

Harlequin can connect to dozens of databases using adapter plug-ins. Adapters are distributed as their own Python packages that need to be installed into the same environment as Harlequin.

For a list of known adapters provided either by the Harlequin maintainers or the broader community, see the [adapters](adapters) page.

The adapter docs also include installation instructions. Some adapters can be installed as Harlequin extras, like `postgres`. If you used `uv` to install Harlequin:

```bash
uv tool install harlequin[postgres]
```

You can install multiple extras:

```bash
uv tool install harlequin[postgres,mysql,s3]
```

Some adapters are not available as extras, and have to be installed manually. You may also wish to do this to control the version of the adapter that Harlequin uses. You can add adapters to your installation using uv's `--with` option:

```bash
uv tool install harlequin --with harlequin-odbc
```
