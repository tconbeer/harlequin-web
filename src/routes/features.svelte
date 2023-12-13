<script lang="ts">
  import Feature from "./feature.svelte";
  import catalog from "$lib/assets/features/catalog.png";
  import editor from "$lib/assets/features/editor.png";
  import results from "$lib/assets/features/results.png";
  import full_screen from "$lib/assets/features/full_screen.webp";
  import exporter from "$lib/assets/features/export.png";
</script>

<p class="text-center">
  The features you'd expect from an IDE, delightfully running right in your
  terminal.
</p>
<ul class="w-full">
  <li>
    <Feature
      title="Data Catalog"
      body="View tables, columns, and their types across one or more attached databases."
      src={catalog}
    />
  </li>
  <li>
    <Feature
      title="Query Editor"
      body="A full-featured editor: autocomplete, open, save, format, cut, copy, paste, and more. Supports multiple tabbed buffers!"
      src={editor}
    />
  </li>
  <li>
    <Feature
      title="Results Viewer"
      body="View 1M+ results in an interactive table. Multiple queries loaded into separate tabs."
      src={results}
    />
  </li>
  <li>
    <Feature
      title="Full Screen"
      body="Need more room? Press F10 to view the Editor or Results in full-screen mode."
      src={full_screen}
    />
  </li>
  <li>
    <Feature
      title="Results Export"
      body="Export query results and configure the export using a helpful UI."
      src={exporter}
    />
  </li>
</ul>
