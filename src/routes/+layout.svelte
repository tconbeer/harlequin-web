<script lang="ts">
	import Footer from './footer.svelte';
	import Header from './header.svelte';
	import '../app.css';
</script>

<div class="h-full grid grid-rows-[auto_1fr_auto] max-w-screen-lg mx-auto px-6 lg:px-0">
	<Header />

	<main>
		<slot />
	</main>

	<Footer />
</div>
