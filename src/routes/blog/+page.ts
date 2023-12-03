import type { BlogPage } from "$lib/types";

export async function load({ fetch }) {
  const response = await fetch("api/blog");
  const posts: BlogPage[] = await response.json();
  return { posts };
}
