<script lang="ts">
  import LazyImage from "$lib/components/lazy_image.svelte";

  import catppuccin_latte from "$lib/assets/themes/catppuccin-latte.svg";
  import catppuccin_mocha from "$lib/assets/themes/catppuccin-mocha.svg";
  import dracula from "$lib/assets/themes/dracula.svg";
  import flexoki from "$lib/assets/themes/flexoki.svg";
  import gruvbox from "$lib/assets/themes/gruvbox.svg";
  import harlequin from "$lib/assets/themes/harlequin.svg";
  import monokai from "$lib/assets/themes/monokai.svg";
  import nord from "$lib/assets/themes/nord.svg";
  import solarized_light from "$lib/assets/themes/solarized-light.svg";
  import textual_dark from "$lib/assets/themes/textual-dark.svg";
  import textual_light from "$lib/assets/themes/textual-light.svg";
  import tokyo_night from "$lib/assets/themes/tokyo-night.svg";

  const themes = [
    ["catppuccin-latte", catppuccin_latte],
    ["catppuccin-mocha", catppuccin_mocha],
    ["dracula", dracula],
    ["flexoki", flexoki],
    ["gruvbox", gruvbox],
    ["harlequin", harlequin],
    ["monokai", monokai],
    ["nord", nord],
    ["solarized-light", solarized_light],
    ["textual-dark", textual_dark],
    ["textual-light", textual_light],
    ["tokyo-night", tokyo_night],
  ];

  let { grow = true } = $props();
</script>

<ul class="mt-4 flex flex-wrap justify-center gap-4 overflow-visible">
  {#each themes as [name, src]}
    <li
      class="overflow-visible transition-transform {grow === true
        ? 'hover:scale-250'
        : ''} "
    >
      <a href={src} target="_blank"
        ><LazyImage
          {src}
          alt="Screenshot of Harlequin with the {name} theme."
          className="w-40 shadow-lg"
          title={name}
        /></a
      >
    </li>
  {/each}
</ul>
