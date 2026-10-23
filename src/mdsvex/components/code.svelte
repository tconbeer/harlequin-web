<script lang="ts">
  import type { Snippet } from "svelte";
  let { children }: { children: Snippet } = $props();
</script>

<code class="whitespace-nowrap bg-pink px-0.5 text-xs selection:bg-purple"
  >{@render children()}</code
>
