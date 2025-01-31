---
title: Selecting Keymaps
menuOrder: 27
---

After you have [created a keymap](config) or installed a keymap plug-in, you need to configure Harlequin to use that keymap.

## Replacing the Default Keymap

If you create a keymap with the [Keys App](config#keys-app), or if you install a plug-in that defines a complete keymap, then you should specify **only** that keymap when you start Harlequin. You can select a keymap using the `--keymap-name` CLI option (or in your config file, see below):

```bash
harlequin --keymap-name "my-complete-keymap"
```

## Extending a Keymap

Alternatively, you can create a partial keymap that only specifies a subset of bindings. Harlequin can load multiple keymaps and merge them by unioning the bindings found in all the configured keymaps (this may cause some conflicts and undesired behavior). To extend a keymap, specify multiple keymaps by repeating the command-line option. For example, to extend the default `vscode` keymap with the `more_arrows` keymap example from the previous page:

```bash
harlequin --keymap-name "vscode" --keymap-name "more_arrows"
```

## Using Config Files and Profiles

You can also use a Profile to define the keymaps loaded by Harlequin, instead of repeating the CLI option every time. See [config file](../config-file) for more information. An example of a config file with two profiles, equivalent to the options above:

```toml
default_profile = "my-first-profile"

[profiles.my-first-profile]
keymap_name = ["my-complete-keymap"]

[profiles.my-second-profile]
keymap_name = ["vscode", "more_arrows"]
```
