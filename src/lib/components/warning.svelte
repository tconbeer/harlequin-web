<script lang="ts">
  import type { Snippet } from "svelte";
  let { children }: { children: Snippet } = $props();
  import Alert from "#lib/components/alert.svelte";
  import warning from "#lib/assets/icons/icons8-warning-50.png";
</script>

<Alert icon_src={warning} title_text="Warning" border_color="pink"
  >{@render children()}</Alert
>
