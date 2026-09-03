/**
 * The index, over the real corpus.
 *
 * `src/lib/search.test.ts` says the grammar and the ranking are right on pages
 * written to exercise them. This says the 71 real pages come out of the
 * splitter as sections a reader would recognise, that the postings point where
 * they claim to, and — the part that matters — that the pages written after this
 * was committed do too.
 */

import { docsPages } from "$lib/docs_menu";
import { createEngine, decodePostings, tokenize } from "$lib/search";
import { slugifyText } from "$lib/slugify";
import { describe, expect, it } from "vitest";
import { buildSearchIndex } from "./search_index";

const index = buildSearchIndex();
const engine = createEngine(index);
function sectionsOf(slug: string) {
  const page = index.pages.find((entry) => entry.slug === slug);
  if (!page) throw new Error(`No indexed page at /docs/${slug}`);
  return page.sections.map((id) => index.sections[id]);
}

describe("the index", () => {
  it("holds every page in the sidebar, in sidebar order", () => {
    expect(index.pages.map((page) => page.slug)).toEqual(
      docsPages.map((page) => page.slug),
    );
  });

  it("gives every page at least one section", () => {
    for (const page of index.pages) {
      expect(page.sections.length, page.slug).toBeGreaterThan(0);
    }
  });

  it("has a sorted, unique dictionary", () => {
    // `termRange` binary-searches this. Out of order it returns wrong answers
    // rather than failing, which is the kind of bug that ships.
    expect(index.terms).toEqual([...index.terms].sort());
    expect(new Set(index.terms).size).toBe(index.terms.length);
    expect(index.postings).toHaveLength(index.terms.length);
  });

  it("delta-encodes every postings list ascending and in range", () => {
    index.postings.forEach((encoded, term) => {
      const postings = decodePostings(encoded);
      expect(postings.length, index.terms[term]).toBeGreaterThan(0);
      let previous = -1;
      for (const posting of postings) {
        expect(posting.section, index.terms[term]).toBeGreaterThan(previous);
        expect(posting.section).toBeLessThan(index.sections.length);
        previous = posting.section;
      }
    });
  });
});

describe("splitting a page into sections", () => {
  it("does not mistake a comment in a code block for a heading", () => {
    // `files/remote.md` lists S3 URL formats in an unlabelled fence, under three
    // lines that begin with `#`. Split naively they become sections with
    // anchors pointing at headings the page does not render.
    const headings = sectionsOf("files/remote").map(
      (section) => section.heading,
    );
    expect(headings).not.toContain("Amazon S3 Formats");
    expect(headings).not.toContain("Google Cloud Storage Formats");
    expect(sectionsOf("snowflake").map((s) => s.heading)).not.toContain(
      "key-pair auth",
    );
    // But the fence's contents are still findable, because code is content.
    expect(
      sectionsOf("files/remote")
        .map((s) => s.text)
        .join("\n"),
    ).toContain("storage.googleapis.com");
  });

  it("does not turn the title `sanitize()` prepends into a section", () => {
    // Every sanitized page opens with `# <title>`, so that a page read as a
    // file is not a fragment. On the rendered page that is the route's `<h1>`,
    // which carries no id — so the prose under it is the page's lead-in, and
    // `duckdb/motherduck` starts with prose rather than with a heading.
    const [first] = sectionsOf("duckdb/motherduck");
    expect(first.heading).toBeNull();
    expect(first.text).toContain("You can use Harlequin with MotherDuck");

    // The shape of the bug, if it comes back: the stripped title becomes an
    // empty section above the real heading that repeats it. (`getting-started`
    // legitimately has an `## Installing Harlequin` under its own title, so
    // "no section shares the page title" would be the wrong thing to assert.)
    for (const page of index.pages) {
      const headings = page.sections.map((id) => index.sections[id].heading);
      for (let i = 1; i < headings.length; i++) {
        expect([page.slug, headings[i]]).not.toEqual([
          page.slug,
          headings[i - 1],
        ]);
      }
    }
  });

  it("anchors each section at the id its heading will render", () => {
    for (const section of index.sections) {
      if (section.heading === null) expect(section.anchor).toBeNull();
      else expect(section.anchor).toBe(slugifyText(section.heading));
    }
  });

  it("leaves no markdown in the text it will quote back to a reader", () => {
    for (const section of index.sections) {
      const where = `${index.pages[section.page].slug} / ${section.heading}`;
      expect(section.text, where).not.toContain("```");
      // A link's target, left in, reads as a URL in the middle of a sentence.
      expect(section.text, where).not.toMatch(/\]\(/);
      expect(section.text, where).not.toContain("&lbrace");
      // No assertion about `<tag>`: `docs_lint.test.ts` already holds the
      // corpus to having none outside code, and inside code `--format <name>`
      // is a placeholder a reader should be able to search for.
    }
  });

  it("keeps the words that only appear in a code block", () => {
    expect(index.terms).toContain("motherduck_token");
    expect(index.terms).toContain("harlequin");
  });
});

