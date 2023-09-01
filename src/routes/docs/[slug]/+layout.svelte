<script>
  import { page } from "$app/stores";
  /** @type {import('./$types').LayoutData} */
  export let data;
  const active = "bg-purple font-bold";
</script>

<div class="mt-6 flex">
  <nav class="w-1/4 max-w-[160px]">
    <ul>
      {#each data.pages as docPage}
        <a href={docPage.slug}
          ><li
            class="my-1 rounded px-1 py-1 {$page.url.pathname
              .split('/')
              .at(-1) == docPage.slug
              ? active
              : ''} hover:bg-green"
          >
            {docPage.title}
          </li></a
        >
      {/each}
    </ul>
  </nav>
  <div class="ml-4 w-3/4">
    <slot />
  </div>
</div>
