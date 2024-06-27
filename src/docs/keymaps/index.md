---
title: Customizing Key Bindings
menuOrder: 7
---

## About Key Bindings and Keymaps

A **key binding** associates a key press, within a context, to an action.

A **keymap** is a named set of key bindings.

Harlequin gets all of its key bindings from the keymaps it discovers and loads when it starts. These keymaps are loaded either from plug-ins (installed Python packages) or TOML config files. Harlequin ships with a single keymap plug-in that defines all of its default bindings. That default keymap is called `vscode`, since many of its bindings mimic those in the popular text editor.

## Changing Key Bindings

Changing key bindings in Harlequin is a two-step process:

1. Install a keymap plug-in or [create](config) a new keymap in a config file.
2. [Select](usage) the keymap when starting Harlequin.