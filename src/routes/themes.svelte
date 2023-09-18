<script lang="ts">
  import LazyImage from "$lib/components/lazy_image.svelte";

  import arduino from "$lib/assets/themes/arduino.svg";
  import dracula from "$lib/assets/themes/dracula.svg";
  import emacs from "$lib/assets/themes/emacs.svg";
  import fruity from "$lib/assets/themes/fruity.svg";
  import github_dark from "$lib/assets/themes/github-dark.svg";
  import gruvbox_dark from "$lib/assets/themes/gruvbox-dark.svg";
  import gruvbox_light from "$lib/assets/themes/gruvbox-light.svg";
  import igor from "$lib/assets/themes/igor.svg";
  import inkpot from "$lib/assets/themes/inkpot.svg";
  import lightbulb from "$lib/assets/themes/lightbulb.svg";
  import material from "$lib/assets/themes/material.svg";
  import monokai from "$lib/assets/themes/monokai.svg";
  import native from "$lib/assets/themes/native.svg";
  import nord_darker from "$lib/assets/themes/nord-darker.svg";
  import one_dark from "$lib/assets/themes/one-dark.svg";
  import perldoc from "$lib/assets/themes/perldoc.svg";
  import rrt from "$lib/assets/themes/rrt.svg";
  import solarized_dark from "$lib/assets/themes/solarized-dark.svg";
  import solarized_light from "$lib/assets/themes/solarized-light.svg";
  import stata_dark from "$lib/assets/themes/stata-dark.svg";
  import vs from "$lib/assets/themes/vs.svg";
  import zenburn from "$lib/assets/themes/zenburn.svg";

  const themes = [
    ["arduino", arduino],
    ["dracula", dracula],
    ["emacs", emacs],
    ["fruity", fruity],
    ["github_dark", github_dark],
    ["gruvbox_dark", gruvbox_dark],
    ["gruvbox_light", gruvbox_light],
    ["igor", igor],
    ["inkpot", inkpot],
    ["lightbulb", lightbulb],
    ["material", material],
    ["monokai", monokai],
    ["native", native],
    ["nord_darker", nord_darker],
    ["one_dark", one_dark],
    ["perldoc", perldoc],
    ["rrt", rrt],
    ["solarized_dark", solarized_dark],
    ["solarized_light", solarized_light],
    ["stata_dark", stata_dark],
    ["vs", vs],
    ["zenburn", zenburn],
  ];
</script>

<p class="text-center">
  Choose from dozens of <a
    href="https://pygments.org/styles/"
    target="_blank"
    class="underline hover:decoration-green hover:decoration-4 hover:underline-offset-4"
    >styles</a
  >.
</p>
<ul class="mt-4 flex flex-wrap justify-center gap-4 overflow-visible">
  {#each themes as [name, src]}
    <li class="transition-transform hover:scale-250">
      <a href={src} target="_blank"
        ><LazyImage
          {src}
          alt="Screenshot of Harlequin with the {name} theme."
          className="w-40 shadow-lg"
        /></a
      >
    </li>
  {/each}
</ul>
