/**
 * The two markdown controls, tested where they can be: the URL the link points
 * at and the button fetches, and the header a copy carries.
 *
 * The property worth guarding is that the URL is a page the raw route serves.
 * The button is one fetch away from the corpus, so a slug rule that drifts from
 * the route's does not fail a build — it fails in a browser, once, for the
 * reader who clicked it.
 */

import { docsPages } from "$lib/docs_menu";
import { buildCorpus } from "$lib/server/docs";
import { describe, expect, it } from "vitest";
import { docsSlug, markdownHeader, markdownPath } from "./markdown_actions";

const corpus = buildCorpus();

describe("the slug of the page a reader is on", () => {
  it("is the path under /docs", () => {
    expect(docsSlug("/docs/duckdb/motherduck")).toBe("duckdb/motherduck");
  });

  it("is the bare directory for a topic's index page", () => {
    expect(docsSlug("/docs/duckdb")).toBe("duckdb");
  });

  it("survives a trailing slash, which is a link away", () => {
    expect(docsSlug("/docs/duckdb/")).toBe("duckdb");
  });
});

describe("the markdown twin", () => {
  it("is the rendered slug plus .md", () => {
    expect(markdownPath("getting-started/hsql")).toBe(
      "/docs/getting-started/hsql.md",
    );
  });

  it("has no /index in it, the way the canonical URL has none", () => {
    expect(markdownPath(docsSlug("/docs/duckdb"))).toBe("/docs/duckdb.md");
  });

  it.each(corpus.map((page) => [page.slug, page.url] as const))(
    "of %s is what the raw route serves",
    (slug, url) => {
      // The reader arrives at the canonical URL; the button and the link build
      // the twin from it, and the twin has to be the entry the route prerendered.
      expect(markdownPath(docsSlug(new URL(url).pathname))).toBe(
        `/docs/${slug}.md`,
      );
    },
  );

  it("is offered on every page the sidebar lists", () => {
    expect(corpus.map((page) => page.slug)).toEqual(
      docsPages.map((page) => page.slug),
    );
  });
});

describe("a copied page", () => {
  it("carries its title and its source above the markdown", () => {
    const header = markdownHeader(
      "Using hsql",
      "https://harlequin.sh/docs/getting-started/hsql",
    );
    expect(header.split("\n").slice(0, 2)).toEqual([
      "Harlequin documentation: Using hsql",
      "Source: https://harlequin.sh/docs/getting-started/hsql",
    ]);
  });

  it("ends the header with a blank line, so the page's own heading starts one", () => {
    const page = corpus[0];
    expect(markdownHeader(page.title, page.url) + page.markdown).toContain(
      `${page.url}\n\n# ${page.title}`,
    );
  });
});
