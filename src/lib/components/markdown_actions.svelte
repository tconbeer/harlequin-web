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

  let status: "idle" | "copied" | "failed" = $state("idle");
  let restore: ReturnType<typeof setTimeout> | undefined;
  const label = $derived(
    { idle: "Copy as Markdown", copied: "Copied!", failed: "Copy failed" }[
      status
    ],
  );

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

  const buttonStyle =
    "flex items-center gap-1 rounded border border-green px-2 py-1 shadow transition-transform hover:scale-105 active:translate-x-1 active:translate-y-1";
</script>

<div class="my-2 flex flex-wrap items-center gap-2 text-sm">
  <button onclick={copy} class={buttonStyle}>
    <img class="h-4 w-4" src={status === "copied" ? check : clippy} alt="" />
    <span aria-live="polite">{label}</span>
  </button>
  <!-- A server route, not a page: the client router has nothing to render for
       it, so the link is a browser navigation. -->
  <a {href} class={buttonStyle} data-sveltekit-reload>View as Markdown</a>
</div>
