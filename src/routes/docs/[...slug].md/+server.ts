/**
 * A docs page, as the markdown it means.
 *
 * `/docs/getting-started/hsql` is a Svelte app that renders a page; a program
 * that wants what the page says has to run it, or scrape it, and both are ways
 * of guessing. `/docs/getting-started/hsql.md` is the same page as the file it
 * would have been: one GET, one document, nothing to strip.
 *
 * The extension rather than content negotiation on the rendered URL, because an
 * agent constructs a URL by appending a string far more reliably than it sets an
 * `Accept` header, and because a path is cacheable without a `Vary`. The
 * convention is meant to be guessable from one example: the rendered page links
 * to its own `.md` twin, and every other page answers to the same rule.
 *
 * The markdown comes from `$lib/server/docs`, which is also what `llms.txt`,
 * the docs API and the copy button read, so no consumer can disagree with
 * another about what a page says.
 */

import { buildCorpus, type CorpusPage } from "$lib/server/docs";
import { error } from "@sveltejs/kit";
import type { EntryGenerator, RequestHandler } from "./$types";

// Static: the corpus changes only when the repo does, so each page is a file on
// the CDN with no cold start and no way to fail at request time.
export const prerender = true;

// Sanitizing the corpus is cheap but not free, and the prerenderer asks for it
// once per page. One build, held for the pass.
let pages: Map<string, CorpusPage> | undefined;
function corpus(): Map<string, CorpusPage> {
  return (pages ??= new Map(buildCorpus().map((page) => [page.slug, page])));
}

/**
 * The prerenderer finds routes by crawling links. Every rendered page now links
 * to its own twin, but the readers this route exists for arrive by constructing
 * the URL rather than by following a link, and a crawl is only as complete as
 * the page that links. So the corpus names the entries itself, which also means
 * a page cannot be added to the site and left without a `.md` twin.
 */
export const entries: EntryGenerator = () =>
  [...corpus().keys()].map((slug) => ({ slug }));

export const GET: RequestHandler = ({ params }) => {
  // `duckdb/motherduck.md`, and `duckdb.md` for the index of a topic: the slug
  // of the rendered page, which is the URL a reader already has, plus `.md`.
  const page = corpus().get(params.slug);
  if (!page) error(404, `There is no docs page at /docs/${params.slug}`);

  return new Response(page.markdown, {
    headers: {
      // In production these come from vercel.json: the route prerenders to a
      // static file, and Vercel types it by extension rather than carrying a
      // build-time response header over. They are set here for the dev server,
      // and because a route that serves markdown should say so on its own.
      "Content-Type": "text/markdown; charset=utf-8",
      // Public, unauthenticated, and read by agents that run in a browser.
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
