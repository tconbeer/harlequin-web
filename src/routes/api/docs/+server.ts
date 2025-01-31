import type { DocsPage, DocsTopic } from "$lib/types";
import { json } from "@sveltejs/kit";

async function getDocs(): Promise<(DocsTopic | DocsPage)[]> {
  let pages: DocsPage[] = [];
  let topics: DocsTopic[] = [];

  const paths = import.meta.glob("/src/docs/**/*.md", { eager: true });
  const index_paths = import.meta.glob("/src/docs/**/index.md", {
    eager: true,
  });

  for (const path in paths) {
    const file = paths[path];
    const slug = path.split("/docs/").at(-1)?.replace(".md", "");

    if (file && typeof file === "object" && "metadata" in file && slug) {
      const metadata = file.metadata as Omit<DocsPage, "slug">;
      const page = {
        title: metadata.title,
        menuOrder: metadata.menuOrder,
        slug,
      } satisfies DocsPage;
      pages.push(page);
    }
  }

  for (const path in index_paths) {
    const dir = index_paths[path];
    const slug = path.split("/docs/").at(-1)?.replace(".md", "");
    const slugPrefix = path.split("/docs/").at(-2);

    if (
      dir &&
      typeof dir === "object" &&
      "metadata" in dir &&
      slug &&
      slugPrefix
    ) {
      const metadata = dir.metadata as Omit<DocsTopic, "slug">;
      const topic = {
        menuOrder: metadata.menuOrder,
        topic: metadata.topic,
        slug,
        slugPrefix,
      } satisfies DocsTopic;
      topics.push(topic);
    }
  }

  let menuItems: (DocsTopic | DocsPage)[] = [];
  menuItems = menuItems
    .concat(topics, pages)
    .sort((first, second) =>
      first.menuOrder == second.menuOrder
        ? "topic" in second
          ? 100
          : -1
        : first.menuOrder - second.menuOrder,
    );

  return menuItems;
}

export async function GET() {
  const menuItems = await getDocs();
  return json(menuItems);
}
