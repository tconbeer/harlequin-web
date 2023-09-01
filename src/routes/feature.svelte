<script lang="ts">
	export let title = '';
	export let body = '';
	export let src = '';
</script>

<div class="flex flex-wrap mx-auto max-w-2xl my-6 px-6 py-6 bg-pink shadow-lg shadow-purple">
	{#if src}
		<div class="w-full md:w-1/3 pr-4">
			<h3 class="text-xl font-bold mb-3">{title}</h3>
			<p>{body}</p>
		</div>
		<img
			{src}
			alt="A screenshot showing {title} functionality."
			class="object-cover object-left-top w-full md:w-2/3 max-h-96 border-yellow rounded-lg border-4 mt-5 md:mt-0"
		/>
	{:else}
		<div class="w-full">
			<h3 class="text-xl font-bold mb-3">{title}</h3>
			<p>{body}</p>
		</div>
	{/if}
</div>
