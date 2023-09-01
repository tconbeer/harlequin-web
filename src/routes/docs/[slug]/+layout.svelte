<script lang="ts">
  import type { LayoutData } from "./$types";
  import { page } from "$app/stores";
  import chevron from "$lib/assets/icons/icons8-chevron-50.png";
  let showMenu = false;
  function toggleMenu() {
    showMenu = !showMenu;
  }
  $: activeSlug = $page.url.pathname.split("/").at(-1);
  const activeStyle = "bg-purple font-bold";
  $: otherStyle = showMenu ? "block" : "hidden";

  export let data: LayoutData;
</script>

<div class="mt-6 flex w-full flex-wrap overflow-x-auto">
  <nav class="w-full md:w-1/4">
    <ul>
      {#each data.pages as docPage}
        <a href={docPage.slug} on:click={toggleMenu} on:keypress={toggleMenu}
          ><li
            class="mt-1 flex justify-between rounded px-1 py-1 md:mb-1 {docPage.slug ==
            activeSlug
              ? activeStyle
              : otherStyle} md:block md:hover:bg-green"
          >
            <div>
              {docPage.title}
            </div>
            <div
              class="my-auto mr-2 md:hidden {docPage.slug == activeSlug
                ? 'block'
                : 'hidden'}"
            >
              <img
                src={chevron}
                class="h-4 w-4 {showMenu ? '' : 'rotate-180'}"
                alt="Chevron"
              />
            </div>
          </li></a
        >
      {/each}
    </ul>
  </nav>
  <div class="mt-4 w-full overflow-x-auto md:mt-0 md:w-3/4">
    <div class="md:ml-4"><slot /></div>
  </div>
</div>
