<script lang="ts">
  import Footer from "./footer.svelte";
  import Header from "./header.svelte";
  import "../app.css";
</script>

<div
  class="mx-auto grid h-full max-w-screen-lg grid-rows-[auto_1fr_auto] px-6 selection:bg-pink lg:px-0"
>
  <Header />

  <main>
    <slot />
  </main>

  <Footer />
</div>
