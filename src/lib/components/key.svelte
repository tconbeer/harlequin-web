<script lang="ts">
  import type { Snippet } from "svelte";
  let { children }: { children: Snippet } = $props();
</script>

<kbd
  class="rounded-sm border-r-2 border-b-2 border-purple bg-pink px-1 py-0.5 text-xs font-bold selection:bg-purple"
  >{@render children()}</kbd
>
