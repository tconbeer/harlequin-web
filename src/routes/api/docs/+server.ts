import type { DocsPage } from "$lib/types";
import { json } from "@sveltejs/kit";

async function getDocs() {
  let pages: DocsPage[] = [];

  const paths = import.meta.glob("/src/docs/**/*.md", { eager: true });

  for (const path in paths) {
    const file = paths[path];
    const slug = path.split("/docs/").at(-1)?.replace(".md", "");

    if (file && typeof file === "object" && "metadata" in file && slug) {
      const metadata = file.metadata as Omit<DocsPage, "slug">;
      const page = { ...metadata, slug } satisfies DocsPage;
      pages.push(page);
    }
  }

  pages = pages.sort((first, second) => first.menuOrder - second.menuOrder);

  return pages;
}

export async function GET() {
  const pages = await getDocs();
  return json(pages);
}
