<script lang="ts">
  import type { Snippet } from "svelte";
  let { children }: { children: Snippet } = $props();
  import Alert from "$lib/components/alert.svelte";
  import lightbulb from "$lib/assets/icons/icons8-lightbulb-50.png";
</script>

<Alert icon_src={lightbulb} title_text="Tip" border_color="green"
  >{@render children()}</Alert
>
