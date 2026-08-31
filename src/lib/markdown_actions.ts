/**
 * What the "Copy as Markdown" and "View as Markdown" controls need to know.
 *
 * Both are string constructions over the slug of the page a reader is already
 * on, and both have to agree with the raw route: the link is a 404 and the copy
 * is empty the moment `/docs/{slug}.md` is not where the twin lives. They sit
 * here rather than in the component so a test can hold them against the corpus
 * without a DOM.
 *
 * The copy button fetches that same URL rather than deriving markdown of its
 * own — one sanitizer, one corpus, and this is the fifth thing reading it.
 */

/** "/docs/duckdb/motherduck" -> "duckdb/motherduck"; the sidebar's slug. */
export function docsSlug(pathname: string): string {
  return pathname.replace(/^\/docs\/?/, "").replace(/\/+$/, "");
}

/**
 * The page's markdown twin. The slug of the *rendered* page, so a topic index
 * is `/docs/duckdb.md` — `/docs/duckdb/index.md` is a 404, the same way
 * `/docs/duckdb/index` is a 308.
 */
export function markdownPath(slug: string): string {
  return `/docs/${slug}.md`;
}

/**
 * Two lines of provenance above a copied page: what it is and where it came
 * from. A page pasted into a chat has left the site that served it, and the
 * markdown below this says only what the page says, not where it lives.
 */
export function markdownHeader(title: string, url: string): string {
  return `Harlequin documentation: ${title}\nSource: ${url}\n\n`;
}
