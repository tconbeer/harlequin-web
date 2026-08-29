import { url as siteUrl } from "$lib/config";
import { docsAncestors, docsPages, docsRepo, docsTopics } from "$lib/docs_menu";
import { buildCorpus } from "$lib/server/docs";
import { json } from "@sveltejs/kit";

// Static: the corpus only changes when the repo does, so this is a file on the
// CDN with no cold start and no way to fail at request time.
export const prerender = true;

type ApiTopic = {
  topic: string;
  slug: string;
  url: string;
  // The topic this one nests inside, e.g. "Database Adapters"; null at the
  // top level. Order is outermost first, so a parent always precedes a child.
  parent: string | null;
  repo: string | null;
};

type ApiPage = {
  title: string;
  slug: string;
  // The topic this page sits in directly; null for a page at the top level.
  topic: string | null;
  url: string;
  repo: string | null;
};

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
  // Building the corpus is what checks the menu against what is on disk — a
  // file missing from the menu is a page no reader can navigate to, and a menu
  // entry with no file is a dead link — and, since it sanitizes every page, it
  // is also what fails the build on a component `src/lib/server/docs.ts` has no
  // rule for. This route publishes none of it; it is prerendered, so it is the
  // cheapest place in the build to find out.
  buildCorpus();
  assertLinksResolve();

  const topics: ApiTopic[] = docsTopics.map(({ topic, parent }) => ({
    topic: topic.topic,
    slug: topic.slug,
    url: pageUrl(topic.slug),
    parent: parent?.topic ?? null,
    repo: topic.repo ?? null,
  }));

  // Flat, in sidebar order; `topic` is the group the page sits in directly.
  const pages: ApiPage[] = docsPages.map((page) => ({
    title: page.title,
    slug: page.slug,
    topic: docsAncestors(page.slug).at(-1)?.topic ?? null,
    url: pageUrl(page.slug),
    repo: page.repo ?? docsRepo(page.slug.split("/")[0]),
  }));

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
