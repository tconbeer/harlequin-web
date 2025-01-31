<script lang="ts">
  let { children } = $props();
</script>

<kbd
  class="rounded border-b-2 border-r-2 border-purple bg-pink px-1 py-0.5 text-xs font-bold selection:bg-purple"
  >{@render children()}</kbd
>
