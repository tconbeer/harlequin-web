<script lang="ts">
  import type { Snippet } from "svelte";
  let { children }: { children: Snippet } = $props();
</script>

<code class="bg-pink px-0.5 text-xs whitespace-nowrap selection:bg-purple"
  >{@render children()}</code
>
