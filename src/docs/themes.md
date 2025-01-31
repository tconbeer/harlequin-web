---
title: Choosing a Theme
menuOrder: 5
---

<script>
    import ThemeGallery from "$lib/components/theme_gallery.svelte"
</script>

You can set a theme for Harlequin, passing the name of any Textual Theme to the `--theme` or `-t` option.

```bash
harlequin --theme gruvbox
```

Depending on the number of colors supported by your terminal and shell, some themes [may not look great](troubleshooting/appearance#colors). For any terminal, we can recommend `harlequin` (the default).

To see a list of theme names, run `harlequin --help`.

<ThemeGallery grow=false></ThemeGallery>
