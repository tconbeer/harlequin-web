import { url as siteUrl } from "$lib/config";
import { docsMenu, docsPages, isTopic } from "$lib/docs_menu";
import { json } from "@sveltejs/kit";

// Static: the corpus only changes when the repo does, so this is a file on the
// CDN with no cold start and no way to fail at request time.
export const prerender = true;

type ApiTopic = {
  topic: string;
  slug: string;
  url: string;
  repo: string | null;
};

type ApiPage = {
  title: string;
  slug: string;
  topic: string | null;
  url: string;
  repo: string | null;
};

/**
 * The menu is hand-maintained in `src/lib/docs_menu.ts`, so the build checks it
 * against what is actually on disk. A file missing from the menu is a page no
 * reader can navigate to; a menu entry with no file is a dead link.
 */
function assertMenuMatchesFiles() {
  const onDisk = new Set(
    Object.keys(import.meta.glob("/src/docs/**/*.md")).map((path) =>
      path.slice("/src/docs/".length, -".md".length).replace(/\/index$/, ""),
    ),
  );
  const inMenu = new Set(docsPages.map((page) => page.slug));

  const unlisted = [...onDisk].filter((slug) => !inMenu.has(slug)).sort();
  const dangling = [...inMenu].filter((slug) => !onDisk.has(slug)).sort();

  if (unlisted.length || dangling.length) {
    throw new Error(
      "src/lib/docs_menu.ts is out of sync with src/docs:" +
        (unlisted.length ? `\n  missing from the menu: ${unlisted}` : "") +
        (dangling.length ? `\n  no such markdown file: ${dangling}` : ""),
    );
  }
}

/**
 * Docs and blog posts link to each other with absolute `/docs/...` paths, so
 * the target of every one of them is a slug the menu should know about. The
 * fragment is not checked — only that the page on the other end exists.
 */
function assertLinksResolve() {
  const sources = import.meta.glob(["/src/docs/**/*.md", "/src/blog/**/*.md"], {
    query: "?raw",
    import: "default",
    eager: true,
  }) as Record<string, string>;
  const inMenu = new Set(docsPages.map((page) => page.slug));
  // Markdown links and <Link href> alike; anything else that says "/docs/" is
  // prose about the repo layout, not a link.
  const patterns = [/\]\(\/docs\/([^)#\s]*)/g, /href="\/docs\/([^"#]*)/g];

  const broken: string[] = [];
  for (const [path, source] of Object.entries(sources)) {
    for (const pattern of patterns) {
      for (const [, target] of source.matchAll(pattern)) {
        const slug = target.replace(/\/$/, "");
        if (!inMenu.has(slug)) broken.push(`${path}: /docs/${target}`);
      }
    }
  }

  if (broken.length) {
    throw new Error(
      `Links to docs pages that do not exist:\n  ${broken.join("\n  ")}`,
    );
  }
}

function pageUrl(slug: string) {
  return new URL(`docs/${slug}`, siteUrl).href;
}

export function GET() {
  assertMenuMatchesFiles();
  assertLinksResolve();

  const topics: ApiTopic[] = docsMenu.filter(isTopic).map((topic) => ({
    topic: topic.topic,
    slug: topic.slug,
    url: pageUrl(topic.slug),
    repo: topic.repo ?? null,
  }));

  // Flat, in sidebar order; `topic` is null for a page that stands on its own.
  const pages: ApiPage[] = docsMenu.flatMap((item): ApiPage[] =>
    isTopic(item)
      ? item.pages.map((page) => ({
          title: page.title,
          slug: page.slug,
          topic: item.topic,
          url: pageUrl(page.slug),
          repo: page.repo ?? item.repo ?? null,
        }))
      : [
          {
            title: item.title,
            slug: item.slug,
            topic: null,
            url: pageUrl(item.slug),
            repo: item.repo ?? null,
          },
        ],
  );

  return json(
    { version: 1, site: siteUrl.replace(/\/$/, ""), topics, pages },
    {
      headers: {
        // Public and unauthenticated; a browser-based agent is a real consumer.
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
      },
    },
  );
}
