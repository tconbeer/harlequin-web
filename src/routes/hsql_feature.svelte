<script lang="ts">
  import Terminal from "$lib/components/terminal.svelte";
  import type { TerminalLine } from "$lib/types";

  let { title = "", body = "", lines = [] as TerminalLine[] } = $props();
</script>

<div
  class="mx-auto my-6 flex max-w-2xl flex-wrap bg-pink px-6 py-6 shadow-lg shadow-purple selection:bg-purple"
>
  <div class="w-full pr-4 md:w-1/3">
    <h4 class="mb-3 text-xl font-bold">{title}</h4>
    <p>{body}</p>
  </div>
  <div class="mt-5 w-full md:mt-0 md:w-2/3">
    <Terminal {lines} size_class="text-[clamp(0.5rem,2.2vw,0.8rem)]" />
  </div>
</div>
