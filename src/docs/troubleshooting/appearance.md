---
title: Appearance
menuOrder: 930
---

<script>
    import Note from "$lib/components/note.svelte"
    import Link from "$lib/components/link.svelte"
    import nord_256 from "$lib/assets/docs/nord-256.png"
    import nord from "$lib/assets/docs/nord.png"
</script>

Harlequin should look great in your terminal. If it doesn't, it may be because we depend on your terminal and shell for rendering, and those may require some configuration on your machine.

### Colors

Modern terminal emulators can display millions of colors, in a scheme called "truecolor." Older terminals could only display 256 colors, or even as few as 8.

Some themes look terrible with only 256 colors. For example, `nord`:

<div class="flex flex-wrap justify-center gap-4 py-2">
    <figure>
        <img src={nord_256} alt="Screenshot of the Nord theme in 256 colors"  class="h-auto w-64 sm:w-auto sm:h-48">
        <figcaption class="text-center text-sm text-purple font-bold">Nord in 256 Colors</figcaption>
    </figure>
    <figure>
        <img src={nord} alt="Screenshot of the Nord theme in truecolor"  class="h-auto w-64 sm:w-auto sm:h-48">
        <figcaption class="text-center text-sm text-purple font-bold">Nord in Truecolor</figcaption>
    </figure>
</div>

For Harlequin to display in truecolor, both the terminal and shell need to support it. If you are seeing only 256 colors, there could be a few causes:

1. Your terminal and shell may support truecolor, but the terminal may be rendering your shell in 256 colors for backwards-compatibility reasons (e.g., bash in WSL2 on Windows Terminal). Try setting the environment variable `COLORTERM` to `truecolor` to instruct your terminal to render truecolor. You can test this by launching Harlequin with `COLORTERM=truecolor harlequin`, and if that works, you should set the environment variable more durably (Google instructions for your OS). As an example (bash in WSL2 on Windows Terminal), I added this line to my `.bashrc` file: `export COLORTERM=truecolor`.
1. Your terminal may support truecolor, but your shell may not. Some implementations of some shells don't support truecolor, even if the terminal they are running in does. You can try a different shell, like [fish](https://fishshell.com/), [zsh](https://www.zsh.org/), or [PowerShell](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell?view=powershell-7.3).
1. Your terminal may only support 256 colors. You should [upgrade your terminal](terminal-recommendations).

If none of those work, some themes still look good in 256 colors. We recommend `harlequin` (the default), `textual-light`, `gruvbox`, `catppuccin-mocha`, and `tokyo-night`.

### Fonts

Modern terminals can display different fonts. Harlequin looks great in a number of fixed-width fonts, but may have odd artifacts in others. We especially like [Nerd Fonts](https://www.nerdfonts.com/), which contain ligatures for symbols common in programming. Popular options include FiraCode, Meslo, Cascadia, and JetBrainsMono.

To use a different font with Harlequin, download and install the font, and then configure your terminal to use that font.

<Note title_text="Note for Mac Terminal.app Users">
Only some fonts render right with the default Terminal app. You may need to adjust your line spacing. <Link href="https://textual.textualize.io/FAQ/#why-doesnt-textual-look-good-on-macos">See here</Link> for instructions.
</Note>

<Note title_text="Note for WSL2 and Windows Terminal Users">
Windows Terminal runs in Windows and attaches your Linux shell over the WSL network. You need to install your font in <span class="font-bold italic text-purple">Windows</span> for this to work.
</Note>
