<script lang="ts">
  import Feature from "./feature.svelte";
  import solarized_light from "$lib/assets/themes/solarized-light.svg";
</script>

<ul class="w-full">
  <li>
    <Feature
      title="Themes"
      body="A dozen built-in themes, including Dracula, Gruvbox, Nord, and Catppuccin. This one is Solarized Light; pick yours with --theme."
      src={solarized_light}
    />
  </li>
</ul>
