import type { BlogPage } from "$lib/types";
import { json } from "@sveltejs/kit";

async function getPosts() {
  const pages: BlogPage[] = [];

  const paths = import.meta.glob("/src/blog/**/*.md", { eager: true });

  for (const path in paths) {
    const file = paths[path];
    const slug = path.split("/blog/").at(-1)?.replace(".md", "");

    if (file && typeof file === "object" && "metadata" in file && slug) {
      const metadata = file.metadata as Omit<BlogPage, "slug">;
      const page = { ...metadata, slug } satisfies BlogPage;
      pages.push(page);
    }
  }

  pages.sort(
    (first, second) =>
      new Date(second.publishedAt) - new Date(first.publishedAt),
  );

  return pages;
}

export async function GET() {
  const pages = await getPosts();
  return json(pages);
}
