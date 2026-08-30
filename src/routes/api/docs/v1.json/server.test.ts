/**
 * The JSON index at /api/docs/v1.json.
 *
 * Two things are worth pinning here. The first is completeness, the same
 * property `llms.txt` has: a caller that reads this and stops has read the
 * whole map, so a page missing from it is a page that, for that caller, does
 * not exist. The second is that it agrees with the other machine-readable
 * views of the corpus — a title, a topic or a description that differs between
 * this and `llms.txt` is two answers to one question.
 *
 * The route also carries the build-time checks (the menu against what is on
 * disk, and every `/docs/...` link resolving), so those are exercised by
 * calling it at all rather than by a test of their own.
 */

import { docsPages, docsTopics } from "$lib/docs_menu";
import { buildCorpus } from "$lib/server/docs";
import { describe, expect, it } from "vitest";
import { GET, prerender, type ApiIndex } from "./+server";

const corpus = buildCorpus();
const index: ApiIndex = await GET().json();

describe("the response", () => {
  it("is prerendered", () => {
    expect(prerender).toBe(true);
  });

  it("says it is JSON, and lets a browser read it", () => {
    const response = GET();
    expect(response.headers.get("Content-Type")).toBe("application/json");
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });

  it("names the version it is, and the site it describes", () => {
    expect(index.version).toBe(1);
    expect(index.site).toBe("https://harlequin.sh");
  });

  it("says where one page lives, as JSON and as markdown", () => {
    // The templates are the discovery path: a caller with a slug should not
    // have to guess a URL, and these are the two it can construct.
    expect(index.routes).toEqual({
      page: "https://harlequin.sh/api/docs/v1/{slug}.json",
      markdown: "https://harlequin.sh/docs/{slug}.md",
    });

    const page = corpus[0];
    expect(index.routes.page.replace("{slug}", page.slug)).toBe(
      `https://harlequin.sh/api/docs/v1/${page.slug}.json`,
    );
    expect(index.routes.markdown.replace("{slug}", page.slug)).toBe(
      `${page.url}.md`,
    );
  });
});

describe("the pages", () => {
  it("are every page of the corpus, in sidebar order", () => {
    expect(index.pages.map((page) => page.slug)).toEqual(
      docsPages.map((page) => page.slug),
    );
  });

  it("are the corpus's own metadata, so no consumer disagrees with another", () => {
    // The title is the page's heading rather than the sidebar's label for it,
    // which is sometimes shortened; `llms.txt` and the page route use the same
    // one, and this is where those three would drift apart.
    expect(
      index.pages.map(({ title, slug, topic, url, description }) => ({
        title,
        slug,
        topic,
        url,
        description,
      })),
    ).toEqual(
      corpus.map(({ title, slug, topic, url, description }) => ({
        title,
        slug,
        topic,
        url,
        description,
      })),
    );
  });

  it("each say enough to be chosen between without fetching one", () => {
    for (const page of index.pages) {
      expect(page.title).toBeTruthy();
      expect(page.description).toBeTruthy();
      expect(page.url).toBe(`https://harlequin.sh/docs/${page.slug}`);
    }
  });

  it("keep the repo an adapter page documents", () => {
    const bySlug = new Map(index.pages.map((page) => [page.slug, page.repo]));
    // A topic's repo reaches the pages inside it...
    expect(bySlug.get("postgres")).toBe("tconbeer/harlequin-postgres");
    // ...and a page that names its own is a page, not a topic.
    expect(bySlug.get("odbc")).toBe("tconbeer/harlequin-odbc");
    // Nothing documents the site's own pages.
    expect(bySlug.get("getting-started")).toBeNull();
  });
});

describe("the topics", () => {
  it("are the sidebar's, with the topic each nests inside", () => {
    expect(index.topics).toEqual(
      docsTopics.map(({ topic, parent }) => ({
        topic: topic.topic,
        slug: topic.slug,
        url: `https://harlequin.sh/docs/${topic.slug}`,
        parent: parent?.topic ?? null,
        repo: topic.repo ?? null,
      })),
    );
  });

  it("name a page in the index for every topic slug", () => {
    // A topic's slug is also its overview page's slug, so a caller that
    // follows a topic URL lands on a page this index lists.
    const slugs = new Set(index.pages.map((page) => page.slug));
    for (const topic of index.topics) expect(slugs.has(topic.slug)).toBe(true);
  });
});
