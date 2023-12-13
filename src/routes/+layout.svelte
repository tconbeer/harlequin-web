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
  class="mx-auto grid h-screen max-w-screen-lg grid-rows-[auto_1fr_auto] px-6 selection:bg-pink"
>
  <Header />

  <main class="mb-auto overflow-x-visible">
    <slot />
  </main>

  <Footer />
</div>
