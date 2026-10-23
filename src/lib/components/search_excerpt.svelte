<script lang="ts">
  import type { Segment } from "#lib/search.js";

  let { segments }: { segments: Segment[] } = $props();
</script>

<!-- prettier-ignore -->
<span
  >{#each segments as segment, i (i)}{#if segment.hit}<mark
      class="rounded-sm bg-green px-0.5 text-black">{segment.text}</mark
    >{:else}{segment.text}{/if}{/each}</span
>
