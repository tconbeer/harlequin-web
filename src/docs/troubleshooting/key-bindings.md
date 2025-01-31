---
title: Key Bindings
menuOrder: 910
---

<script>
    import Key from "$lib/components/key.svelte"
    import Tip from "$lib/components/tip.svelte"
    import Link from "$lib/components/link.svelte"
</script>

Harlequin can only react to key presses that are sent to it from the Terminal it is running in. Some common key presses, like <Key>ctrl+enter</Key>, aren't forwarded correctly by some terminals, or may be aliased to a different key or even a different sort of event.

If you don't want to [upgrade your terminal](terminal-recommendations), you can use the following aliases, which should be supported everywhere (if not, [open an issue](https://github.com/tconbeer/harlequin/issues)):

- Run query: use <Key>ctrl+j</Key>, not <Key>ctrl+enter</Key>.
<!-- prettier-ignore -->
- Comment line: use <Key>ctrl+\_</Key> (underscore), not <Key>ctrl+/</Key>.
- On a Mac: For all bindings, use <Key>^ Control</Key>, not <Key>⌘ Command</Key>.
  - On MacOs >= 15.0.0 , the key binding <Key>^+enter</Key> is mapped to "Show contextual menu" by default. This interferes with the "Run Query" key binding of Harlequin. Instead of setting up alternative key bindings, you can disable this shortcut in MacOS by navigating to: System Settings -> Keyboard -> Keyboard Shortcuts... -> Keyboard -> turn "Show contextual menu" off.

<Tip>
<Link href="copying-and-pasting">See here</Link> for help with copy and paste.
</Tip>

Finally, Harlequin's footer, which lists some of the currently-active key bindings, is clickable. If a binding isn't working, you can click it in the footer to take the same action.

### Enabling Key Bindings in VS Code Terminal

VS Code intercepts a large number of key presses before they make it to the terminal, even when the terminal is focused. This includes <Key>ctrl+j</Key> (which hides or shows the VS Code terminal!). Fortunately, you can change this behavior in the VS Code settings. If you use a `settings.json` file, you can add this snippet:

```json
&lbrace;
    "terminal.integrated.allowChords": false,
    "terminal.integrated.sendKeybindingsToShell": true,
&rbrace;
```

Otherwise, you can press <Key>F1</Key> to open the command palette, then type and select "Terminal: Configure Terminal Settings". Then make the following changes:

1. Uncheck the option "Terminal > Integrated: Allow Chords"
2. Check the option "Terminal > Integrated: Send Keybindings to Shell" (you may have to scroll down nearly all the way).
