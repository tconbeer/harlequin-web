<script lang="ts">
  import check from "$lib/assets/icons/icons8-check-50.png";
  import clippy from "$lib/assets/icons/icons8-clipboard-48.png";
  import { markdownHeader, markdownPath } from "$lib/markdown_actions";

  let {
    slug,
    title,
    canonical,
  }: { slug: string; title: string; canonical: string } = $props();

  const href = $derived(markdownPath(slug));

  const labels = {
    idle: "Copy as Markdown",
    copied: "Copied!",
    failed: "Copy failed",
  };
  let status: keyof typeof labels = $state("idle");
  let restore: ReturnType<typeof setTimeout> | undefined;

  // The markdown comes from the page's own `.md` twin rather than from anything
  // rebuilt here: one sanitizer, and the bytes a reader pastes are the bytes an
  // agent would have fetched.
  async function copy() {
    try {
      const response = await fetch(href);
      if (!response.ok) throw new Error(`${href} answered ${response.status}`);
      const markdown = await response.text();
      await navigator.clipboard.writeText(
        markdownHeader(title, canonical) + markdown,
      );
      status = "copied";
    } catch {
      // A fetch that 404s and a clipboard the browser refuses are the same
      // thing to a reader: nothing was copied, and the button has to say so
      // rather than flash a check over an empty clipboard.
      status = "failed";
    }
    clearTimeout(restore);
    restore = setTimeout(() => (status = "idle"), 2000);
  }

  // Colour, not movement, for the hover cue, and the same green the sidebar
  // links and the code-block copy button use. The site's pager cards grow on
  // hover instead, but they are centred in the column and these sit flush with
  // its left edge under `md`, inside an `overflow-x-auto` that clips: a 5% grow
  // about the centre puts the left border ~4px outside the scroller, where it
  // is not merely scrolled off but gone. The code-block copy button is the
  // nearer precedent anyway — a small inline control that lights up rather than
  // moves, and answers a press by changing its icon rather than its colour.
  //
  // Only where a pointer can actually hover. A touch device applies `:hover` on
  // a tap and holds it until something else is tapped, so an unguarded hover
  // fill is a button that lights up when a reader copies a page and stays lit
  // for as long as they read it. The label and the icon are the feedback a tap
  // gets, and they clear themselves.
  const buttonStyle =
    "flex items-center gap-1 rounded border border-green px-2 py-1 shadow transition-colors duration-200 [@media(hover:hover)]:hover:bg-green";
</script>

<div class="my-2 flex flex-wrap items-center gap-2 text-sm">
  <button onclick={copy} class={buttonStyle}>
    <img
      class="h-4 w-4 flex-none"
      src={status === "copied" ? check : clippy}
      alt=""
    />
    <!-- The label changes; the width must not. "Copied!" is half the width of
         "Copy as Markdown", and a narrower button is a narrower row — one that
         fits beside the title where the wide one wrapped under it, so the click
         that changes the label throws the button across the column and the
         reset two seconds later throws it back. Every label is rendered, one
         over another, and all but the live one are `invisible`: the box is as
         wide as the widest of them whatever it currently says. -->
    <span class="grid" aria-live="polite">
      {#each Object.entries(labels) as [key, text] (key)}
        <span
          class="col-start-1 row-start-1 text-left {key === status
            ? ''
            : 'invisible'}">{text}</span
        >
      {/each}
    </span>
  </button>
  <!-- A server route, not a page: the client router has nothing to render for
       it, so the link is a browser navigation. -->
  <a {href} class={buttonStyle} data-sveltekit-reload>View as Markdown</a>
</div>
