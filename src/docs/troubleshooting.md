---
title: Troubleshooting
menuOrder: 99
---

<script>
    import solarized_256 from "$lib/assets/docs/solarized-dark-256color.png"
    import solarized from "$lib/assets/themes/solarized-dark.svg"
    import Key from "$lib/components/key.svelte"
</script>

## Key Bindings

Harlequin can only react to key presses that are sent to it from the Terminal it is running in. Some common key presses, like <Key>ctrl+enter</Key>, aren't forwarded correctly by some terminals, or may be aliased to a different sort of event.

If you don't want to [upgrade your terminal](#terminal-recommendations), you can use the following aliases, which should be supported everywhere (if not, [open an issue](https://github.com/tconbeer/harlequin/issues)):

- Run query: use <Key>ctrl+j</Key>, not <Key>ctrl+enter</Key>.
- Paste text: use <Key>ctrl+u</Key>, not <Key>ctrl+v</Key>.
- Comment line: use <Key>ctrl+\_</Key> (underscore), not <Key>ctrl+/</Key>.
- On a Mac: For all bindings, use <Key>^ Control</Key>, not <Key>⌘ Command</Key>.

## Appearance

Harlequin should look great in your terminal. If it doesn't, it may be because we depend on your terminal and shell for rendering, and those may require some configuration on your machine.

<span id="colors"></span>

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

<span class="text-purple italic font-bold">Note for Mac Terminal.app Users:</span>

Only some fonts render right with the default Terminal app. [See here](https://textual.textualize.io/FAQ/#why-doesnt-textual-look-good-on-macos) for a workaround.

<span class="text-purple italic font-bold">Note for WSL2 and Windows Terminal users:</span>

Windows Terminal runs in Windows and attaches your Linux shell over the WSL network. You need to install your font in **Windows** for this to work.

<span id="terminal-recommendations"></span>

## Terminal Recommendations

If you are using the default Mac Terminal or Windows Command Prompt, you may want to switch to a more modern terminal. The following terminals are free and come highly recommended:

- Windows (native or WSL2): [Windows Terminal](https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701)
- Mac: [iTerm2](https://iterm2.com/)
- Linux: [Gnome](https://help.gnome.org/users/gnome-terminal/stable/), [Alacritty](https://snapcraft.io/alacritty)
