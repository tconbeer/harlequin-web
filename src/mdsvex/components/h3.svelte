<script lang="ts">
  import { slugify } from "#lib/slugify.js";
  let slotValue: HTMLElement;
</script>

<h3 id={slugify(slotValue)} class="mt-3 text-xl font-bold">
  <span bind:this={slotValue}><slot /></span>
</h3>
