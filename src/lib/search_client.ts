/**
 * The search index, in the browser.
 *
 * One fetch for the whole index, held for the life of the page: a module-level
 * promise, so the sidebar's search box and the results page share it across
 * client-side navigations and a reader who searches twice pays once. It is
 * requested when the input takes focus rather than when a key lands, so the
 * download overlaps the time between reaching for the box and typing into it.
 *
 * A failed fetch clears the promise. The next attempt should try again rather
 * than serve a rejection forever from a cache.
 */

import { createEngine, type Engine, type SearchIndex } from "$lib/search";

export const INDEX_URL = "/docs/search/index.json";

let pending: Promise<Engine> | undefined;

export function loadEngine(): Promise<Engine> {
  return (pending ??= fetch(INDEX_URL)
    .then((response) => {
      if (!response.ok)
        throw new Error(`${INDEX_URL} answered ${response.status}`);
      return response.json() as Promise<SearchIndex>;
    })
    .then(createEngine)
    .catch((error) => {
      pending = undefined;
      throw error;
    }));
}
