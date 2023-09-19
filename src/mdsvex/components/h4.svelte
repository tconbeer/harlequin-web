<script lang="ts">
  import { slugify } from "$lib/slugify";
  let slotValue: HTMLElement;
</script>

<h4 id={slugify(slotValue)} class="mb-2 text-lg font-bold italic">
  <span bind:this={slotValue}><slot /></span>
</h4>
