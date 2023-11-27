<script lang="ts">
  import type { LayoutData } from "../$types";
  import type { DocsPage } from "$lib/types";
  import { page } from "$app/stores";
  import chevron from "$lib/assets/icons/icons8-chevron-50.png";
  let showMenu = false;
  function toggleMenu() {
    showMenu = !showMenu;
  }
  $: activeSlug = $page.url.pathname.split("/docs/").at(-1);
  $: activeTopic = activeSlug?.split("/").at(0);
  const activeStyle = "bg-purple font-bold flex";
  $: topicPageStyle = showMenu ? "flex" : "hidden md:flex";
  $: nestedStyle = showMenu ? "flex" : "hidden md:flex";

  function topic(docPage: DocsPage) {
    return docPage.slug.split("/").at(0);
  }
  function isTopicPage(docPage: DocsPage) {
    //  show all topic pages
    if (!docPage.slug.includes("/")) {
      return true;
    }
    // show pages called "index.md"
    else if (docPage.slug.endsWith("index")) {
      return true;
    }
    return false;
  }
  function hasNestedPages(docPage: DocsPage) {
    if (docPage.slug.endsWith("index")) {
      return true;
    }
    return false;
  }

  export let data: LayoutData;
  let activeIndex = 0;
  $: for (const [i, pg] of data.pages.entries()) {
    if (pg.slug == activeSlug) {
      activeIndex = i;
    }
  }
</script>

<div class="mt-6 flex w-full flex-wrap overflow-x-auto">
  <nav class="w-full md:w-1/4">
    <ul>
      {#each data.pages as docPage}
        <a
          href="/docs/{docPage.slug}"
          on:click={toggleMenu}
          on:keypress={toggleMenu}
          ><li
            class="mt-1 justify-between rounded px-1 py-1 md:mb-1 {docPage.slug ==
            activeSlug
              ? activeStyle
              : isTopicPage(docPage)
              ? topicPageStyle
              : topic(docPage) == activeTopic
              ? nestedStyle
              : 'hidden'} {!isTopicPage(docPage)
              ? 'pl-4'
              : ''} transition-colors duration-200 md:hover:bg-green"
          >
            <div>
              {docPage.title}
            </div>
            <div
              class="my-auto mr-2 {hasNestedPages(docPage)
                ? 'block'
                : docPage.slug == activeSlug
                ? 'md:hidden'
                : 'hidden'}"
            >
              <img
                src={chevron}
                class="h-4 w-4 {hasNestedPages(docPage) &&
                topic(docPage) == activeTopic
                  ? 'rotate-180'
                  : hasNestedPages(docPage)
                  ? 'rotate-90'
                  : showMenu
                  ? ''
                  : 'rotate-180'} transition-transform duration-700"
                alt="Chevron"
              />
            </div>
          </li></a
        >
      {/each}
    </ul>
  </nav>
  <div class="mt-4 w-full overflow-x-auto md:mt-0 md:w-3/4">
    <article class="md:ml-4">
      <slot />
      <nav class="mb-4 flex justify-center gap-4 md:gap-8">
        {#if data.pages && activeIndex > 0}
          <a href="/docs/{data.pages[activeIndex - 1].slug}">
            <div
              class="rounded border border-green px-4 py-2 shadow-lg transition-transform hover:scale-105 active:translate-x-1 active:translate-y-1 md:w-48"
            >
              <p class="text-xs">Previous:</p>
              <p class="text-sm md:text-base">
                {data.pages[activeIndex - 1].title}
              </p>
            </div>
          </a>
        {/if}
        {#if data.pages && activeIndex < data.pages.length - 1}
          <a href="/docs/{data.pages[activeIndex + 1].slug}">
            <div
              class="rounded border border-green px-4 py-2 shadow-lg transition-transform hover:scale-105 active:translate-x-1 active:translate-y-1 md:w-48"
            >
              <p class="text-xs">Next:</p>
              <p class="text-sm md:text-base">
                {data.pages[activeIndex + 1].title}
              </p>
            </div>
          </a>
        {/if}
      </nav>
    </article>
  </div>
</div>
