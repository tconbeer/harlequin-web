<script lang="ts">
  let {data} = $props();
  const Content = $derived(data.content);
  import { title } from "$lib/config";
  import Github from "$lib/components/github.svelte";
</script>

<svelte:head>
  <title>{title}: {data.meta.title}</title>
</svelte:head>
<h1 class="font-accent text-3xl">{data.meta.title}</h1>
{#if data.repo}
  <div class="my-2 w-full">
    <Github repo={data.repo} stargazers_count={data.stargazers_count} forks_count={data.forks_count} grow=false></Github>
  </div>
{/if}
<Content></Content>
