/**
 * The docs search index, built from the corpus.
 *
 * `buildCorpus()` is the one place a page under `src/docs` becomes markdown, and
 * this is its sixth consumer. It reads what `/docs/<slug>.md` serves, so the
 * words a search matches are the words the page says — a second sanitizer here
 * would be a second answer to what a page contains, and the first place the two
 * disagreed would be a page that is unfindable by a phrase printed on it.
 *
 * Two things this file has to get right, both of which are quiet when wrong:
 *
 * - **A `#` inside a fence is not a heading.** `src/docs/files/remote.md` lists
 *   S3 URL formats in an unlabelled code block under `# Amazon S3 Formats`, and
 *   `snowflake/index.md` has a `# key-pair auth` comment in a TOML sample.
 *   Splitting on `/^#{1,4} /m` invents four sections that are really comments,
 *   with anchors pointing at headings no page renders.
 * - **Code is content.** A reader searching `motherduck_token` or `--limit` is
 *   searching a code block. Fence *markers* go; what is inside them stays, and
 *   stays verbatim, because `*` in `SELECT *` is not emphasis.
 */

import {
  buildIndex,
  type IndexPage,
  type IndexSection,
  type SearchIndex,
} from "$lib/search";
import { slugifyText } from "$lib/slugify";
import { buildCorpus } from "./docs";

/** Inline markdown, as the text it renders to. */
function plain(text: string): string {
  return (
    text
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/`+/g, "")
      .replace(/\*\*|__/g, "")
      // Only emphasis at a word boundary: the `_` in `motherduck_token` is part
      // of the name, and a reader who searches for the name should find it.
      .replace(/(^|[\s(])[*_]([^*_\n]+)[*_](?=[\s).,;:!?]|$)/g, "$1$2")
      .trim()
  );
}

/** The block markers on one line: a bullet, a quote arrow, a row of cells. */
function unblock(line: string): string {
  return (
    line
      .replace(/^\s{0,3}>\s?/, "")
      .replace(/^\s*[-*+]\s+/, "")
      .replace(/^\s*\d+\.\s+/, "")
      // A table row reads as its cells; the pipes are furniture.
      .replace(/^\s*\|(.*)\|\s*$/, (_, cells) =>
        cells
          .split("|")
          .map((cell: string) => cell.trim())
          .filter(Boolean)
          .join(" \u00b7 "),
      )
  );
}

const FENCE = /^\s*```/;
const HEADING = /^(#{1,4})\s+(.*)$/;
// `| --- | :-- |`: the rule under a table's header, which says nothing.
const TABLE_RULE = /^\s*\|[\s:|-]+\|\s*$/;

// Prose and code alternate, and only prose gets the inline rewrites. A fence is
// kept verbatim: the `*` in `SELECT *` is not emphasis, and `_` in a column name
// is not either. Prose is rewritten a chunk at a time rather than a line at a
// time, because a markdown link may wrap — `hsql/config.md` has one whose text
// and target are three lines apart, and a per-line pass leaves the URL sitting
// in the middle of an excerpt.
type Chunk = { code: boolean; lines: string[] };
type RawSection = { heading: string | null; chunks: Chunk[] };

/** A page's markdown, split at its headings — and not at its code comments. */
function split(markdown: string): RawSection[] {
  const sections: RawSection[] = [{ heading: null, chunks: [] }];
  let fenced = false;

  const push = (code: boolean, line: string) => {
    const chunks = sections[sections.length - 1].chunks;
    const last = chunks[chunks.length - 1];
    if (last && last.code === code) last.lines.push(line);
    else chunks.push({ code, lines: [line] });
  };

  for (const line of markdown.split("\n")) {
    if (FENCE.test(line)) {
      fenced = !fenced;
      continue;
    }
    if (fenced) {
      push(true, line);
      continue;
    }
    const heading = HEADING.exec(line);
    if (heading) sections.push({ heading: plain(heading[2]), chunks: [] });
    else if (!TABLE_RULE.test(line)) push(false, unblock(line));
  }
  return sections;
}

function text(chunks: Chunk[]): string {
  return chunks
    .map((chunk) =>
      chunk.code ? chunk.lines.join("\n") : plain(chunk.lines.join("\n")),
    )
    .join("\n")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

// `sanitize()` opens every page with `# <title>`, so that a page read as a file
// is not a fragment. On the rendered page that heading is the route's `<h1>`,
// which carries no id — so it is not a section, and the prose under it is the
// page's lead-in.
const TITLE_HEADING = /^#\s+.*\n+/;

export function buildSearchIndex(): SearchIndex {
  const pages: IndexPage[] = [];
  const sections: IndexSection[] = [];

  for (const page of buildCorpus()) {
    const raw = split(page.markdown.replace(TITLE_HEADING, "")).filter(
      // A lead-in with nothing above the first heading is not a section. Its
      // page's title and description move to whatever section comes first.
      (section) => section.heading !== null || text(section.chunks),
    );
    const indexPage: IndexPage = {
      slug: page.slug,
      title: page.title,
      topic: page.topic,
      description: page.description,
      sections: [],
    };
    // A page with no prose at all still has a title worth finding.
    for (const section of raw.length ? raw : [{ heading: null, chunks: [] }]) {
      indexPage.sections.push(sections.length);
      sections.push({
        page: pages.length,
        heading: section.heading,
        anchor: section.heading ? slugifyText(section.heading) : null,
        text: text(section.chunks),
      });
    }
    pages.push(indexPage);
  }

  return buildIndex(pages, sections);
}
