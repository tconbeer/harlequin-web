<script lang="ts">
  import type { Snippet } from "svelte";
  interface Props {
    children: Snippet;
    icon_src: string;
    title_text: string;
    border_color: "pink" | "purple" | "green" | "black";
  }
  let { children, icon_src, title_text, border_color }: Props = $props();
  const borders = {
    pink: "border-pink",
    purple: "border-purlple",
    green: "border-green",
    black: "border-black",
  };
</script>

<div
  class="my-2 w-full overflow-x-auto rounded border border-2 {borders[
    border_color
  ]} px-4 py-4 text-sm"
>
  <div class="flex items-center pb-2">
    <img class="h-6 w-6" src={icon_src} alt="lightbulb icon" />
    <span class="pl-2 font-bold">{title_text}</span>
  </div>
  {@render children()}
</div>
