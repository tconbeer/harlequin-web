import type { BlogPage } from "#lib/types.js";
import { json } from "@sveltejs/kit";

async function getPosts() {
  const pages: BlogPage[] = [];

  // Lazy, because an eager glob pulls the posts into this route's server
  // chunk, and SvelteKit then stops linking their stylesheet from the
  // server-rendered /blog/[post] page.
  const paths = import.meta.glob("/src/blog/**/*.md");

  for (const path in paths) {
    const file = await paths[path]();
    const slug = path.split("/blog/").at(-1)?.replace(".md", "");

    if (file && typeof file === "object" && "metadata" in file && slug) {
      const metadata = file.metadata as Omit<BlogPage, "slug">;
      const page = { ...metadata, slug } satisfies BlogPage;
      pages.push(page);
    }
  }

  pages.sort(
    (first, second) =>
      Date.parse(second.publishedAt) - Date.parse(first.publishedAt),
  );

  return pages;
}

export async function GET() {
  const pages = await getPosts();
  return json(pages);
}