describe("what the postings point at", () => {
  // The strongest thing this file can say: for every section, a word that only
  // that section uses finds that section's page. It exercises the delta
  // encoding, the field masks and the section ids all at once, and it is what
  // catches an off-by-one that would otherwise just misattribute results.
  const rare = new Map<string, number>();
  index.sections.forEach((section, id) => {
    for (const { token } of tokenize(section.text)) {
      rare.set(token, rare.has(token) ? -1 : id);
    }
  });

  const probes = index.sections
    .map((section, id) => {
      const own = [...rare.entries()].find(([, only]) => only === id);
      return own ? { id, term: own[0] } : null;
    })
    .filter((probe): probe is { id: number; term: string } => probe !== null);

  it("has a probe for most sections", () => {
    expect(probes.length).toBeGreaterThan(index.sections.length / 2);
  });

  it.each(probes.map((probe) => [probe.term, probe.id] as const))(
    "finds %o on the page that says it",
    (term, id) => {
      const slug = index.pages[index.sections[id].page].slug;
      expect(engine.search(`"${term}"`).map((hit) => hit.slug)).toContain(slug);
    },
  );
});

describe("searching the docs", () => {
  const top = (query: string) => engine.search(query)[0]?.slug;

  it.each([
    ["motherduck", "duckdb/motherduck"],
    ["config file", "config-file/creating-config"],
    ["--limit", "hsql/safety"],
    ["motherduck_token", "duckdb/motherduck"],
  ])("puts %o first on %o", (query, slug) => {
    expect(top(query)).toBe(slug);
  });

  it("prefix-matches a partial word", () => {
    expect(engine.search("motherd").map((hit) => hit.slug)).toEqual(
      engine.search("motherduck").map((hit) => hit.slug),
    );
  });

  it("takes a quoted phrase as a phrase", () => {
    const loose = engine.search("key pair").length;
    const exact = engine.search('"key pair"').length;
    expect(exact).toBeGreaterThan(0);
    expect(exact).toBeLessThanOrEqual(loose);
  });

  it("excludes what the reader excluded", () => {
    const all = engine.search("duckdb").map((hit) => hit.slug);
    expect(all).toContain("duckdb/motherduck");
    expect(
      engine.search("duckdb -motherduck").map((hit) => hit.slug),
    ).not.toContain("duckdb/motherduck");
  });

  it("quotes the match back with the match marked", () => {
    const [hit] = engine.search("motherduck");
    const marked = hit.best.excerpt.filter((segment) => segment.hit);
    expect(marked.length).toBeGreaterThan(0);
    for (const segment of marked) {
      expect(segment.text.toLowerCase()).toContain("motherduck");
    }
  });

  it("finds nothing, rather than everything, for a query with no answer", () => {
    expect(engine.search("zzzznotaword")).toEqual([]);
  });
});

describe("what ships to the browser", () => {
  it("stays within its budget", () => {
    // ~300KB today, ~83KB over the wire. The budget is a tripwire, not a
    // target: if the corpus grows into it, the fix is to stop shipping section
    // text and fetch it for the excerpt, not to raise this number.
    const bytes = JSON.stringify(index).length;
    expect(bytes, `${(bytes / 1024) | 0}KB`).toBeLessThan(400 * 1024);
  });
});
