/**
 * Mapping a match back onto the rendered page.
 *
 * A docs page is a compiled mdsvex component, and its text reaches the styled
 * element components as slot content — `src/mdsvex/components/p.svelte` is
 * `<p class="mb-2"><slot /></p>`. A slot is renderable but not readable: there
 * is no way to pull the string out, split it on the matches and render the
 * pieces back. (`h2.svelte` hit the same wall computing its own id, and answers
 * it the same way, by reading the DOM.) So highlighting starts from the rendered
 * text nodes rather than from any data Svelte holds.
 *
 * What it does *not* do is rewrite them. `search_highlight.svelte` builds
 * `Range`s over the nodes as they are and hands them to `CSS.highlights`, so
 * Svelte's DOM is never touched and there is nothing to unwind afterwards. A
 * range may also span element boundaries, which a `<mark>` wrapped around one
 * text node could not: "the `--limit` flag" highlights as one phrase.
 *
 * This module is the part of that with no DOM in it — flattening the text nodes
 * into one string and mapping an offset in that string back to the node it came
 * from — so it can be tested without one.
 */

/** Every text node's contents, joined, and where each one starts in the join. */
export type FlatText = {
  text: string;
  pieces: string[];
  starts: number[];
};

/** Where an offset in the flat text lands: which piece, and how far into it. */
export type Placement = { piece: number; offset: number };

// Text nodes are joined with a newline rather than butted together, so that the
// end of one paragraph and the start of the next cannot read as one word. A
// newline is not a token character, so no match can straddle one and no offset
// can land inside one.
const SEPARATOR = "\n";

export function flatten(pieces: string[]): FlatText {
  const starts: number[] = [];
  let at = 0;
  for (const piece of pieces) {
    starts.push(at);
    at += piece.length + SEPARATOR.length;
  }
  return { text: pieces.join(SEPARATOR), pieces, starts };
}

/**
 * `edge` is which end of a range is being placed. A range's end offset is
 * exclusive, so it belongs to the piece holding the character before it — at a
 * piece boundary, that is the piece that just ended rather than the one about
 * to begin.
 */
export function locate(
  flat: FlatText,
  offset: number,
  edge: "start" | "end",
): Placement {
  const target = edge === "end" ? Math.max(0, offset - 1) : offset;
  let lo = 0;
  let hi = flat.starts.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (flat.starts[mid] <= target) lo = mid;
    else hi = mid - 1;
  }
  return {
    piece: lo,
    offset: Math.min(offset - flat.starts[lo], flat.pieces[lo].length),
  };
}
