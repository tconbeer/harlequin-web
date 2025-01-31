---
title: Creating a Keymap
menuOrder: 26
---

<script>
    import Key from "$lib/components/key.svelte"
    import Tip from "$lib/components/tip.svelte"
    import keys_app from "$lib/assets/docs/keys-app.png"
    import keys_app_edit from "$lib/assets/docs/keys-app-edit.png"
</script>

Keymaps can be defined in Harlequin [config files](../config-file), under the `keymaps` key. You can create these keymaps manually in a text editor, or by using the [Harlequin Keys App](#keys-app).

## What is a Keymap?

In a config file, a keymap is an ["array of tables"](https://toml.io/en/v1.0.0#array-of-tables), where each table defines a key binding. A simple keymap looks like this:

```toml
[[keymaps.more_arrows]]
keys="w"
action="results_viewer.cursor_up"
key_display="⬆/w"

[[keymaps.more_arrows]]
keys="a"
action="results_viewer.cursor_left"
key_display="⬅/a"

[[keymaps.more_arrows]]
keys="s,j"
action="results_viewer.cursor_down"
key_display="⬇/s/j"

[[keymaps.more_arrows]]
keys="d"
action="results_viewer.cursor_right"
key_display="➡/d"
```

This keymap is named `more_arrows`, and it maps the keys <Key>w</Key>, <Key>a</Key>, <Key>s</Key>, <Key>j</Key>, and <Key>d</Key> to actions that move the cursor in the Results Viewer. The arrow keys are already mapped to these actions in the default keymap, so this keymap is a good example of [extending the default keymap](usage#extending-a-keymap).

The items in each table are as follows:

### Keys

The `keys` item is a string that must be a comma-separated list of Textual virtual key names. These are usually intuitive names like <Key>enter</Key> and <Key>ctrl+f</Key>, but depending on your terminal and shell, many keypresses will be aliased to different key names by the time they reach Harlequin. The best way to ensure the correct key name is to use the [Keys App](#keys-app).

### Action

The `action` item is a string that must be equal to the name of a Harlequin Action. A full list of action names can be found in the Harlequin [source code](https://github.com/tconbeer/harlequin/blob/main/src/harlequin/actions.py). All actions are also listed (with aliased/formatted names) in the [Keys App](#keys-app).

Actions are context-specific, so they are already scoped to either the entire app or a specific widget. Those that are scoped to a widget have names that take the form `<widget_name>.<action_name>`.

### Key Display

Harlequin's Footer can display currently-active (in-scope) key bindings. Many bindings are hidden by default. By including a `key_display` item in each table, Harlequin will show the binding, optionally with a custom symbol.

## Keys App

Harlequin ships with an app that makes it easy to create your own custom keymap. To start the app, start harlequin with the `--keys` option:

```bash
harlequin --keys
```

The app will load the currently-active config (from discovered TOML files, in the same manner as Harlequin) and show a list of all configured key bindings (using the default profile and its specified keymaps). You can load the Keys App with options that specify a config file, profile, and/or keymap name if you would like, using command-line options:

```bash
harlequin --config-path ~/my-config.toml --profile Foo --keys
```

<Tip>The <code class="text-xs">--config-path</code>, <code class="text-xs">--profile</code>, <code class="text-xs">--keymap-name</code>, and <code class="text-xs">--theme</code> options must be declared <span class="font-bold">before</span> the <code class="text-xs">--keys</code> option for this to work.</Tip>

<div class="flex flex-wrap justify-center py-2">
    <figure>
        <img src={keys_app} alt="Screenshot of the main screen of the Keys App."  class="h-auto w-full max-h-80">
        <figcaption class="text-center text-sm text-purple font-bold">The main screen of the Keys App.</figcaption>
    </figure>
</div>

In the app, you can use the arrow keys to scroll up and down the list of bindings, then press <Key>enter</Key> to edit a binding. You can replace an existing key, or add or remove keys that are bound to each action by using the buttons in the Edit modal.

<div class="flex flex-wrap justify-center py-2">
    <figure>
        <img src={keys_app_edit} alt="Screenshot of the Edit modal of the Keys App."  class="h-auto w-full max-h-80">
        <figcaption class="text-center text-sm text-purple font-bold">The Edit modal of the Keys App.</figcaption>
    </figure>
</div>

After editing bindings, press <Key>ctrl+q</Key> to quit the Keys App. You will be prompted for a config file location and a keymap name. Remember this name -- you will need it in the next step, when configuring Harlequin to use your keymap. If you select "Save + Quit," Harlequin will write the full keymap to the location you specify.
