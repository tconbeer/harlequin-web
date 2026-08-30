/**
 * One page, as JSON.
 *
 * The sanitizer has its own tests; what belongs here is what is true of the
 * route. Two things: every page in the index has a page route behind it, and
 * the markdown in it is the corpus byte for byte — the same property the `.md`
 * route and `llms-full.txt` are held to, because the moment any of the three
 * differs for a page, one of them is a second sanitizer.
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
  it("are every page, so a page cannot ship missing from the API", () => {
    expect(entries()).toEqual(docsPages.map((page) => ({ slug: page.slug })));
  });

  it("are prerendered", () => {
    expect(prerender).toBe(true);
  });
});

describe("a page", () => {
  it("says it is JSON, and lets a browser read it", async () => {
    const response = await get("getting-started/hsql");
    expect(response.headers.get("Content-Type")).toBe("application/json");
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });

  it("carries what the page is, and where it is rendered", async () => {
    const body = await (await get("duckdb/motherduck")).json();
    expect(body).toMatchObject({
      version: 1,
      title: "MotherDuck",
      topic: "Adapter: DuckDB",
      slug: "duckdb/motherduck",
      url: "https://harlequin.sh/docs/duckdb/motherduck",
    });
    expect(body.description).toBeTruthy();
  });

  it.each(corpus.map((page) => [page.slug, page] as const))(
    "%s is the corpus, byte for byte",
    async (slug, page) => {
      const response = await get(slug);
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.markdown).toBe(page.markdown);
      expect(body.title).toBe(page.title);
      expect(body.topic).toBe(page.topic);
      expect(body.url).toBe(page.url);
      expect(body.description).toBe(page.description);
    },
  );
});

describe("a slug the corpus does not have", () => {
  it("is a 404, not an empty page that claims to be one", async () => {
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
    // the collapsed slug — so duckdb/index is not a second spelling of duckdb,
    // it is nothing.
    await expect(get("duckdb/index")).rejects.toBeDefined();
  });
});
