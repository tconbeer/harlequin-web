<script lang="ts">
  import Footer from "./footer.svelte";
  import Header from "./header.svelte";
  import "../app.css";
</script>

<div
  class="mx-auto grid max-w-screen-lg grid-rows-[auto_1fr_auto] px-6 selection:bg-pink lg:px-0"
>
  <Header />

  <main class="overflow-x-auto">
    <slot />
  </main>

  <Footer />
</div>
