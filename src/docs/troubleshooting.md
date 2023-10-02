---
title: Troubleshooting
menuOrder: 99
---

<script>
    import solarized_256 from "$lib/assets/docs/solarized-dark-256color.png"
    import solarized from "$lib/assets/themes/solarized-dark.svg"
    import Key from "$lib/components/key.svelte"
</script>

Sorry to see you here. Terminals can be finicky. Please see below for solutions to common problems.

## Contents

1. [Key Bindings](#key-bindings)
1. [Copy-Paste](#copying-and-pasting)
1. [Colors](#colors)
1. [Fonts](#fonts)
1. [DuckDB Version Mismatch](#duckdb-version-mismatch)

## Key Bindings

Harlequin can only react to key presses that are sent to it from the Terminal it is running in. Some common key presses, like <Key>ctrl+enter</Key>, aren't forwarded correctly by some terminals, or may be aliased to a different key or even a different sort of event.

If you don't want to [upgrade your terminal](#terminal-recommendations), you can use the following aliases, which should be supported everywhere (if not, [open an issue](https://github.com/tconbeer/harlequin/issues)):

- Run query: use <Key>ctrl+j</Key>, not <Key>ctrl+enter</Key>.
- Comment line: use <Key>ctrl+\_</Key> (underscore), not <Key>ctrl+/</Key>.
- On a Mac: For all bindings, use <Key>^ Control</Key>, not <Key>⌘ Command</Key>.

[See here](#copying-and-pasting) for copy and paste.

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

## Copying and Pasting

**Note: Currently copying and pasting is only supported by the query editor, not the other widgets.**

Harlequin's query editor supports cut, copy, and paste. However, this is more complex than it seems. If these features are not working for you, there could be a number of root causes. This section walks through how copy-paste works in Harlequin, and offers some solutions for common problems.

### Internal Copy and Paste

Harlequin's query editor implements its own internal clipboard, so copying and pasting within the query editor should always work. To test the internal clipboard, select text in the query editor and press <Key>ctrl+c</Key> to copy it. Paste it with <Key>ctrl+u</Key> (`u`, not `v` for this step!). If that doesn't work, Harlequin isn't receiving those key presses from your terminal. Please [open an issue](https://github.com/tconbeer/harlequin/issues).

### Copying outside Harlequin, Pasting inside Harlequin

There are two mechanisms for Harlequin to receive clipboard data when you initiate a paste.

1.  Harlequin receives a key press that it interprets as a paste command. This happens when you press <Key>ctrl+u</Key>, and depending on your terminal, may or may not happen when you press <Key>ctrl+v</Key>. When Harlequin interprets a key press as a paste command, it attempts to access the system clipboard and paste its contents. If it cannot access the system clipboard, Harlequin will paste the contents of its internal clipboard. To determine if Harlequin can access the system clipboard:

    - Copy some text outside of Harlequin.
    - Focus on the Harlequin query editor, then press <Key>ctrl+u</Key> (`u`, not `v` for this step!).
    - If Harlequin does not paste anything, or if it pastes something different from what you just copied, Harlequin cannot access the system clipboard. You can work around this by pasting using your terminal's built-in paste functionality, or by fixing its access to the system clipboard (keep reading).

2.  Harlequin receives a native `Paste` message from the terminal. To trigger a `Paste` message, you want to use the same keys that you would to paste into your shell. This might be <Key>ctrl+v</Key>, <Key>shift+insert</Key>, or a right click of your mouse. When Harlequin receives a `Paste` message, it will insert the contents of that message into the query editor. Since this doesn't rely on the clipboard, this should work on nearly any terminal, whether Harlequin and the terminal share a host or not. Many terminals allow you to configure the key or mouse bindings for `Paste`.

If Harlequin cannot access the system clipboard, there may be a couple of causes:

1.  If Harlequin is installed on Linux, you may be missing a clipboard library. Try `sudo apt get xclip` or `sudo apt get xsel` to install a library that will allow Harlequin to access the system clipboard.
2.  Harlequin's host (the operating system where Harlequin is running) may have its clipboard disabled. This is common in GitHub Codespaces, CI runners, and other servers that don't typically support user input or a display. If you control the server, you can install or start an X Server (like X11) to enable the clipboard. As a workaround, try triggering a native `Paste` event in your terminal instead.
3.  If your terminal is attaching to a remote host to run Harlequin, e.g., via SSH, the terminal or SSH client may or may not support clipboard "redirection" (sharing the clipboard between the machines). In this case, Harlequin may be able to access its host's clipboard, but that clipboard won't be the same as the one you use for everything else. As a workaround, try triggering a native `Paste` event in your terminal instead (sadly this might also be disabled).

If all is lost, you can open a text file with Harlequin with <Key>ctrl+o</Key> or by clicking "Open Query" in the footer.

### Copying inside Harlequin, Pasting outside Harlequin

If you've made it this far, I'm so sorry. I hope you've learned something today.

The same dynamics from above apply, but we don't have the `Paste` event to move the data for us. The workarounds are:

1.  You can try to use your terminal's native copy functionality. This is unlikely to do what you want, since it'll copy Harlequin's UI (borders, whitespace, etc), alongside your query. But if you want to try:

    - In your terminal's settings, enable "Copy on Selection." You can test this in your shell -- if you select (highlight) text with your mouse, it should get copied to your clipboard.
    - In Harlequin, hold <Key>Shift</Key> while using your mouse to select the text you want to copy (on most terminals, this triggers selection when the terminal is in "app mode"). You'll know you're doing this right if the highlight color is different from what you normally see when highlighting text in Harlequin. Your selection should get copied to the clipboard (whitespace, `|`'s, and all).

2.  You can save your query to a file and open it in another program. Press <Key>ctrl+s</Key> or click "Save Query" in the footer.

## Appearance

Harlequin should look great in your terminal. If it doesn't, it may be because we depend on your terminal and shell for rendering, and those may require some configuration on your machine.

### Colors

Modern terminal emulators can display millions of colors, in a scheme called "truecolor." Older terminals could only display 256 colors, or even as few as 8.

Some themes look terrible with only 256 colors. For example, `solarized-dark`:

<div class="flex flex-wrap justify-center gap-4 py-2">
    <figure>
        <img src={solarized_256} alt="Screenshot of the Solarized Dark in 256 colors"  class="h-auto w-64 sm:w-auto sm:h-48">
        <figcaption class="text-center text-sm text-purple font-bold">Solarized Dark in 256 Colors</figcaption>
    </figure>
    <figure>
        <img src={solarized} alt="Screenshot of the Solarized Dark in truecolor"  class="h-auto w-64 sm:w-auto sm:h-48">
        <figcaption class="text-center text-sm text-purple font-bold">Solarized Dark in Truecolor</figcaption>
    </figure>
</div>

For Harlequin to display in truecolor, both the terminal and shell need to support it. If you are seeing only 256 colors, there could be a few causes:

1. Your terminal and shell may support truecolor, but the terminal may be rendering your shell in 256 colors for backwards-compatibility reasons (e.g., bash in WSL2 on Windows Terminal). Try setting the environment variable `COLORTERM` to `truecolor` to instruct your terminal to render truecolor. You can test this by launching Harlequin with `COLORTERM=truecolor harlequin`, and if that works, you should set the environment variable more durably (Google instructions for your OS). As an example (bash in WSL2 on Windows Terminal), I added this line to my `.bashrc` file: `export COLORTERM=truecolor`.
1. Your terminal may support truecolor, but your shell may not. Some implementations of some shells don't support truecolor, even if the terminal they are running in does. You can try a different shell, like [fish](https://fishshell.com/), [zsh](https://www.zsh.org/), or [PowerShell](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell?view=powershell-7.3).
1. Your terminal may only support 256 colors. You should [upgrade your terminal](#terminal-recommendations).

If none of those work, some themes still look good in 256 colors. We recommend `monokai` (the default), `zenburn`, `github-dark`, `fruity`, `native` and `one-dark`.

### Fonts

Modern terminals can display different fonts. Harlequin looks great in a number of fixed-width fonts, but may have odd artifacts in others. We especially like [Nerd Fonts](https://www.nerdfonts.com/), which contain ligatures for symbols common in programming. Popular options include FiraCode, Meslo, Cascadia, and JetBrainsMono.

To use a different font with Harlequin, download and install the font, and then configure your terminal to use that font.

**Note for Mac Terminal.app Users:**

Only some fonts render right with the default Terminal app. You may need to adjust your line spacing. [See here](https://textual.textualize.io/FAQ/#why-doesnt-textual-look-good-on-macos) for instructions.

**Note for WSL2 and Windows Terminal users:**

Windows Terminal runs in Windows and attaches your Linux shell over the WSL network. You need to install your font in **Windows** for this to work.

## Terminal Recommendations

If you are using the default Mac Terminal or Windows Command Prompt, you may want to switch to a more modern terminal. The following terminals are free and come highly recommended:

- Windows (native or WSL2): [Windows Terminal](https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701)
- Mac: [iTerm2](https://iterm2.com/)
- Linux: [Gnome](https://help.gnome.org/users/gnome-terminal/stable/), [Alacritty](https://snapcraft.io/alacritty)

## DuckDB Version Mismatch

Harlequin depends on DuckDB, and installing it in an isolated environment (e.g., using `pipx` or in a fresh virtual environment) will cause it to install DuckDB. If you have DuckDB installed elsewhere (e.g., if you already installed DuckDB with `pipx` or Homebrew), you may want to pin the version of DuckDB that Harlequin uses. For example, attempting to open a DuckDB database file with different versions of DuckDB will result in an error that looks like this:

```
IO Error: Trying to read a database file with version number 64, but we can
only read version 51.
The database file was created with an newer version of DuckDB.

The storage of DuckDB is not yet stable; newer versions of DuckDB cannot
read old database files and vice versa.
The storage will be stabilized when version 1.0 releases.

For now, we recommend that you load the database file in a supported version
of DuckDB, and use the EXPORT DATABASE command followed by IMPORT DATABASE
on the current version of DuckDB.

See the storage page for more information:
https://duckdb.org/internals/storage
```

### Determining the Version of the DuckDB CLI on your Path

First, determine what version of DuckDB you are running outside of Harlequin, and how it was installed. You can find the path to the executable with `which duckdb` on Unix systems, or `get-command duckdb` in Windows Powershell. This path should give you a hint about how it was installed; you could also try `pipx list` or `brew list` to see if DuckDB was installed by either of those tools.

Next, run `duckdb --version`, which should display the version number and commit SHA, like `v0.9.0 0d84ccf478`.

Alternatively, the [storage page](https://duckdb.org/internals/storage) linked to in the error message provides a mapping of storage versions to DuckDB versions (e.g., we can see that storage version 64 maps to DuckDB 0.9.0, and 51 maps to DuckDB 0.8.0).

### Determining the Version of DuckDB Used by Harlequin

Open Harlequin, then in the query editor, type or paste `select version()`. In the Results Viewer, the version number should be displayed.

### Changing the Version of DuckDB Used by Harlequin

**Note:** Harlequin requires DuckDB >= 0.8.0 due to changes in the Python API in that version.

You can add an explicit pin to a DuckDB version alongside Harlequin's installation. The following examples assume you would like to pin the version to `0.9.0`.

#### With pipx

You must "inject" the pinned dependency into the Harlequin installation with: `pipx inject harlequin duckdb==0.9.0`.

#### With pip

With your venv activated, simply install the pinned version with `pip install duckdb==0.9.0`, or add `duckdb==0.9.0` to your `requirements.txt`.

#### With pipenv

Run `pipenv add duckdb==0.9.0`.

#### With Poetry

Run `poetry add duckdb==0.9.0`.
