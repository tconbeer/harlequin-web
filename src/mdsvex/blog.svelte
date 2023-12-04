<script context="module">
  import a from "./components/a.svelte";
  import code from "./components/code.svelte";
  import h2 from "./components/h2.svelte";
  import h3 from "./components/h3.svelte";
  import h4 from "./components/h4.svelte";
  import img from "./components/img.svelte";
  import li from "./components/li.svelte";
  import ol from "./components/ol.svelte";
  import p from "./components/p.svelte";
  import pre from "./components/pre.svelte";
  import strong from "./components/strong.svelte";
  import ul from "./components/ul.svelte";
  export { a, code, h2, h3, h4, li, img, ol, p, pre, strong, ul };
</script>

<!-- pre component styles might get pruned, since the pre component is
    loaded manually in svelte.config.js. -->
<span class="select-none font-bold text-purple"></span>
<div class="mb-8 overflow-x-auto">
  <slot />
</div>
