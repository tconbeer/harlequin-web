<script context="module">
  import a from "./components/a.svelte";
  import code from "./components/code.svelte";
  import h1 from "./components/h1.svelte";
  import h2 from "./components/h2.svelte";
  import h3 from "./components/h3.svelte";
  import h4 from "./components/h4.svelte";
  import img from "./components/img.svelte";
  import li from "./components/li.svelte";
  import ol from "./components/ol.svelte";
  import output from "./components/output.svelte";
  import p from "./components/p.svelte";
  import pre from "./components/pre.svelte";
  import strong from "./components/strong.svelte";
  import table from "./components/table.svelte";
  import td from "./components/td.svelte";
  import th from "./components/th.svelte";
  import ul from "./components/ul.svelte";
  export {
    a,
    code,
    h1,
    h2,
    h3,
    h4,
    li,
    img,
    ol,
    output,
    p,
    pre,
    strong,
    table,
    td,
    th,
    ul,
  };
</script>

<!-- pre component styles might get pruned, since the pre component is
    loaded manually in svelte.config.js. -->
<div class="mb-8 w-full overflow-x-auto">
  <slot />
  <span class="select-none font-bold text-purple"></span>
</div>
