<script lang="ts">
  import hero from "$lib/assets/hero.webm";
  import hero_mp4 from "$lib/assets/hero.mp4";
  import Platforms from "./platforms.svelte";
  import Features from "./features.svelte";
  import Themes from "./themes.svelte";
  import Tweets from "./tweets.svelte";
</script>

<h2 class="mt-12 text-center font-accent text-3xl">
  Portable, powerful, colorful.
</h2>
<p class="text-center">A drop-in replacement for the DuckDB CLI.</p>
<div
  class="mx-auto w-fit py-6 transition-transform duration-200 hover:scale-105 active:translate-x-1 active:translate-y-1"
>
  <a
    href="/docs/getting-started"
    class="rounded-full bg-green px-6 py-3 text-center font-bold shadow-lg"
    >Get Started</a
  >
</div>
<video autoplay loop muted playsinline class="mx-auto max-w-screen-sm py-2 drop-shadow-lg">
  <source src="{hero}" type="video/mebm">
  <source src="{hero_mp4}" type="video/mp4">
</video>

<h2 class="mt-12 text-center font-accent text-3xl">Runs Anywhere.</h2>
<Platforms />

<h2 class="mt-12 text-center font-accent text-3xl">Does SQL IDE Stuff.</h2>
<Features />

<h2 class="mt-12 text-center font-accent text-3xl" id="themes">Looks nice.</h2>
<Themes />

<h2 class="mt-12 text-center font-accent text-3xl">Join the Flock.</h2>
<Tweets />
