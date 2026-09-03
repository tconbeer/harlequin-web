<script lang="ts">
  import { browser } from "$app/environment";
  import { page } from "$app/state";
  import chevron from "$lib/assets/icons/icons8-chevron-50.png";
  import DocsSearch from "$lib/components/docs_search.svelte";
  import {
    docsAncestors,
    docsMenu,
    docsNeighbors,
    isTopic,
  } from "$lib/docs_menu";
  import type { DocsMenuItem } from "$lib/types";
  import { SvelteSet } from "svelte/reactivity";

  let { children } = $props();

  // "/docs/duckdb/motherduck" -> "duckdb/motherduck".
  const slugOf = (pathname: string) => pathname.split("/docs/").at(-1) ?? "";
  const openPath = (pathname: string) =>
    docsAncestors(slugOf(pathname)).map((topic) => topic.slug);

  let activeSlug = $derived(slugOf(page.url.pathname));
  let neighbors = $derived(docsNeighbors(activeSlug));
  // Topics on the way down to the current page, so they can be marked as the
  // branch the reader is in — both "Database Adapters" and "Adapter: DuckDB".
  let activePath = $derived(new SvelteSet(openPath(page.url.pathname)));

  // Topics are collapsed by default. Those containing the current page open
  // themselves — seeded here, not only in the effect below, so the server
  // renders them open too — and any the reader opens by hand stay open.
  let openTopics = $state(new SvelteSet<string>(openPath(page.url.pathname)));
  $effect(() => {
    for (const slug of openPath(page.url.pathname)) {
      openTopics.add(slug);
    }
  });
  function toggleTopic(slug: string) {
    if (!openTopics.delete(slug)) {
      openTopics.add(slug);
    }
  }

  // On small screens the sidebar is a drawer; opening a page closes it.
  let showNav = $state(false);
  $effect(() => {
    activeSlug;
    showNav = false;
  });

  const linkStyle =
    "mt-1 flex justify-between rounded px-1 py-1 transition-colors duration-200 md:mb-1 md:hover:bg-green";
  const activeStyle = "bg-purple font-bold";
</script>

<!-- Topics nest — the adapters are a group of groups — so one snippet renders
     every level, and each level indents inside the one above it. -->
{#snippet menuItem(item: DocsMenuItem)}
  <li>
    {#if isTopic(item)}
      <div
        class="mt-1 flex rounded px-1 py-1 transition-colors duration-200 md:mb-1 md:hover:bg-green {activePath.has(
          item.slug,
        )
          ? 'font-bold'
          : ''}"
      >
        <a href="/docs/{item.slug}" class="flex-1">{item.topic}</a>
        <button
          class="-my-1 ml-2 flex-none px-2 py-1"
          onclick={() => toggleTopic(item.slug)}
          aria-expanded={openTopics.has(item.slug)}
          aria-controls="docs-menu-{item.slug}"
          aria-label="{openTopics.has(item.slug)
            ? 'Collapse'
            : 'Expand'} {item.topic}"
        >
          <img
            src={chevron}
            class="h-4 w-4 {openTopics.has(item.slug)
              ? 'rotate-180'
              : 'rotate-90'} transition-transform duration-700"
            alt=""
          />
        </button>
      </div>
      <ul
        id="docs-menu-{item.slug}"
        class="{openTopics.has(item.slug)
          ? 'block'
          : 'hidden'} ml-1 border-l border-purple pl-2"
      >
        {#each item.items as child (child.slug)}
          {@render menuItem(child)}
        {/each}
      </ul>
    {:else}
      <a
        href="/docs/{item.slug}"
        aria-current={item.slug == activeSlug ? "page" : undefined}
        class="{linkStyle} {item.slug == activeSlug ? activeStyle : ''}"
        >{item.title}</a
      >
    {/if}
  </li>
{/snippet}

<div class="mt-6 flex w-full flex-wrap">
  <nav aria-label="Documentation" class="w-full md:w-1/4">
    <!-- Above the drawer toggle rather than inside it: on a narrow screen the
         menu is closed by default, and a search box a reader has to open a menu
         to find is a search box they do not know is there. -->
    <!-- Seeded from `?q=` so the results page needs no box of its own, and so a
         reader who follows a result still has their query in front of them.
         `browser`-guarded: /docs/search is prerendered, and reading a query
         string during a prerender is an error rather than an empty value. -->
    <DocsSearch
      initial={browser ? (page.url.searchParams.get("q") ?? "") : ""}
    />
    <button
      class="mt-1 flex w-full rounded bg-green px-1 py-1 transition-colors duration-200 md:hidden"
      onclick={() => (showNav = !showNav)}
      aria-expanded={showNav}
      aria-controls="docs-menu"
    >
      <span class="flex-1 text-start">Table of Contents</span>
      <span class="my-auto mr-2 block flex-none">
        <img
          src={chevron}
          class="h-4 w-4 {showNav
            ? ''
            : 'rotate-180'} transition-transform duration-700"
          alt=""
        />
      </span>
    </button>

    <ul id="docs-menu" class="{showNav ? 'block' : 'hidden'} md:block">
      {#each docsMenu as item (item.slug)}
        {@render menuItem(item)}
      {/each}
    </ul>
  </nav>
  <!-- min-w-0 lets the overflow-x-auto here actually bite: a flex item will not
       shrink below its content otherwise, so a wide code block would stretch
       the column instead of scrolling inside it. -->
  <div class="mt-4 w-full min-w-0 overflow-x-auto md:mt-0 md:w-3/4">
    <article class="md:ml-4">
      {@render children()}
      <!-- The search results share this shell but sit outside the sidebar's
           running order, so there is nothing to page to from there. -->
      {#if neighbors.prev || neighbors.next}
        <nav
          class="mb-4 flex justify-between gap-4 md:gap-8"
          aria-label="Pager"
        >
          {#if neighbors.prev}
            <a href="/docs/{neighbors.prev.slug}" rel="prev">
              <!-- Each card grows away from the column edge it sits against, and
                 presses towards the other one. A card centred on its own origin
                 grows ~5px past that edge, and the column is an overflow-x-auto:
                 past the left edge the border is clipped away, past the right it
                 puts a scrollbar under the page for as long as the pointer
                 rests on the card. -->
              <div
                class="origin-left rounded border border-green px-4 py-2 shadow-lg transition-transform hover:scale-105 active:translate-x-1 active:translate-y-1 md:w-48"
              >
                <p class="text-xs">← Previous</p>
                <p class="text-sm md:text-base">
                  {neighbors.prev.title}
                </p>
              </div>
            </a>
          {:else}
            <div></div>
          {/if}
          {#if neighbors.next}
            <a href="/docs/{neighbors.next.slug}" rel="next" class="text-right">
              <div
                class="origin-right rounded border border-green px-4 py-2 shadow-lg transition-transform hover:scale-105 active:-translate-x-1 active:translate-y-1 md:w-48"
              >
                <p class="text-xs">Next →</p>
                <p class="text-sm md:text-base">
                  {neighbors.next.title}
                </p>
              </div>
            </a>
          {/if}
        </nav>
      {/if}
    </article>
  </div>
</div>
