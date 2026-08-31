<script lang="ts">
  import { slugify } from "$lib/slugify";
  let slotValue: HTMLElement;
</script>

<!-- A docs page's own title is rendered by the route, from the frontmatter, so
  a page written here starts at `##`. The one file in the corpus that opens at
  `#` is the vendored CLI reference, which is embedded inside a page that has
  already rendered its <h1> — so this is an <h2>, and the heading levels under
  it still nest. -->
<h2 id={slugify(slotValue)} class="mt-6 font-accent text-2xl">
  <span bind:this={slotValue}><slot /></span>
</h2>
