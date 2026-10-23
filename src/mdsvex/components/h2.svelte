<script lang="ts">
  import { slugify } from "#lib/slugify.js";
  let slotValue: HTMLElement;
</script>

<h2 id={slugify(slotValue)} class="mt-6 font-accent text-2xl">
  <span bind:this={slotValue}><slot /></span>
</h2>
