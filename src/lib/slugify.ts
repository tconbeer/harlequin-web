/**
 * The id a heading answers to.
 *
 * `slugify` is what `src/mdsvex/components/h2.svelte` and its siblings call: they
 * bind a span around their own children and hand the element over, because a
 * Svelte slot is renderable but not readable and the text is not available any
 * other way.
 *
 * `slugifyText` is the same rule over a string, for callers that have the text
 * already — the search index, which has to name the anchor a heading *will*
 * render before any of it is in a DOM. One function, because an index that links
 * to `#config-file` and a heading that answers to `#configfile` fail silently.
 */

export function slugifyText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, "-")
    .trim();
}

export function slugify(element: HTMLElement) {
  if (element === undefined) {
    return "";
  } else {
    return slugifyText(String(element.innerText));
  }
}
