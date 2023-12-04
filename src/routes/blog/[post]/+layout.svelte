<div class="mt-6 w-full overflow-x-auto">
  <div class="mx-auto mt-4 w-full overflow-x-auto md:mt-0 md:w-2/3">
    <article>
      <slot />
      <!-- <nav class="mb-4 flex justify-center gap-4 md:gap-8">
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
      </nav> -->
    </article>
  </div>
</div>
