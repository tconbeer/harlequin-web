/**
 * The query language and the ranking, on pages small enough to reason about.
 *
 * The index here is built with `buildIndex`, the same function that indexes the
 * real corpus, so what is exercised is the engine rather than a mock of it.
 * `src/lib/server/search_index.test.ts` is the other half: the real 71 pages,
 * where the questions are about the corpus rather than about the grammar.
 */

import { describe, expect, it } from "vitest";
import {
  buildIndex,
  clauseSpans,
  createEngine,
  decodePostings,
  encodePostings,
  exactRange,
  excerpt,
  highlightRanges,
  parseQuery,
  resultHref,
  termRange,
  tokenize,
  type IndexPage,
  type IndexSection,
} from "./search";

const words = (text: string) => tokenize(text).map((token) => token.token);
const clausesOf = (query: string) => parseQuery(query).groups.flat();

/* -------------------------------------------------------------------------- */

describe("tokenize", () => {
  it.each([
    // A leading `--` is not part of the word, so the flag is found by its name.
    ["--limit 100", ["limit", "100"]],
    // These are one word each. Split, they are unsearchable as themselves.
    ["set MOTHERDUCK_TOKEN", ["set", "motherduck_token"]],
    ["visit harlequin.sh today", ["visit", "harlequin.sh", "today"]],
    ["harlequin v2.13.0", ["harlequin", "v2.13.0"]],
    // A full stop closing a sentence is not part of the word before it.
    ["Run harlequin.sh. Then wait.", ["run", "harlequin.sh", "then", "wait"]],
    ["", []],
    ["!!! ???", []],
  ])("%o -> %o", (text, expected) => {
    expect(words(text)).toEqual(expected);
  });

  it("folds case and accents so the dictionary holds one form", () => {
    expect(words("Café CAFÉ cafe")).toEqual(["cafe", "cafe", "cafe"]);
  });

  it("splits on the punctuation smartypants introduces", () => {
    // The page renders `don’t`; the markdown says `don't`. Neither quote is a
    // token character, so both tokenize alike and neither side has to know.
    expect(words("don’t")).toEqual(words("don't"));
  });

  it("offsets point into the source text, not the folded form", () => {
    const [token] = tokenize("the --limit flag").slice(1);
    expect("the --limit flag".slice(token.start, token.end)).toBe("limit");
  });
});

/* -------------------------------------------------------------------------- */

describe("parseQuery", () => {
  const shape = (query: string) =>
    parseQuery(query).groups.map((group) =>
      group.map(
        (clause) =>
          `${clause.negated ? "-" : ""}${clause.terms.join(" ")}${clause.prefix ? "*" : ""}`,
      ),
    );

  it("ANDs bare words and prefix-matches each", () => {
    expect(shape("config file")).toEqual([["config*", "file*"]]);
  });

  it("takes a quoted phrase exactly", () => {
    expect(shape('"key pair"')).toEqual([["key pair"]]);
  });

  it("negates a word and a phrase", () => {
    expect(shape('-duckdb -"key pair"')).toEqual([["-duckdb*", "-key pair"]]);
  });

  it("binds OR looser than the implicit AND", () => {
    expect(shape("a b OR c")).toEqual([["a*", "b*"], ["c*"]]);
  });

  it("takes OR in either case, but only as a bare word", () => {
    expect(shape("a or b")).toEqual([["a*"], ["b*"]]);
    expect(shape('a "or" b')).toEqual([["a*", "or", "b*"]]);
  });

  it("does not read a CLI flag as an exclusion", () => {
    // The failure this guards is silent: `--limit` parsed as `-` + `-limit`
    // excludes every page that documents the flag, and returns nothing.
    expect(shape("--limit")).toEqual([["limit*"]]);
  });

  it("closes an unbalanced quote at the end of the input", () => {
    expect(shape('"key pair')).toEqual([["key pair"]]);
  });

  it("drops a dangling OR rather than leaving an empty alternative", () => {
    expect(shape("a OR")).toEqual([["a*"]]);
    expect(shape("OR a")).toEqual([["a*"]]);
    expect(shape("a OR OR b")).toEqual([["a*"], ["b*"]]);
  });

  it("has nothing to run for an empty query", () => {
    expect(shape("")).toEqual([]);
    expect(shape("   ")).toEqual([]);
    expect(shape('""')).toEqual([]);
  });
});

