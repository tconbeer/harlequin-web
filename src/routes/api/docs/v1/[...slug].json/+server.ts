/**
 * One docs page, as JSON.
 *
 * `/api/docs/v1.json` says what pages exist; this says what one contains.
 * The pair is what an agent actually does — read the index, then fetch the one
 * or two pages that matter — which is also why there is no search endpoint
 * here: an index of 55 titles and descriptions is small enough to read whole,
 * and a mediocre search is a support surface with no caller asking for it.
 *
 * The markdown is `buildCorpus()`'s, verbatim, so this route and
 * `/docs/{slug}.md` and `llms-full.txt` are three envelopes around one set of
 * bytes. A caller that already speaks markdown should prefer the `.md` twin —
 * it is the same document without a JSON string to unescape; this exists for
 * the caller that wants the metadata and the body in one response, and for one
 * that would rather parse JSON than guess where a document ends.
 */

import { buildCorpus, type CorpusPage } from "$lib/server/docs";
import { error, json } from "@sveltejs/kit";
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
 * The prerenderer finds routes by crawling links, and no page on the site links
 * to an API response. So the corpus names the entries itself, which is also
 * what keeps a page from being added to the site and left out of the API.
 */
export const entries: EntryGenerator = () =>
  [...corpus().keys()].map((slug) => ({ slug }));

export const GET: RequestHandler = ({ params }) => {
  // The slug of the rendered page — `duckdb/motherduck`, or `duckdb` for the
  // index of a topic — plus `.json`, which the router takes off. It is what
  // the index hands a caller, and what the URL of the rendered page they may
  // have started from already contains.
  const page = corpus().get(params.slug);
  if (!page) error(404, `There is no docs page at /docs/${params.slug}`);

  const { title, topic, slug, url, description, markdown } = page;

  return json(
    { version: 1, title, topic, slug, url, description, markdown },
    {
      headers: {
        // Public and unauthenticated; a browser-based agent is a real consumer.
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
      },
    },
  );
};
