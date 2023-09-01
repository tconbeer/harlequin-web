import type { DocsPage } from "$lib/types.js";

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ fetch }) {
  const response = await fetch("/api/docs");
  const pages: DocsPage[] = await response.json();
  return { pages };
}