/* -------------------------------------------------------------------------- */

describe("the dictionary", () => {
  const terms = ["cat", "config", "configure", "configured", "duck", "zebra"];

  it("bounds the range of terms sharing a prefix", () => {
    expect(termRange(terms, "config")).toEqual([1, 4]);
    expect(termRange(terms, "cat")).toEqual([0, 1]);
    expect(termRange(terms, "zebra")).toEqual([5, 6]);
  });

  it("returns an empty range for a prefix nothing starts with", () => {
    const [from, to] = termRange(terms, "xyz");
    expect(to - from).toBe(0);
  });

  it("finds a term exactly, or not at all", () => {
    expect(exactRange(terms, "config")).toEqual([1, 2]);
    const [from, to] = exactRange(terms, "conf");
    expect(to - from).toBe(0);
  });
});

describe("postings", () => {
  it("survive a round trip through their encoding", () => {
    const postings = [
      { section: 3, tf: 2, fields: 8 },
      { section: 41, tf: 1, fields: 2 },
      { section: 44, tf: 7, fields: 10 },
    ];
    expect(encodePostings(postings)).toBe("3.2.8,38.1.2,3.7.10");
    expect(decodePostings(encodePostings(postings))).toEqual(postings);
  });

  it("decode nothing from nothing", () => {
    expect(decodePostings("")).toEqual([]);
  });
});

/* -------------------------------------------------------------------------- */

describe("clauseSpans", () => {
  const tokens = tokenize("set the config file, then the config path");

  it("finds every place a word matches", () => {
    expect(clauseSpans(tokens, clausesOf("config")[0])).toEqual([
      [2, 3],
      [6, 7],
    ]);
  });

  it("requires a phrase's words to be adjacent", () => {
    expect(clauseSpans(tokens, clausesOf('"config file"')[0])).toEqual([
      [2, 4],
    ]);
    expect(clauseSpans(tokens, clausesOf('"config then"')[0])).toEqual([]);
  });

  it("prefix-matches only the last word of a clause", () => {
    expect(clauseSpans(tokens, clausesOf("conf")[0])).toHaveLength(2);
    expect(clauseSpans(tokens, clausesOf('"conf file"')[0])).toEqual([]);
  });
});

describe("highlightRanges", () => {
  it("covers the matched words and nothing around them", () => {
    const text = "Set the config path";
    const ranges = highlightRanges(text, clausesOf("conf"));
    expect(ranges.map(([from, to]) => text.slice(from, to))).toEqual([
      "config",
    ]);
  });

  it("covers a phrase as one range", () => {
    const text = "Set the config path here";
    const ranges = highlightRanges(text, clausesOf('"config path"'));
    expect(ranges.map(([from, to]) => text.slice(from, to))).toEqual([
      "config path",
    ]);
  });

  it("ignores what the reader excluded", () => {
    expect(highlightRanges("config path", clausesOf("-config"))).toEqual([]);
  });
});

/* -------------------------------------------------------------------------- */

describe("excerpt", () => {
  const filler = "lorem ipsum dolor sit amet ".repeat(20);
  const text = `${filler}the config file lives here ${filler}`;

  it("marks the hits and leaves the rest alone", () => {
    const segments = excerpt(text, clausesOf("config"));
    expect(
      segments.filter((segment) => segment.hit).map((s) => s.text),
    ).toEqual(["config"]);
  });

  it("windows around the match rather than the start of the text", () => {
    const rendered = excerpt(text, clausesOf("config"))
      .map((segment) => segment.text)
      .join("");
    expect(rendered).toContain("the config file lives here");
    expect(rendered.startsWith("…")).toBe(true);
    expect(rendered.endsWith("…")).toBe(true);
  });

  it("prefers the window covering the most of the query", () => {
    // "alpha" alone comes first; the window that has both is the one a reader
    // is looking for, and it is the one that should be quoted.
    const scattered = `alpha ${filler} alpha beta ${filler}`;
    const rendered = excerpt(scattered, clausesOf("alpha beta"))
      .map((segment) => segment.text)
      .join("");
    expect(rendered).toContain("alpha beta");
  });

  it("falls back to the opening when nothing matched", () => {
    const segments = excerpt("nothing to see here", clausesOf("config"));
    expect(segments).toEqual([{ text: "nothing to see here", hit: false }]);
  });

  it("does not ellipsize text that fits", () => {
    expect(
      excerpt("the config file", clausesOf("config"))
        .map((segment) => segment.text)
        .join(""),
    ).toBe("the config file");
  });
});

