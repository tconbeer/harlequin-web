<script lang="ts">
  import { browser } from "$app/environment";
  import { page } from "$app/state";
  import { title } from "$lib/config";
  import SearchExcerpt from "$lib/components/search_excerpt.svelte";
  import { resultHref, type SearchResult } from "$lib/search";
  import { loadEngine } from "$lib/search_client";

  const LIMIT = 30;

  let engine = $state<Awaited<ReturnType<typeof loadEngine>> | null>(null);
  let failed = $state(false);

  // The shell is prerendered: one file answers every query, and the query
  // itself is read after hydration. Reading `searchParams` during the prerender
  // is an error rather than an empty string — rightly, since a prerendered page
  // that varied by query string would be serving one query's answer to all of
  // them — so the branch has to be closed off before it is taken.
  let query = $derived(
    browser ? (page.url.searchParams.get("q")?.trim() ?? "") : "",
  );

  $effect(() => {
    loadEngine().then(
      (loaded) => (engine = loaded),
      () => (failed = true),
    );
  });

  let results = $derived<SearchResult[] | null>(
    engine && query ? engine.search(query, LIMIT) : null,
  );
</script>

<svelte:head>
  <title>{title}: {query ? `Search: ${query}` : "Search the docs"}</title>
  <!-- Every query is the same prerendered file; none of them is a page worth
       having in an index of its own. -->
  <meta name="robots" content="noindex" />
</svelte:head>

<h1 class="font-accent text-3xl">Search the docs</h1>

{#if !query}
  <p class="mb-2">
    Type a word or two above to search all of the documentation.
  </p>
{:else if failed}
  <p class="mb-2">
    The search index could not be loaded. <a href="/docs/getting-started"
      >Browse the docs</a
    > instead, or reload the page to try again.
  </p>
{:else if !results}
  <p class="mb-2">Searching…</p>
{:else if !results.length}
  <p class="mb-2">
    Nothing matches <strong>{query}</strong>.
  </p>
  <p class="mb-2 text-sm opacity-80">
    Searching works the way a web search does: every word has to appear, and a
    partial word matches what starts with it. Put <code>"quotes"</code> around a
    phrase to match it exactly, <code>-</code> in front of a word to exclude it,
    and <code>OR</code> between words to accept either.
  </p>
{:else}
  <p class="mb-4 text-sm opacity-80">
    {results.length}
    {results.length === 1 ? "page" : "pages"} matching <strong>{query}</strong>
  </p>
  <ul>
    {#each results as result (result.slug)}
      <li class="mb-4 border-l-2 border-purple pl-3">
        <a
          href={resultHref(result.slug, query, result.best.anchor)}
          class="text-inherit no-underline decoration-green decoration-2 underline-offset-4 hover:underline"
        >
          <span class="block font-accent text-xl">{result.title}</span>
          {#if result.topic}
            <span class="block text-xs opacity-70">{result.topic}</span>
          {/if}
          <span class="mt-1 block text-sm leading-snug">
            {#if result.best.heading}<span class="opacity-70"
                >{result.best.heading} —
              </span>{/if}<SearchExcerpt segments={result.best.excerpt} />
          </span>
        </a>
        {#if result.more.length}
          <span class="mt-1 block text-xs">
            <span class="opacity-70">Also on this page:</span>
            {#each result.more as section, i (section.anchor)}{#if i > 0}{", "}{/if}<a
                href={resultHref(result.slug, query, section.anchor)}
                >{section.heading}</a
              >{/each}
          </span>
        {/if}
      </li>
    {/each}
  </ul>
{/if}
