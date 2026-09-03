<script lang="ts">
  import { goto } from "$app/navigation";
  import { resultHref, type SearchResult } from "$lib/search";
  import { loadEngine } from "$lib/search_client";
  import SearchExcerpt from "./search_excerpt.svelte";

  let { initial = "" }: { initial?: string } = $props();

  const HITS = 6;

  let query = $state(initial);
  let engine = $state<Awaited<ReturnType<typeof loadEngine>> | null>(null);
  let failed = $state(false);
  let open = $state(false);
  let active = $state(-1);
  let input = $state<HTMLInputElement | null>(null);

  // No debounce. A search runs against an index already in memory and costs
  // well under a millisecond, so waiting out a timer would only add lag
  // between a keystroke and the answer that was ready before it finished.
  let results = $derived<SearchResult[]>(
    engine && query.trim() ? engine.search(query, HITS) : [],
  );
  // The active row cannot outlive the list it indexes into.
  $effect(() => {
    if (active >= results.length) active = -1;
  });

  async function load() {
    if (engine) return;
    try {
      engine = await loadEngine();
      failed = false;
    } catch {
      failed = true;
    }
  }

  const allHref = $derived(
    `/docs/search?q=${encodeURIComponent(query.trim())}`,
  );
  const hrefOf = (result: SearchResult) =>
    resultHref(result.slug, query.trim(), result.best.anchor);

  function submit(event: SubmitEvent) {
    event.preventDefault();
    if (!query.trim()) return;
    open = false;
    goto(active >= 0 ? hrefOf(results[active]) : allHref);
  }

  function onkeydown(event: KeyboardEvent) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (!results.length) return;
      event.preventDefault();
      open = true;
      // Cycle over the rows *and* the unselected state, so arrowing off either
      // end puts the reader back in the box with what they typed.
      const slots = results.length + 1;
      const step = event.key === "ArrowDown" ? 1 : -1;
      active = ((active + 1 + step + slots) % slots) - 1;
    } else if (event.key === "Escape") {
      // First press dismisses the list, second clears the box: a reader who
      // hits it twice wanted out of the search, not out of the dropdown.
      if (open) open = false;
      else query = "";
      active = -1;
    }
    // Enter is the form's, and every other key is `oninput`'s. Resetting the
    // selection here would clear it on the way to submitting it.
  }

  function oninput() {
    open = true;
    active = -1;
  }

  // `/` is the shortcut every docs site has, and Cmd-K is the one every app
  // has. Neither may steal a keystroke meant for a box someone is typing in.
  function shortcut(event: KeyboardEvent) {
    const target = event.target as HTMLElement | null;
    const typing =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target?.isContentEditable;
    const slash =
      event.key === "/" && !typing && !event.metaKey && !event.ctrlKey;
    const command =
      event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey);
    if (!slash && !command) return;
    event.preventDefault();
    input?.focus();
    input?.select();
  }
</script>

<svelte:window onkeydown={shortcut} />

<div
  class="relative mb-3"
  onfocusout={(event) => {
    // Closing on blur would fire before a click on a row lands. Only close
    // when focus has left the search box and its list together.
    if (!event.currentTarget.contains(event.relatedTarget as Node))
      open = false;
  }}
>
  <!-- A real GET form: with no JavaScript, Enter still reaches the results
       page, which renders the same results from the same index. -->
  <form role="search" action="/docs/search" method="GET" onsubmit={submit}>
    <label class="sr-only" for="docs-search">Search the documentation</label>
    <input
      bind:this={input}
      bind:value={query}
      onfocus={load}
      onpointerdown={load}
      {onkeydown}
      {oninput}
      id="docs-search"
      name="q"
      type="search"
      placeholder="Search docs…"
      autocomplete="off"
      role="combobox"
      aria-expanded={open && results.length > 0}
      aria-controls="docs-search-hits"
      aria-autocomplete="list"
      aria-activedescendant={active >= 0
        ? `docs-search-hit-${active}`
        : undefined}
      class="w-full rounded border border-purple bg-transparent px-2 py-1 text-sm placeholder:text-black/50 focus:border-green focus:outline-none focus:ring-1 focus:ring-green"
    />
  </form>

  {#if open && query.trim()}
    <div
      class="absolute left-0 right-0 top-full z-20 mt-1 max-h-96 overflow-y-auto rounded border border-purple bg-yellow shadow-lg md:w-96"
    >
      <ul id="docs-search-hits" role="listbox" aria-label="Search results">
        {#each results as result, i (result.slug)}
          <li>
            <a
              id="docs-search-hit-{i}"
              role="option"
              aria-selected={i === active}
              tabindex="-1"
              href={hrefOf(result)}
              onclick={() => (open = false)}
              onpointerenter={() => (active = i)}
              class="block border-b border-purple/30 px-2 py-2 text-inherit no-underline {i ===
              active
                ? 'bg-purple'
                : ''}"
            >
              <span class="block text-sm font-bold">
                {result.title}{#if result.best.heading}<span
                    class="font-normal opacity-70"
                  >
                    · {result.best.heading}</span
                  >{/if}
              </span>
              <span class="block text-xs leading-snug opacity-80">
                <SearchExcerpt segments={result.best.excerpt} />
              </span>
            </a>
          </li>
        {/each}
        <li>
          <a
            href={allHref}
            onclick={() => (open = false)}
            tabindex="-1"
            class="block px-2 py-2 text-xs text-inherit no-underline hover:bg-green"
          >
            {#if failed}
              Search is unavailable — open the results page
            {:else if !engine}
              Loading the index…
            {:else if results.length}
              See all results for “{query.trim()}”
            {:else}
              No matches for “{query.trim()}”
            {/if}
          </a>
        </li>
      </ul>
    </div>
  {/if}
</div>
