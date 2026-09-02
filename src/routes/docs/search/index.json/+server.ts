/**
 * The docs search index.
 *
 * Site plumbing, not a published interface — which is why it lives here beside
 * the search page rather than under `/api/docs`. That API is a contract with
 * callers this repo cannot see and deliberately has no search endpoint; this
 * file is read by one client, shipped from the same build, and its shape is
 * ours to change on any commit that changes both halves at once.
 *
 * Static, for the same reason the raw markdown is: the corpus changes only when
 * the repo does, so this is a file on the CDN with no cold start and no way to
 * fail at request time. It is a single document rather than a chunked index
 * because at 71 pages the whole thing is smaller than one screenshot on the
 * page that links to it, and one fetch that is done is faster than three that
 * are coordinated.
 */

import { buildSearchIndex } from "$lib/server/search_index";
import { json } from "@sveltejs/kit";

export const prerender = true;

export function GET() {
  return json(buildSearchIndex(), {
    headers: {
      // Set here for the dev server; in production this prerenders to a file
      // and Vercel types it by its extension.
      "Cache-Control": "public, max-age=3600",
    },
  });
}
