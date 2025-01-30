import type { DocsPage, DocsTopic } from "$lib/types.js";

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ fetch }) {
  const response = await fetch("/api/docs");
  const menuItems: (DocsPage | DocsTopic)[] = await response.json();
  return { menuItems };
}
