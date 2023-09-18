<script lang="ts">
  import Footer from "./footer.svelte";
  import Header from "./header.svelte";
  import { title, subtitle, description } from "$lib/config";
  import "../app.css";
</script>

<svelte:head>
  <title>{title}: {subtitle}</title>
  <meta name="description" content={description} />
</svelte:head>

<div
  class="mx-auto grid max-w-screen-lg grid-rows-[auto_1fr_auto] px-6 selection:bg-pink"
>
  <Header />

  <main class="overflow-x-auto">
    <slot />
  </main>

  <Footer />
</div>
