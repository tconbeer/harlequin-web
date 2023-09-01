<script lang="ts">
	import hero from '$lib/assets/hero.svg';
	import Platforms from './platforms.svelte';
	import Features from './features.svelte';
	import Themes from './themes.svelte';
	import Tweets from './tweets.svelte';
</script>

<h2 class="font-accent text-3xl text-center mt-12">Portable, powerful, colorful.</h2>
<p class="text-center">A drop-in replacement for the DuckDB CLI.</p>
<div class="mx-auto w-fit py-6 hover:scale-110">
	<a href="/start" class="text-center rounded-full bg-green px-6 py-3 font-bold shadow-lg"
		>Get Started</a
	>
</div>
<img
	src={hero}
	alt="An animated GIF showing the interface and features of Harlequin."
	class="max-w-screen-sm mx-auto py-2 drop-shadow-lg"
/>

<h2 class="font-accent text-3xl text-center mt-12">Runs Anywhere.</h2>
<Platforms />

<h2 class="font-accent text-3xl text-center mt-12">Does SQL IDE Stuff.</h2>
<Features />

<h2 class="font-accent text-3xl text-center mt-12">Looks nice.</h2>
<Themes />

<h2 class="font-accent text-3xl text-center mt-12">Join the Flock.</h2>
<Tweets />
