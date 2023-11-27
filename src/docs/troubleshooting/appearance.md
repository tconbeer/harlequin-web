---
title: Appearance
menuOrder: 930
---

<script>
    import solarized_256 from "$lib/assets/docs/solarized-dark-256color.png"
    import solarized from "$lib/assets/themes/solarized-dark.svg"
</script>

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
1. Your terminal may only support 256 colors. You should [upgrade your terminal](terminal-recommendations).

If none of those work, some themes still look good in 256 colors. We recommend `monokai` (the default), `zenburn`, `github-dark`, `fruity`, `native` and `one-dark`.

### Fonts

Modern terminals can display different fonts. Harlequin looks great in a number of fixed-width fonts, but may have odd artifacts in others. We especially like [Nerd Fonts](https://www.nerdfonts.com/), which contain ligatures for symbols common in programming. Popular options include FiraCode, Meslo, Cascadia, and JetBrainsMono.

To use a different font with Harlequin, download and install the font, and then configure your terminal to use that font.

**Note for Mac Terminal.app Users:**

Only some fonts render right with the default Terminal app. You may need to adjust your line spacing. [See here](https://textual.textualize.io/FAQ/#why-doesnt-textual-look-good-on-macos) for instructions.

**Note for WSL2 and Windows Terminal users:**

Windows Terminal runs in Windows and attaches your Linux shell over the WSL network. You need to install your font in **Windows** for this to work.
