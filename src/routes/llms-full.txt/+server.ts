/**
 * The whole docs corpus, in one file.
 *
 * The fallback, not the front door. It is ~117KB — roughly 29,000 tokens — and
 * an agent that loads it speculatively has spent a fifth of a small context
 * window before it knows whether Harlequin is relevant. `llms.txt` plus one
 * page fetch is the cheap path, and this exists for the caller that genuinely
 * wants the corpus: an index build, an eval, a reader with room for it.
 *
 * Every page comes from `buildCorpus()`, verbatim, under the URL it is served
 * at on its own. That is the property worth keeping: the bytes here and the
 * bytes at `/docs/{slug}.md` are the same bytes, so a reader cannot get two
 * answers about what a page says depending on which one it asked.
 */

import { canonicalUrl, description, title } from "$lib/config";
import { buildCorpus } from "$lib/server/docs";

// Static: the corpus changes only when the repo does, so this is a file on the
// CDN with no cold start and no way to fail at request time.
export const prerender = true;

const SITE = canonicalUrl.replace(/\/$/, "");

// A thematic break between pages, with blank lines around it: `---` on the line
// under a paragraph is a setext heading, not a rule, and the pages on either
// side of this are markdown that a reader is going to parse.
const SEPARATOR = "\n\n---\n\n";

function llmsFull(): string {
  const corpus = buildCorpus();

  const preamble = [
    `# ${title} Documentation`,
    "",
    `> ${description}`,
    "",
    `Every page of ${SITE}/docs, as markdown, in the order the site`,
    `lists them. ${corpus.length} pages, each introduced by a \`Source:\` line naming the`,
    `URL it is also served at on its own, and separated by a \`---\` rule.`,
    "",
    `For an index of titles and one-line descriptions — which is the cheaper`,
    `way in — see ${SITE}/llms.txt.`,
  ].join("\n");

  // `Source:` above each page rather than a heading, because a heading here
  // would sit in the same document as the page's own `# Title` and change what
  // the page looks like it is a section of.
  const pages = corpus.map((page) =>
    `Source: ${page.url}\n\n${page.markdown}`.trimEnd(),
  );

  return [preamble, ...pages].join(SEPARATOR) + "\n";
}

export function GET() {
  return new Response(llmsFull(), {
    headers: {
      // In production the content type comes from Vercel, which types a
      // prerendered `.txt` by its extension. Set here for the dev server, and
      // because a route should say what it serves.
      "Content-Type": "text/plain; charset=utf-8",
      // Public, unauthenticated, and read by agents that run in a browser.
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
