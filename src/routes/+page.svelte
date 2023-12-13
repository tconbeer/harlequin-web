<script lang="ts">
  import hero from "$lib/assets/themes/harlequin.svg?raw";
  import Platforms from "./platforms.svelte";
  import Databases from "./databases.svelte";
  import Features from "./features.svelte";
  import Themes from "./themes.svelte";
  import Tweets from "./tweets.svelte";
</script>

<h2 class="mt-12 text-center font-accent text-3xl">
  Portable, powerful, colorful.
</h2>
<p class="text-center">
  An easy, fast, and beautiful database client for the terminal.
</p>
<div
  class="mx-auto w-fit py-6 transition-transform duration-200 hover:scale-105 active:translate-x-1 active:translate-y-1"
>
  <a
    href="/docs/getting-started"
    class="rounded-full bg-green px-6 py-3 text-center font-bold shadow-lg"
    >Get Started</a
  >
</div>
<figure class="mx-auto max-w-screen-lg py-2 drop-shadow-lg">
  {@html hero} <!-- eslint-disable-line -->
</figure>

<h2 class="mt-12 text-center font-accent text-3xl">Runs Anywhere.</h2>
<Platforms />

<h2 class="mt-12 text-center font-accent text-3xl">
  Works with Your Database.
</h2>
<Databases />

<h2 class="mt-12 text-center font-accent text-3xl">Does SQL IDE Stuff.</h2>
<Features />

<h2 class="mt-12 text-center font-accent text-3xl" id="themes">Looks nice.</h2>
<Themes />

<h2 class="mt-12 text-center font-accent text-3xl">Join the Flock.</h2>
<Tweets />
