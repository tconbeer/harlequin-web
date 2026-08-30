/**
 * The raw markdown route.
 *
 * The sanitizer has its own tests; this covers the two things that are true of
 * the route rather than of the corpus — that every page has a `.md` twin, and
 * that the twin is the corpus byte for byte. The second is the property that
 * matters as the other consumers land: the moment this route's bytes and
 * `llms-full.txt`'s bytes differ for a page, one of them is a second sanitizer.
 */

import { docsPages } from "$lib/docs_menu";
import { buildCorpus } from "$lib/server/docs";
import type { HttpError } from "@sveltejs/kit";
import { describe, expect, it } from "vitest";
import { GET, entries, prerender } from "./+server";

const corpus = buildCorpus();

type Event = Parameters<typeof GET>[0];

// `async` so that a slug the corpus does not have rejects rather than throwing
// out of the call itself; `error()` is a throw, and both spellings are the same
// 404 to a reader.
async function get(slug: string): Promise<Response> {
  return GET({ params: { slug } } as unknown as Event);
}

describe("the entries", () => {
  it("are every page, so a new page cannot ship without its .md twin", () => {
    expect(entries()).toEqual(docsPages.map((page) => ({ slug: page.slug })));
  });

  it("are prerendered", () => {
    expect(prerender).toBe(true);
  });
});

describe("a page", () => {
  it("says it is markdown, and lets a browser read it", async () => {
    const response = await get("getting-started/hsql");
    expect(response.headers.get("Content-Type")).toBe(
      "text/markdown; charset=utf-8",
    );
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });

  it.each(corpus.map((page) => [page.slug, page] as const))(
    "%s is the corpus, byte for byte",
    async (slug, page) => {
      const response = await get(slug);
      expect(response.status).toBe(200);
      expect(await response.text()).toBe(page.markdown);
    },
  );
});

describe("a slug the corpus does not have", () => {
  it("is a 404, not an empty file that claims to be a page", async () => {
    let status: number | undefined;
    try {
      await get("duckdb/no-such-page");
    } catch (thrown) {
      status = (thrown as HttpError).status;
    }
    expect(status).toBe(404);
  });

  it("includes the index form of a topic, which the router redirects", async () => {
    // /docs/duckdb/index 308s to /docs/duckdb, and the corpus knows the page by
    // the collapsed slug — so /docs/duckdb/index.md is not a second spelling of
    // /docs/duckdb.md, it is nothing.
    await expect(get("duckdb/index")).rejects.toBeDefined();
  });
});
