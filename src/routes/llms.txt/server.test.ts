/**
 * The index at /llms.txt.
 *
 * The property that matters is completeness: an agent that reads this file and
 * then stops has read the whole map, so a page missing from it is a page that,
 * for that reader, does not exist. Everything else here is the shape the
 * convention asks for — one H1, a blockquote summary, `##` sections of links —
 * checked because a file with no schema and no parser is a file nothing else
 * would notice going wrong.
 */

import { buildCorpus } from "$lib/server/docs";
import { describe, expect, it } from "vitest";
import { GET, prerender } from "./+server";

const corpus = buildCorpus();
const index = await GET().text();
const rows = index.split("\n").filter((line) => line.startsWith("- ["));

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
    expect(await response.text()).toBe(index);
  });

  it("opens the way llmstxt.org says: one H1, then a blockquote", () => {
    const [heading, blank, summary] = index.split("\n");
    expect(heading).toBe("# Harlequin");
    expect(blank).toBe("");
    expect(summary.startsWith("> ")).toBe(true);
    expect(index.match(/^# /gm)).toHaveLength(1);
  });

  it("points at the corpus, the JSON index and the schema", () => {
    for (const path of [
      "/llms-full.txt",
      "/api/docs/v1",
      "/schemas/config/v1.json",
    ]) {
      expect(index).toContain(`https://harlequin.sh${path}`);
    }
  });
});

describe("the rows", () => {
  it("are exactly the pages of the corpus, one each", () => {
    // Grouping is what reorders them: the sidebar interleaves top-level pages
    // with topics, and a `##` section gathers each group in one place. Within a
    // section the order is the sidebar's, which the section test below checks.
    expect(rows).toHaveLength(corpus.length);
    expect(rows.map((line) => /\]\((\S+)\)/.exec(line)?.[1]).sort()).toEqual(
      corpus.map((page) => `${page.url}.md`).sort(),
    );
  });

  it("link to markdown, which is the point of the index", () => {
    for (const line of rows) expect(line).toMatch(/\]\(https:\/\/\S+\.md\)/);
  });

  it("carry each page's title and description", () => {
    for (const page of corpus) {
      expect(index).toContain(
        `- [${page.title}](${page.url}.md): ${page.description}`,
      );
    }
  });

  it("give every page a description to be listed with", () => {
    // Not a property of this route — `describe()` in the sanitizer derives one
    // when the frontmatter has none — but this is where a blank one is felt, so
    // this is where it fails.
    expect(corpus.filter((page) => !page.description)).toEqual([]);
  });
});

describe("the sections", () => {
  const headings = [...index.matchAll(/^## (.*)$/gm)].map((match) => match[1]);

  it("name every topic once, and nothing twice", () => {
    expect(new Set(headings).size).toBe(headings.length);
    const topics = new Set(
      corpus.map((page) => page.topic).filter((topic) => topic !== null),
    );
    expect(headings).toEqual(expect.arrayContaining([...topics]));
  });

  it("keep sidebar order inside each one", () => {
    const order = new Map(corpus.map((page, i) => [`${page.url}.md`, i]));
    for (const [, section] of index.matchAll(/^## .*$\n\n((?:- .*\n)+)/gm)) {
      const positions = section
        .trimEnd()
        .split("\n")
        .map(
          (line) => order.get(/\]\((\S+)\)/.exec(line)?.[1] ?? "") as number,
        );
      expect(positions).toEqual([...positions].sort((a, b) => a - b));
    }
  });

  it("hold every row, so no page is listed above the first heading", () => {
    const first = index.indexOf("\n## ");
    expect(index.slice(0, first)).not.toContain("\n- [");
  });

  it("gather the pages that sit in no topic under one heading", () => {
    expect(headings).toContain("Other Topics");
    const ungrouped = corpus.filter((page) => page.topic === null);
    expect(ungrouped.length).toBeGreaterThan(0);
    const section = /^## Other Topics$\n\n((?:- .*\n)+)/m.exec(index)?.[1];
    expect(section?.trimEnd().split("\n")).toHaveLength(ungrouped.length);
  });
});
