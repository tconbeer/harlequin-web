<script lang="ts">
  import { slugify } from "$lib/slugify";
  let slotValue: HTMLElement;
</script>

<h3 id={slugify(slotValue)} class="mt-3 text-xl font-bold">
  <span bind:this={slotValue}><slot /></span>
</h3>
