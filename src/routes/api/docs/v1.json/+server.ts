/**
 * The docs index, as JSON.
 *
 * What pages exist, what they are called, what each one is about, and where to
 * read it — the map an agent reads before it fetches anything. The page itself
 * is one level down, at `/api/docs/v1/{slug}.json`, and `routes` below names
 * both that template and the raw-markdown one so the next request is
 * constructed rather than guessed.
 *
 * It is versioned in the path because it is a contract with callers this repo
 * cannot see: nothing on the site consumes it, so a change to its shape breaks
 * only strangers, silently, which is the kind of break a version number is for.
 * `/api/docs` and `/api/docs/v1` both redirect here.
 *
 * The `.json` is on the path for the same two reasons the raw docs route wears
 * `.md`: an extension says what a response is without an `Accept` header, and
 * a prerendered index cannot be a file at `/api/docs/v1` while the pages under
 * it need `/api/docs/v1/` to be a directory. One of the two had to carry a
 * suffix, and the one whose siblings are pages is the one that reads as a
 * pattern: `{slug}.md` for the markdown, `{slug}.json` for the envelope.
 *
 * There is no search endpoint, here or below. The index is 55 rows of title
 * and description — small enough that a caller can read it whole and pick — and
 * a search we cannot evaluate is a worse answer than the list itself.
 */

import { canonicalUrl } from "$lib/config";
import { docsPages, docsRepo, docsTopics } from "$lib/docs_menu";
import { buildCorpus } from "$lib/server/docs";
import { json } from "@sveltejs/kit";

// Static: the corpus only changes when the repo does, so this is a file on the
// CDN with no cold start and no way to fail at request time.
export const prerender = true;

// Exported for the tests; a type disappears at compile time, so this adds
// nothing to what the route exports at runtime.
export type ApiTopic = {
  topic: string;
  slug: string;
  url: string;
  // The topic this one nests inside, e.g. "Database Adapters"; null at the
  // top level. Order is outermost first, so a parent always precedes a child.
  parent: string | null;
  repo: string | null;
};

export type ApiPage = {
  title: string;
  slug: string;
  // The topic this page sits in directly; null for a page at the top level.
  topic: string | null;
  // The rendered page. Its markdown twin is that URL plus `.md`, and its JSON
  // is `routes.page` with the slug in it.
  url: string;
  // The page's first sentence, or its `description` frontmatter: one line, so
  // that this index is enough to choose a page from without fetching any.
  description: string;
  repo: string | null;
};

export type ApiIndex = {
  version: 1;
  site: string;
  // URL templates, RFC 6570 style: `{slug}` is a page's slug.
  routes: { page: string; markdown: string };
  topics: ApiTopic[];
  pages: ApiPage[];
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

/**
 * The site root, without a trailing slash: "https://harlequin.sh".
 *
 * The canonical origin, not the one serving the request, for the reason
 * `$lib/config` gives: a payload published for someone else to read is read
 * away from the origin that served it, and a localhost URL in it is wrong even
 * when localhost is what answered. It is also what the corpus absolutizes
 * against, so the URLs here and the URLs in `llms.txt` are the same URLs.
 */
const SITE = canonicalUrl.replace(/\/$/, "");

function pageUrl(slug: string) {
  return `${SITE}/docs/${slug}`;
}

export function GET() {
  // Building the corpus is what checks the menu against what is on disk — a
  // file missing from the menu is a page no reader can navigate to, and a menu
  // entry with no file is a dead link — and, since it sanitizes every page, it
  // is also what fails the build on a component `src/lib/server/docs.ts` has no
  // rule for. This route publishes the corpus's metadata rather than its
  // markdown; it is prerendered, so it is also the cheapest place in the build
  // to find both of those out.
  const corpus = buildCorpus();
  assertLinksResolve();

  const topics: ApiTopic[] = docsTopics.map(({ topic, parent }) => ({
    topic: topic.topic,
    slug: topic.slug,
    url: pageUrl(topic.slug),
    parent: parent?.topic ?? null,
    repo: topic.repo ?? null,
  }));

  // Flat, in sidebar order, from the corpus — so a title here is the title in
  // `llms.txt` and in the page's own JSON, rather than the sidebar's label for
  // it, which is sometimes shortened to fit next to its siblings.
  const pages: ApiPage[] = corpus.map(
    ({ title, slug, topic, description }) => ({
      title,
      slug,
      topic,
      url: pageUrl(slug),
      description,
      // A page can name its own repo (the ODBC adapter does); otherwise the
      // topic it sits in names one.
      repo: docsRepo(slug) ?? docsRepo(slug.split("/")[0]),
    }),
  );

  // Annotated, so that the shape callers are promised and the shape they are
  // sent are checked against each other rather than merely intended to match.
  const index: ApiIndex = {
    version: 1,
    site: SITE,
    // Where a caller goes next, spelled out rather than left to be guessed:
    // one page as JSON, and the same page as markdown, which is the cheaper
    // read for anything that does not need the envelope.
    routes: {
      page: `${SITE}/api/docs/v1/{slug}.json`,
      markdown: `${SITE}/docs/{slug}.md`,
    },
    topics,
    pages,
  };

  return json(index, {
    headers: {
      // Public and unauthenticated; a browser-based agent is a real consumer.
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
