<script lang="ts">
	import * as config from '$lib/config';
	import duck from '$lib/assets/icons/icons8-duck-50.png';

	let showMenu = false;

	function toggleNavbar() {
		showMenu = !showMenu;
	}
</script>

<nav class="flex flex-wrap justify-between mt-4">
	<div>
		<div>
			<a href="/" class="text-inherit font-display text-4xl">{config.title}</a>
		</div>
		<div class="mt-1">
			<span class="relative">
				<span class="block absolute -inset-1 -skew-y-3 bg-pink" aria-hidden="true" />
				<span class="relative text-black text-sm">{config.description}</span>
			</span>
		</div>
	</div>

	<div class="sm:hidden pt-4 {showMenu ? 'rotate-180' : 'rotate-0'} transition-transform">
		<button on:click={toggleNavbar} on:keypress={toggleNavbar} aria-label="Click for nav menu.">
			<img src={duck} class="w-8 h-8" alt="A line drawing of a duck, in lieu of a hamburger." />
		</button>
	</div>

	<ul class="mt-4 sm:mt-0 {showMenu ? 'flex' : 'hidden'} sm:flex gap-8 sm:pt-2">
		<li>
			<a
				href="/start"
				class="text-inherit no-underline hover:underline underline-offset-4 decoration-green decoration-4"
				>Get Started</a
			>
		</li>
		<li>
			<a
				href="/docs"
				class="text-inherit no-underline hover:underline underline-offset-4 decoration-green decoration-4"
				>Docs</a
			>
		</li>
		<li>
			<a
				href="/about"
				class="text-inherit no-underline hover:underline underline-offset-4 decoration-green decoration-4"
				>About</a
			>
		</li>
		<li>
			<a
				href="https://github.com/tconbeer/harlequin"
				target="_blank"
				class="text-inherit no-underline hover:underline underline-offset-4 decoration-green decoration-4"
				>GitHub</a
			>
		</li>
	</ul>
</nav>
