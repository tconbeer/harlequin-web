/**
 * The index at /docs/search/index.json.
 *
 * What matters here is that the route hands over the same document
 * `buildSearchIndex()` builds, that it is a file on the CDN rather than
 * something computed per request, and that it stays small enough to fetch
 * without thinking about it. What is *in* the index is
 * `src/lib/server/search_index.test.ts`.
 */

import type { SearchIndex } from "$lib/search";
import { buildSearchIndex } from "$lib/server/search_index";
import { describe, expect, it } from "vitest";
import { GET, prerender } from "./+server";

const index: SearchIndex = await GET().json();

/** What the CDN actually sends, which is the number worth watching. */
async function gzipped(text: string): Promise<number> {
  const stream = new Blob([text])
    .stream()
    .pipeThrough(new CompressionStream("gzip"));
  return (await new Response(stream).arrayBuffer()).byteLength;
}

describe("the response", () => {
  it("is prerendered", () => {
    expect(prerender).toBe(true);
  });

  it("says it is JSON", () => {
    expect(GET().headers.get("Content-Type")).toBe("application/json");
  });

  it("is the index the builder builds", () => {
    expect(index).toEqual(buildSearchIndex());
  });

  it("is small enough to fetch on a keystroke", async () => {
    // ~83KB over the wire today. This is the number that decides whether
    // shipping the whole index is a reasonable thing to do at all.
    const wire = await gzipped(JSON.stringify(index));
    expect(wire, `${(wire / 1024) | 0}KB gzipped`).toBeLessThan(120 * 1024);
  });
});
