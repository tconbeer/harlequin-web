/**
 * The corpus at /llms-full.txt.
 *
 * One assertion here is load-bearing: for every page, these bytes and the bytes
 * at `/docs/{slug}.md` are the same bytes. Two views of one corpus is the whole
 * design; the moment they disagree, one of them is a second sanitizer, and the
 * reader that gets the wrong answer has no way to tell.
 */

import { buildCorpus } from "$lib/server/docs";
import { describe, expect, it } from "vitest";
import { GET as page } from "../docs/[...slug].md/+server";
import { GET, prerender } from "./+server";

const corpus = buildCorpus();
const full = await GET().text();

type Event = Parameters<typeof page>[0];

describe("the file", () => {
  it("is prerendered", () => {
    expect(prerender).toBe(true);
  });

  it("says it is text, and lets a browser read it", async () => {
    const response = GET();
    expect(response.headers.get("Content-Type")).toBe(
      "text/plain; charset=utf-8",
    );
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(await response.text()).toBe(full);
  });

  it("opens with the heading, the summary, and the way back to the index", () => {
    expect(full.startsWith("# Harlequin Documentation\n\n> ")).toBe(true);
    expect(full).toContain("https://harlequin.sh/llms.txt");
  });

  it("separates the preamble and the pages with a rule", () => {
    expect(full.split("\n\n---\n\n")).toHaveLength(corpus.length + 1);
  });

  it("ends with a newline, like a text file should", () => {
    expect(full.endsWith("\n")).toBe(true);
    expect(full.endsWith("\n\n")).toBe(false);
  });
});

describe("every page", () => {
  it.each(corpus.map((entry) => [entry.slug, entry] as const))(
    "%s appears under its canonical URL",
    (_slug, entry) => {
      expect(full).toContain(`Source: ${entry.url}\n\n${entry.markdown}`);
    },
  );

  it.each(corpus.map((entry) => [entry.slug, entry] as const))(
    "%s is byte for byte what /docs/%s.md serves",
    async (slug, entry) => {
      const response = await page({ params: { slug } } as unknown as Event);
      const served = await response.text();
      expect(served).toBe(entry.markdown);
      expect(full).toContain(served);
    },
  );

  it("is here, and nothing else is", () => {
    const sources = [...full.matchAll(/^Source: (.*)$/gm)].map(
      (match) => match[1],
    );
    expect(sources).toEqual(corpus.map((entry) => entry.url));
  });
});
