---
title: Installing Harlequin
topic: Getting Started
menuOrder: -100
---

<script>
    import Key from "$lib/components/key.svelte"
    import Tip from "$lib/components/tip.svelte"
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

2. Install Harlequin as a tool using `uv`:

   ```bash
   uv tool install --python 3.13 harlequin
   ```

   This command will install Harlequin into an isolated environment and add it to your PATH so you can easily run the executable.

   <Tip>
   Harlequin currently provides the best user experience in Python 3.10-3.13. Adapter support may not be available on 3.14.
   Harlequin can be installed in Python 3.14, but requires an explicit opt-in to use prerelease packages:
   <pre><code class="text-xs">$ uv tool install --python 3.14 <span class="font-bold">--prerelease=allow</span> harlequin</code></pre>
   </Tip>

### Other Installation Methods

Alternatively, if you know what you're doing, after installing Python 3.10-3.13, install Harlequin using `pip`, `pipx`, `poetry`, or any other program that can install Python packages from PyPI:

```bash
python -m pip install harlequin
```

There is also a [Homebrew formula](https://formulae.brew.sh/formula/harlequin) for Harlequin, although this is maintained by the community and is not as rigorously tested as the Python installations. Note that the formula includes several Harlequin adapter packages (Postgres, MySQL, and ODBC) and their dependencies, which is convenient but increases the application size.

```bash
brew install harlequin
```

Finally, there is a [Nix Package](https://search.nixos.org/packages?channel=25.05&show=harlequin&query=harlequin), which carries the same caveats as Homebrew.

## Installing Database Adapters

Harlequin can connect to dozens of databases using adapter plug-ins. Adapters are distributed as their own Python packages that need to be installed into the same environment as Harlequin.

For a list of known adapters provided either by the Harlequin maintainers or the broader community, see the [adapters](../adapters) page.

The adapter docs also include installation instructions. Some adapters can be installed as Harlequin extras, like `postgres`. If you used `uv` to install Harlequin:

```bash
uv tool install --python 3.13 'harlequin[postgres]'
```

You can install multiple extras:

```bash
uv tool install --python 3.13 'harlequin[postgres,mysql,s3]'
```

<Tip> Depending on your shell, you may or may not need to place single or double quotes around the package name with extras: <pre><code class="text-xs">% uv tool install <span class="font-bold">'harlequin[postgres,mysql,s3]'</span></code></pre></Tip>

Some adapters are not available as extras, and have to be installed manually. You may also wish to do this to control the version of the adapter that Harlequin uses. You can add adapters to your installation using uv's `--with` option:

```bash
uv tool install --python 3.13 harlequin --with harlequin-odbc
```
