<script lang="ts">
  // `Highlight` postdates the browser globals eslint 8's `env: browser` knows
  // about; it is in the DOM lib TypeScript checks against.
  /* global Highlight */
  import { page } from "$app/state";
  import { highlightRanges, parseQuery } from "$lib/search";
  import { flatten, locate } from "$lib/search_highlight";
  import { tick } from "svelte";

  let { target }: { target: HTMLElement | null } = $props();

  const NAME = "search-hit";
  // `figure.svelte` renders an `<img>` with no width or height on it, so the
  // browser cannot reserve its box: every figure above the match moves the match
  // down at the moment it decodes, which on a cold load is after this has aimed
  // at it. One correction once the layout has settled — a no-op if nothing did.
  const SETTLE_MS = 700;

  let query = $derived(page.url.searchParams.get("q")?.trim() ?? "");
  let count = $state(0);

  /** Every text node under `target`, in document order. */
  function textNodes(root: HTMLElement): Text[] {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) =>
        node.parentElement?.closest("script, style, button")
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT,
    });
    const nodes: Text[] = [];
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      nodes.push(node as Text);
    }
    return nodes;
  }

  function build(root: HTMLElement, search: string): Range[] {
    const nodes = textNodes(root);
    const flat = flatten(nodes.map((node) => node.data));
    const clauses = parseQuery(search).groups.flat();
    return highlightRanges(flat.text, clauses).map(([from, to]) => {
      const start = locate(flat, from, "start");
      const end = locate(flat, to, "end");
      const range = document.createRange();
      range.setStart(nodes[start.piece], start.offset);
      range.setEnd(nodes[end.piece], end.offset);
      return range;
    });
  }

  /**
   * The match to scroll to: the first one at or inside the section the reader
   * was sent to, and otherwise the first on the page.
   *
   * The page does not scroll itself. A heading's id comes from
   * `slugify(slotValue)` in `h2.svelte`, which needs the element bound before it
   * has a value, so the ids do not exist when the browser processes the fragment
   * — which is why `prerender.handleMissingId` is set to ignore. This runs after
   * hydration, when they do.
   */
  function firstAfterAnchor(root: HTMLElement, ranges: Range[]): Range {
    const hash = decodeURIComponent(page.url.hash.slice(1));
    const anchor = hash
      ? root.querySelector(`[id="${CSS.escape(hash)}"]`)
      : null;
    if (!anchor) return ranges[0];
    const below =
      Node.DOCUMENT_POSITION_FOLLOWING | Node.DOCUMENT_POSITION_CONTAINED_BY;
    return (
      ranges.find(
        (range) => anchor.compareDocumentPosition(range.startContainer) & below,
      ) ?? ranges[0]
    );
  }

  function scrollTo(range: Range) {
    const box = range.getBoundingClientRect();
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({
      top: window.scrollY + box.top + box.height / 2 - window.innerHeight / 2,
      behavior: reduced ? "auto" : "smooth",
    });
  }

  $effect(() => {
    // Re-read on every navigation: the same page with a different `q`, or the
    // same `q` on a different page, are both a new set of matches.
    const root = target;
    const search = query;
    if (!root || !search) {
      count = 0;
      return;
    }

    let live = true;
    let settle: ReturnType<typeof setTimeout>;
    (async () => {
      // Headings get their ids during hydration, and the content has to be in
      // the DOM before there is anything to walk.
      await tick();
      if (!live) return;
      const ranges = build(root, search);
      count = ranges.length;
      if (!ranges.length) return;
      // Painting the ranges rather than wrapping them: nothing in the page is
      // modified, so there is nothing to put back, and Svelte still owns every
      // node it rendered.
      if (typeof CSS !== "undefined" && CSS.highlights) {
        CSS.highlights.set(NAME, new Highlight(...ranges));
      }
      // The banner renders from `count`, above the content, and pushes it down.
      // Measuring before it lands would aim at where the match used to be.
      await tick();
      if (!live) return;
      const found = firstAfterAnchor(root, ranges);
      scrollTo(found);
      settle = setTimeout(() => live && scrollTo(found), SETTLE_MS);
    })();

    return () => {
      live = false;
      clearTimeout(settle);
      if (typeof CSS !== "undefined" && CSS.highlights)
        CSS.highlights.delete(NAME);
    };
  });
</script>

{#if query}
  <p
    class="search-banner my-2 rounded border border-purple px-2 py-1 text-sm"
    aria-live="polite"
  >
    {#if count}
      {count}
      {count === 1 ? "match" : "matches"} for
    {:else}
      No matches on this page for
    {/if}
    <strong>{query}</strong> ·
    <a href={page.url.pathname}>Clear</a> ·
    <a href="/docs/search?q={encodeURIComponent(query)}">All results</a>
  </p>
{/if}
