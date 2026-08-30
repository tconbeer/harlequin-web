/**
 * The docs lint.
 *
 * `docs.test.ts` says each of the sanitizer's rewrites is right on a source
 * written to exercise it. This says nothing is wrong with any of the 55 real
 * pages, and — the part that matters — with the ones written after this was
 * committed. It runs over the sanitized corpus rather than over the sources,
 * because the corpus is what gets published, and a construct the sanitizer
 * handles is not a defect in the source.
 *
 * Everything here failed on `main` at some point in M3. That is the argument
 * for it: none of it was caught by a human reading the page, because a `&lbrace`
 * in a JSON example and a link that 404s are exactly what a human eye slides
 * over and a machine trips on.
 */

import { docsPages } from "$lib/docs_menu";
import { describe, expect, it } from "vitest";
import { buildCorpus } from "./docs";

const corpus = buildCorpus();

/** The page, with fenced blocks and inline spans removed. */
function prose(markdown: string): string {
  return markdown
    .replace(/^\s*```[\s\S]*?^\s*```\s*$/gm, "")
    .replace(/(`+)(?:(?!\1).)+?\1/g, "");
}

/** Every link target in a page, images included and `(<…>)` unwrapped. */
function targets(markdown: string): string[] {
  return [...markdown.matchAll(/!?\[[^\]]*\]\((<[^>]*>|[^)\s]+)/g)].map(
    (match) => match[1].replace(/^<(.*)>$/, "$1"),
  );
}

describe("every sanitized page", () => {
  it.each(corpus.map((page) => [page.slug, page] as const))(
    "%s has no Svelte component left in it",
    (slug, page) => {
      expect(prose(page.markdown).match(/<[A-Z][\w-]*/g), slug).toBeNull();
    },
  );

  it.each(corpus.map((page) => [page.slug, page] as const))(
    "%s has no HTML tag left in it",
    (slug, page) => {
      expect(
        prose(page.markdown).match(/<\/?[a-z][\w-]*(?=[\s/>])[^>]*>/g),
        slug,
      ).toBeNull();
    },
  );

  it.each(corpus.map((page) => [page.slug, page] as const))(
    "%s has no unresolved {identifier}",
    (slug, page) => {
      expect(prose(page.markdown).match(/\{[^{}\n]*\}/g), slug).toBeNull();
    },
  );

  it.each(corpus.map((page) => [page.slug, page] as const))(
    "%s has no escaped brace",
    (slug, page) => {
      // Not restricted to prose: the escapes this fixes are inside code fences,
      // which is where an agent reads them and copies them out.
      expect(page.markdown, slug).not.toMatch(/&[lr]brace/);
    },
  );

  it.each(corpus.map((page) => [page.slug, page] as const))(
    "%s has no relative link",
    (slug, page) => {
      const relative = targets(page.markdown).filter(
        (target) => !/^(?:[a-z][a-z0-9+.-]*:|#)/i.test(target),
      );
      expect(relative, slug).toEqual([]);
    },
  );

  it.each(corpus.map((page) => [page.slug, page] as const))(
    "%s uses the site-private output fence nowhere",
    (slug, page) => {
      expect(page.markdown, slug).not.toMatch(/^\s*```output\s*$/m);
    },
  );
});

describe("every description", () => {
  // The row an agent reads in `llms.txt` before it decides which page to fetch.
  // It is one line there, so it has to be one line here, and long enough to say
  // something: a page whose first sentence is an attribution or a greeting gets
  // a `description` in its frontmatter, which is what this fails on.
  const LIMIT = 160;

  it.each(corpus.map((page) => [page.slug, page] as const))(
    "%s has one",
    (slug, page) => {
      expect(page.description.trim(), slug).not.toBe("");
    },
  );

  it.each(corpus.map((page) => [page.slug, page] as const))(
    "%s fits on a line",
    (slug, page) => {
      expect(page.description, slug).not.toContain("\n");
      expect(page.description.length, slug).toBeLessThanOrEqual(LIMIT);
    },
  );
});

describe("links between pages", () => {
  const slugs = new Set(corpus.map((page) => page.slug));

  it("all resolve to a page the corpus contains", () => {
    const broken: string[] = [];
    for (const page of corpus) {
      for (const target of targets(page.markdown)) {
        const match = /^https:\/\/harlequin\.sh\/docs\/([^#?]*)/.exec(target);
        if (match && !slugs.has(match[1].replace(/\/$/, ""))) {
          broken.push(`${page.slug}: ${target}`);
        }
      }
    }
    expect(broken).toEqual([]);
  });

  it("point at the canonical URL, with no /index on the end", () => {
    for (const page of corpus) {
      for (const target of targets(page.markdown)) {
        expect(target, page.slug).not.toMatch(
          /^https:\/\/harlequin\.sh\/docs\/.*\/index/,
        );
      }
    }
  });
});

describe("the corpus and the menu", () => {
  it("hold the same pages, in the same order", () => {
    expect(corpus.map((page) => page.slug)).toEqual(
      docsPages.map((page) => page.slug),
    );
  });

  it("cover every markdown file under src/docs", () => {
    const onDisk = Object.keys(import.meta.glob("/src/docs/**/*.md"))
      .map((path) =>
        path.slice("/src/docs/".length, -".md".length).replace(/\/index$/, ""),
      )
      .sort();
    expect([...corpus.map((page) => page.slug)].sort()).toEqual(onDisk);
  });
});
