<script lang="ts">
  // The generated CLI reference, rendered through the same layout as a
  // hand-written page. The file is vendored — generated in `tconbeer/harlequin`
  // from `hsql --spec` and copied here by that repo's release workflow — so
  // nothing on this side writes or edits it, and the version line says which
  // release a reader is looking at.
  import Link from "$lib/components/link.svelte";
  import manifest from "../../../static/artifacts/manifest.json";
  import Reference from "../../../static/artifacts/hsql-reference.md";

  const url = "https://harlequin.sh/artifacts/hsql-reference.md";
</script>

<p class="mb-2 italic">
  Generated from hsql {manifest.version}, and served verbatim at
  <Link href={url}>harlequin.sh/artifacts/hsql-reference.md</Link>.
</p>
<div class="reference">
  <Reference />
</div>

<style>
  /* The option table is six columns wide and its rows are as tall as a
     paragraph, so a reader loses the row on the way to the description. A
     hairline under each one is enough to follow, and it belongs to this table
     rather than to every table on the site. */
  .reference :global(tbody tr:not(:last-child) td) {
    border-bottom: 1px solid rgba(214, 123, 255, 0.4);
  }
</style>
