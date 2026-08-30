/**
 * The index an agent reads first.
 *
 * `llms.txt` (llmstxt.org) is one file at a well-known path that says what a
 * site documents and where each part of it lives. This one is one row per
 * docs page: a title, a one-line description, and a URL that already points at
 * markdown, so the next request an agent makes returns a document rather than
 * a Svelte app.
 *
 * It is the front door, not the corpus. `llms-full.txt` is ~117KB — a fifth of
 * a small context window spent before knowing whether Harlequin is relevant —
 * so the shape here is index first, page second, and the whole thing only for
 * a caller that genuinely wants it. That is why the size is stated below: an
 * agent choosing between the two should be able to see the cost.
 *
 * The rows link to `/docs/{slug}.md` rather than to the rendered page. The
 * rendered page is the same content behind ten times the bytes, and a reader
 * that wants it drops four characters; a reader that follows the link as given
 * gets what it came for in one GET.
 */

import { canonicalUrl, description, title } from "$lib/config";
import { buildCorpus, type CorpusPage } from "$lib/server/docs";

// Static: the corpus changes only when the repo does, so this is a file on the
// CDN with no cold start and no way to fail at request time.
export const prerender = true;

const SITE = canonicalUrl.replace(/\/$/, "");

// The heading for pages that sit in no topic — Themes, Exporting Data,
// Managing Transactions, Default Bindings. They are top-level rows in the
// sidebar, which has no label for them because the sidebar does not need one;
// a list of `##` sections does, because a row with no section above it is a
// row an agent cannot place. The section lands where the first of them appears
// in sidebar order, and the later ones join it there rather than starting a
// second section with the same name.
const UNGROUPED = "Other Topics";

/** Whole kilobytes of UTF-8, for the one number that decides a fetch. */
function kilobytes(text: string): number {
  return Math.round(new TextEncoder().encode(text).length / 1024);
}

/**
 * The pages, grouped by the topic each sits in, sections in the order their
 * first page appears and pages within a section in sidebar order. Grouping is
 * what reorders anything: the sidebar interleaves top-level pages with topics,
 * and a section gathers each group in one place.
 */
function sections(pages: CorpusPage[]): Map<string, CorpusPage[]> {
  const grouped = new Map<string, CorpusPage[]>();
  for (const page of pages) {
    const topic = page.topic ?? UNGROUPED;
    const rows = grouped.get(topic) ?? [];
    if (!rows.length) grouped.set(topic, rows);
    rows.push(page);
  }
  return grouped;
}

/**
 * A row of the index. The link is the page's markdown twin; the description is
 * the page's own, and a page that somehow has none still gets a row, because a
 * page missing from the index is worse than a page with no summary in it.
 */
function row(page: CorpusPage): string {
  return (
    `- [${page.title}](${page.url}.md)` +
    (page.description ? `: ${page.description}` : "")
  );
}

function llmsIndex(): string {
  const corpus = buildCorpus();
  const size = kilobytes(corpus.map((page) => page.markdown).join(""));

  const preamble = [
    `# ${title}`,
    "",
    `> ${description}`,
    "",
    `Every page of the Harlequin documentation, grouped the way the site's`,
    `sidebar groups it. Each link is the page as markdown; drop the \`.md\``,
    `for the rendered page at the same path.`,
    "",
    `- The whole corpus in one file: ${SITE}/llms-full.txt (${corpus.length} pages, ~${size}KB)`,
    `- The same index as JSON: ${SITE}/api/docs/v1.json (a page: ${SITE}/api/docs/v1/{slug}.json)`,
    `- The config file schema: ${SITE}/schemas/config/v1.json`,
    "",
  ];

  const body = [...sections(corpus)].flatMap(([topic, pages]) => [
    `## ${topic}`,
    "",
    ...pages.map(row),
    "",
  ]);

  return [...preamble, ...body].join("\n").trimEnd() + "\n";
}

export function GET() {
  return new Response(llmsIndex(), {
    headers: {
      // In production the content type comes from Vercel, which types a
      // prerendered `.txt` by its extension. Set here for the dev server, and
      // because a route should say what it serves.
      "Content-Type": "text/plain; charset=utf-8",
      // Public, unauthenticated, and read by agents that run in a browser.
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