/* -------------------------------------------------------------------------- */

describe("the engine", () => {
  // Four pages, written so that each assertion below has exactly one right
  // answer: `alpha` is in a title, a heading and a body, and nowhere else.
  const raw: {
    slug: string;
    title: string;
    description: string;
    sections: { heading: string | null; text: string }[];
  }[] = [
    {
      slug: "alpha",
      title: "Alpha",
      description: "The alpha page.",
      sections: [{ heading: null, text: "Nothing to say." }],
    },
    {
      slug: "beta",
      title: "Beta",
      description: "About beta.",
      sections: [
        { heading: null, text: "An opening." },
        { heading: "Alpha", text: "A heading that says alpha." },
      ],
    },
    {
      slug: "gamma",
      title: "Gamma",
      description: "About gamma.",
      sections: [
        { heading: null, text: "This body mentions alpha once." },
        { heading: "Elsewhere", text: "And beta lives over here." },
      ],
    },
    {
      slug: "delta",
      title: "Delta",
      description: "About delta.",
      sections: [{ heading: null, text: "Wholly unrelated." }],
    },
  ];

  const pages: IndexPage[] = [];
  const sections: IndexSection[] = [];
  raw.forEach((page, id) => {
    pages.push({
      slug: page.slug,
      title: page.title,
      topic: null,
      description: page.description,
      sections: page.sections.map((_, i) => sections.length + i),
    });
    for (const section of page.sections) {
      sections.push({
        page: id,
        heading: section.heading,
        anchor: section.heading?.toLowerCase() ?? null,
        text: section.text,
      });
    }
  });

  const engine = createEngine(buildIndex(pages, sections));
  const slugs = (query: string) =>
    engine.search(query).map((result) => result.slug);

  it("ranks a title above a heading above a body", () => {
    expect(slugs("alpha")).toEqual(["alpha", "beta", "gamma"]);
  });

  it("prefix-matches a bare word", () => {
    expect(slugs("alph")).toEqual(slugs("alpha"));
  });

  it("ANDs across a page, not within a section", () => {
    // "alpha" is in gamma's first section and "beta" in its second. The page
    // answers the query even though no one paragraph does.
    expect(slugs("alpha beta")).toContain("gamma");
  });

  it("excludes a whole page, not just the section that matched", () => {
    expect(slugs("alpha -beta")).toEqual(["alpha"]);
  });

  it("ORs alternatives", () => {
    expect(slugs("delta OR alpha").sort()).toEqual([
      "alpha",
      "beta",
      "delta",
      "gamma",
    ]);
  });

  it("answers nothing to a query that is only an exclusion", () => {
    // Every page that does not say "alpha" is not an answer to anything.
    expect(slugs("-alpha")).toEqual([]);
  });

  it("answers nothing to an empty query", () => {
    expect(slugs("")).toEqual([]);
  });

  it("links to the section it quoted", () => {
    const [hit] = engine.search("a heading that says alpha");
    expect(hit.slug).toBe("beta");
    expect(hit.best.anchor).toBe("alpha");
    expect(resultHref(hit.slug, "alpha", hit.best.anchor)).toBe(
      "/docs/beta?q=alpha#alpha",
    );
  });

  it("quotes the description when only the title matched", () => {
    const [hit] = engine.search("alpha");
    expect(hit.slug).toBe("alpha");
    expect(hit.best.excerpt.map((segment) => segment.text).join("")).toContain(
      "Nothing to say",
    );
  });

  it("honours its limit", () => {
    expect(engine.search("delta OR alpha", 2)).toHaveLength(2);
  });
});
