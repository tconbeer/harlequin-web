<script lang="ts">
  import { page } from "$app/state";
  import { canonicalUrl, title, url } from "$lib/config";
  import Github from "$lib/components/github.svelte";
  import MarkdownActions from "$lib/components/markdown_actions.svelte";
  import SearchHighlight from "$lib/components/search_highlight.svelte";
  import { docsSlug } from "$lib/markdown_actions";

  let { data } = $props();
  const Content = $derived(data.content);
  // The rendered body, for the search highlighter to read. It walks these nodes
  // and paints ranges over them; it never modifies them.
  let body = $state<HTMLElement | null>(null);
  const canonical = $derived(new URL(page.url.pathname, url).href);
  const slug = $derived(docsSlug(page.url.pathname));
  // The URL the page is published at, not the one that served it: a copied page
  // is read somewhere else, and a localhost source line is a dead one.
  const source = $derived(new URL(page.url.pathname, canonicalUrl).href);
</script>

<svelte:head>
  <title>{title}: {data.meta.title}</title>
  <link rel="canonical" href={canonical} />
</svelte:head>
<div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
  <h1 class="font-accent text-3xl">{data.meta.title}</h1>
  <MarkdownActions {slug} title={data.meta.title} canonical={source} />
</div>
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
<SearchHighlight target={body} />
<div bind:this={body}>
  <Content></Content>
</div>
