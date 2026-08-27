<script lang="ts">
  import { page } from "$app/state";
  import chevron from "$lib/assets/icons/icons8-chevron-50.png";
  import { docsMenu, docsNeighbors, isTopic } from "$lib/docs_menu";
  import { SvelteSet } from "svelte/reactivity";

  let { children } = $props();

  // "/docs/duckdb/motherduck" -> slug "duckdb/motherduck", topic "duckdb".
  const slugOf = (pathname: string) => pathname.split("/docs/").at(-1) ?? "";
  const topicOf = (slug: string) => slug.split("/").at(0) ?? "";

  let activeSlug = $derived(slugOf(page.url.pathname));
  let activeTopic = $derived(topicOf(activeSlug));
  let neighbors = $derived(docsNeighbors(activeSlug));

  // Topics are collapsed by default. The one holding the current page opens
  // itself — seeded here, not only in the effect below, so the server renders
  // it open too — and any the reader opens by hand stay open while they browse.
  let openTopics = $state(
    new SvelteSet<string>([topicOf(slugOf(page.url.pathname))]),
  );
  $effect(() => {
    openTopics.add(activeTopic);
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

  // The menu is taller than the viewport, so on a deep page (troubleshooting,
  // contributing) the current entry would start out scrolled past. Nudge the
  // nav's own scroll — never the window's — to bring it into view.
  let navEl: HTMLElement | undefined = $state();
  $effect(() => {
    activeSlug;
    // Re-runs once the effect above has expanded the topic, so the entry is
    // measured after it is on screen rather than while it is still collapsed.
    openTopics.has(activeTopic);
    if (!navEl || navEl.scrollHeight <= navEl.clientHeight) return;
    const active = navEl.querySelector('[aria-current="page"]');
    if (!active) return;
    const navBox = navEl.getBoundingClientRect();
    const activeBox = active.getBoundingClientRect();
    if (!activeBox.height) return;
    if (activeBox.top < navBox.top || activeBox.bottom > navBox.bottom) {
      navEl.scrollTop += activeBox.top - navBox.top - navBox.height / 3;
    }
  });

  const linkStyle =
    "mt-1 flex justify-between rounded px-1 py-1 transition-colors duration-200 md:mb-1 md:hover:bg-green";
  const activeStyle = "bg-purple font-bold";
</script>

<div class="mt-6 flex w-full flex-wrap">
  <nav
    bind:this={navEl}
    aria-label="Documentation"
    class="w-full md:sticky md:top-4 md:max-h-[calc(100vh_-_3rem)] md:w-1/4 md:self-start md:overflow-y-auto md:pr-2"
  >
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
        <li>
          {#if isTopic(item)}
            <div
              class="mt-1 flex rounded px-1 py-1 transition-colors duration-200 md:mb-1 md:hover:bg-green {item.slug ==
              activeTopic
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
              {#each item.pages as subPage (subPage.slug)}
                <li>
                  <a
                    href="/docs/{subPage.slug}"
                    aria-current={subPage.slug == activeSlug
                      ? "page"
                      : undefined}
                    class="{linkStyle} {subPage.slug == activeSlug
                      ? activeStyle
                      : ''}">{subPage.title}</a
                  >
                </li>
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
      {/each}
    </ul>
  </nav>
  <!-- min-w-0 lets the overflow-x-auto here actually bite: a flex item will not
       shrink below its content otherwise, so a wide code block would stretch
       the column instead of scrolling inside it. -->
  <div class="mt-4 w-full min-w-0 overflow-x-auto md:mt-0 md:w-3/4">
    <article class="md:ml-4">
      {@render children()}
      <nav class="mb-4 flex justify-between gap-4 md:gap-8" aria-label="Pager">
        {#if neighbors.prev}
          <a href="/docs/{neighbors.prev.slug}" rel="prev">
            <div
              class="rounded border border-green px-4 py-2 shadow-lg transition-transform hover:scale-105 active:translate-x-1 active:translate-y-1 md:w-48"
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
              class="rounded border border-green px-4 py-2 shadow-lg transition-transform hover:scale-105 active:translate-x-1 active:translate-y-1 md:w-48"
            >
              <p class="text-xs">Next →</p>
              <p class="text-sm md:text-base">
                {neighbors.next.title}
              </p>
            </div>
          </a>
        {/if}
      </nav>
    </article>
  </div>
</div>
