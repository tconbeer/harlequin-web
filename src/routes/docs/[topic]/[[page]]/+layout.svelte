<script lang="ts">
  import type { DocsPage, DocsTopic } from "$lib/types";
  import { page } from "$app/state";
  import chevron from "$lib/assets/icons/icons8-chevron-50.png";
  import { SvelteSet } from "svelte/reactivity";

  let activeSlug = $derived(page.url.pathname.split("/docs/").at(-1) ?? "");
  let activeTopic = $derived(activeSlug?.split("/").at(0) ?? "");
  let openMenus = $state(new SvelteSet<string>());
  let showNav = $state(true);

  function topic(menuItem: DocsPage | DocsTopic) {
    return menuItem.slug.split("/").at(0) ?? "";
  }
  function showMenu(menuItem: DocsTopic | DocsPage) {
    const prefix = topic(menuItem);
    if (prefix) {
      return openMenus.has(prefix);
    }
    return false;
  }
  function toggleNav() {
    showNav = !showNav;
  }
  function toggleMenu(menuItem: DocsTopic) {
    if (openMenus.has(topic(menuItem))) {
      openMenus.delete(topic(menuItem));
    } else {
      openMenus.add(topic(menuItem));
    }
  }
  const activeStyle = "bg-purple font-bold rounded flex";

  function isNestedPage(menuItem: DocsPage | DocsTopic) {
    if ("topic" in menuItem) {
      return false;
    }

    if (menuItem.slug.includes("/")) {
      return true;
    }

    return false;
  }

  let { data, children } = $props();
  let { prevPage, nextPage } = $derived.by(() => {
    let prevPage: DocsPage | null = null;
    let nextPage: DocsPage | null = null;
    let foundPage = false;
    for (const [i, pg] of data.menuItems.entries()) {
      if (!("topic" in pg) && pg.slug == activeSlug) {
        foundPage = true;
      } else if (!foundPage && !("topic" in pg)) {
        prevPage = pg;
      } else if (nextPage === null && !("topic" in pg)) {
        nextPage = pg;
      }
    }
    return { prevPage, nextPage };
  });
  $effect(() => {
    openMenus.add(activeTopic);
  });

  $effect(() => {
    activeSlug;
    showNav = false;
  });
</script>

<div class="mt-6 flex w-full flex-wrap overflow-x-auto">
  <nav class="w-full md:w-1/4">
    <ul>
      <li
        class="mt-1 flex rounded bg-green px-1 py-1 transition-colors duration-200 md:hidden"
      >
        <button
          class="flex-1 text-start"
          onclick={toggleNav}
          onkeypress={toggleNav}
          >{showNav ? "Hide" : "Show"} Table of Contents</button
        >
        <div class="my-auto mr-2 block flex-none">
          <img
            src={chevron}
            class="h-4 w-4 {showNav
              ? ''
              : 'rotate-180'} transition-transform duration-700"
            alt="Chevron"
          />
        </div>
      </li>
      {#each data.menuItems as menuItem}
        {#if "topic" in menuItem}
          <li
            class="mt-1 rounded px-1 py-1 transition-colors duration-200 md:mb-1 md:flex md:hover:bg-green {showNav
              ? 'flex'
              : 'hidden'} {topic(menuItem) == activeTopic ? 'font-bold' : ''}"
          >
            <button
              class="flex-1 text-start"
              onclick={() => toggleMenu(menuItem)}
              onkeypress={() => toggleMenu(menuItem)}>{menuItem.topic}</button
            >
            <div class="my-auto mr-2 block flex-none">
              <img
                src={chevron}
                class="h-4 w-4 {showMenu(menuItem)
                  ? 'rotate-180'
                  : 'rotate-90'} transition-transform duration-700"
                alt="Chevron"
              />
            </div>
          </li>
        {:else}
          <a href="/docs/{menuItem.slug}"
            ><li
              class="mt-1 justify-between px-1 py-1 md:mb-1 {menuItem.slug ==
              activeSlug
                ? activeStyle
                : ''} {topic(menuItem) == activeTopic
                ? 'border-1 border-l border-purple'
                : ''} {showNav
                ? isNestedPage(menuItem)
                  ? showMenu(menuItem)
                    ? 'flex'
                    : 'hidden'
                  : 'flex'
                : isNestedPage(menuItem)
                  ? showMenu(menuItem)
                    ? 'hidden md:flex'
                    : 'hidden'
                  : 'hidden md:flex'} {isNestedPage(menuItem)
                ? 'pl-4'
                : ''} transition-colors duration-200 md:hover:rounded md:hover:border-green md:hover:bg-green"
            >
              <div>
                {menuItem.title}
              </div>
            </li></a
          >
        {/if}
      {/each}
    </ul>
  </nav>
  <div class="mt-4 w-full overflow-x-auto md:mt-0 md:w-3/4">
    <article class="md:ml-4">
      {@render children()}
      <nav class="mb-4 flex justify-center gap-4 md:gap-8">
        {#if prevPage}
          <a href="/docs/{prevPage.slug}">
            <div
              class="rounded border border-green px-4 py-2 shadow-lg transition-transform hover:scale-105 active:translate-x-1 active:translate-y-1 md:w-48"
            >
              <p class="text-xs">Previous:</p>
              <p class="text-sm md:text-base">
                {prevPage.title}
              </p>
            </div>
          </a>
        {/if}
        {#if nextPage}
          <a href="/docs/{nextPage.slug}">
            <div
              class="rounded border border-green px-4 py-2 shadow-lg transition-transform hover:scale-105 active:translate-x-1 active:translate-y-1 md:w-48"
            >
              <p class="text-xs">Next:</p>
              <p class="text-sm md:text-base">
                {nextPage.title}
              </p>
            </div>
          </a>
        {/if}
      </nav>
    </article>
  </div>
</div>
