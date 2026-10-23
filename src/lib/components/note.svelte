<script lang="ts">
  import type { Snippet } from "svelte";
  let {
    children,
    title_text = "Note",
  }: { children: Snippet; title_text?: string } = $props();
  import Alert from "#lib/components/alert.svelte";
  import exclamation from "#lib/assets/icons/icons8-exclamation-50.png";
</script>

<Alert icon_src={exclamation} {title_text} border_color="black"
  >{@render children()}</Alert
>
