<script lang="ts">
  import { title, url } from "$lib/config";
  import Github from "$lib/components/github.svelte";
  import { page } from "$app/state";

  let { data } = $props();
  const Content = $derived(data.content);
  const canonical = $derived(new URL(page.url.pathname, url).href);
</script>

<svelte:head>
  <title>{title}: {data.meta.title}</title>
  <link rel="canonical" href={canonical} />
</svelte:head>
<h1 class="font-accent text-3xl">{data.meta.title}</h1>
{#if data.github}
  <div class="my-2 w-full">
    <Github
      repo={data.github.repo}
      stargazers_count={data.github.stargazers_count}
      forks_count={data.github.forks_count}
      grow={false}
    ></Github>
  </div>
{/if}
<Content></Content>
