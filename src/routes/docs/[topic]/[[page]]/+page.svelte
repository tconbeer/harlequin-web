<script lang="ts">
  export let data;
  import { title } from "$lib/config";
</script>

<svelte:head>
  <title>{title}: {data.meta.title}</title>
</svelte:head>
<h1 class="mb-4 font-accent text-3xl">{data.meta.title}</h1>
<svelte:component this={data.content}></svelte:component>
