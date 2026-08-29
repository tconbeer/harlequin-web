/**
 * The docs corpus, as markdown.
 *
 * A page under `src/docs` is not markdown. It is an mdsvex source: a Svelte
 * `<script>` block, component tags (`<Key>`, `<Tip>`, `<Figure>`), identifiers
 * in braces, escaped braces where a literal one was meant, and a site-private
 * `output` fence language. Rendered in a browser that is a page; handed to a
 * program that reads markdown it is a page with holes in it.
 *
 * This module is the one place that closes them. `sanitize()` turns one source
 * into the markdown that source means, and `buildCorpus()` runs it over every
 * page. Everything that serves markdown — the raw `.md` routes, `llms.txt`,
 * `llms-full.txt`, the docs API, "Copy as Markdown" — reads it from here, so
 * that two consumers cannot disagree about what a page says.
 *
 * The design rule is that the sanitizer never guesses. A construct it does not
 * know about throws at build time rather than shipping as a `<Tag>` in a file
 * that claims to be markdown: the failure mode of a wrong answer to a machine
 * is silent, so it has to be made loud here.
 */

import { canonicalUrl } from "$lib/config";
import { docsPages, docsTopicLabel } from "$lib/docs_menu";

// Raw sources, not the compiled Svelte components: the point is to read what
// the author wrote, before mdsvex touches it.
const sources = import.meta.glob("/src/docs/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

// Every asset a page can point a <Figure> at, keyed by its path under /src.
// `?url` is what Vite resolves to a servable URL — a hashed, immutable path in
// a production build, and the source path under the dev server.
const assets = import.meta.glob("/src/lib/assets/**", {
  query: "?url",
  import: "default",
  eager: true,
}) as Record<string, string>;

/** The site root, without a trailing slash: "https://harlequin.sh". */
const SITE = canonicalUrl.replace(/\/$/, "");

export type CorpusPage = {
  // Path under /docs, e.g. "duckdb/motherduck"; an index page takes the bare
  // directory name, matching the router and `docsMenu`.
  slug: string;
  title: string;
  // The sidebar group the page sits in directly; null at the top level.
  topic: string | null;
  // The canonical URL of the rendered page.
  url: string;
  // One line for an index an agent reads before it reads anything else.
  description: string;
  // The page as markdown: no Svelte, no relative links, no escaped braces.
  markdown: string;
};

/* -------------------------------------------------------------------------- */
/* Masking                                                                     */
/* -------------------------------------------------------------------------- */

// A private-use character no docs page contains, so a placeholder cannot be
// confused for content and a rewrite cannot reach inside a code block.
const MARK = "\uE000";

type Masked = {
  text: string;
  pieces: string[];
};

/**
 * Code is not prose, and none of the rewrites below belong inside it: a fence
 * that shows a Svelte component is showing it on purpose, and `<my token>` in a
 * command line is not an HTML tag. So every fenced block and inline span comes
 * out first and goes back in last.
 *
 * The one thing that does happen here is fence normalization: ` ```output ` is
 * a language this site invented for its highlighter, and no other markdown
 * reader knows it, so it becomes an unlabelled fence. ` ```bash ` stays, and
 * the `$ ` prompt is *not* added — the site's highlighter injects that, it is
 * not in the source, and its absence is what makes the raw block pasteable.
 */
function maskCode(body: string): Masked {
  const pieces: string[] = [];
  const lines = body.split("\n");
  const out: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const opener = /^(\s*)(`{3,})(.*)$/.exec(lines[i]);
    if (!opener) {
      out.push(lines[i]);
      continue;
    }
    const [, indent, ticks, info] = opener;
    const block = [`${indent}${ticks}${info.trim() === "output" ? "" : info}`];
    i++;
    for (; i < lines.length; i++) {
      block.push(lines[i]);
      if (new RegExp(`^\\s*${ticks}\\s*$`).test(lines[i])) break;
    }
    out.push(`${indent}${MARK}${pieces.length}${MARK}`);
    pieces.push(block.join("\n").slice(indent.length));
  }

  // Inline spans, on one line each, which is all this corpus has.
  const text = out.join("\n").replace(/(`+)(?:(?!\1).)+?\1/g, (span) => {
    pieces.push(span);
    return `${MARK}${pieces.length - 1}${MARK}`;
  });

  return { text, pieces };
}

function unmask({ text, pieces }: Masked): string {
  // Repeated because a restored fence can contain nothing else, but an inline
  // span restored into a line is cheap to re-scan and this keeps the order of
  // masking and unmasking from mattering.
  let out = text;
  for (let pass = 0; pass < 2; pass++) {
    out = out.replace(
      new RegExp(`${MARK}(\\d+)${MARK}`, "g"),
      (_, index) => pieces[Number(index)],
    );
  }
  return out;
}

/* -------------------------------------------------------------------------- */
/* Frontmatter                                                                 */
/* -------------------------------------------------------------------------- */

type Frontmatter = { title: string; description?: string };

function splitFrontmatter(
  source: string,
  slug: string,
): { meta: Frontmatter; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source);
  if (!match) {
    throw new Error(`src/docs/${slug}.md has no frontmatter block`);
  }

  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const pair = /^([a-z_]+):\s*(.*)$/.exec(line.trim());
    if (pair) meta[pair[1]] = pair[2].trim().replace(/^["'](.*)["']$/, "$1");
  }
  if (!meta.title) {
    throw new Error(`src/docs/${slug}.md has no title in its frontmatter`);
  }

  return {
    meta: { title: meta.title, description: meta.description },
    body: source.slice(match[0].length),
  };
}

/* -------------------------------------------------------------------------- */
/* The script block                                                            */
/* -------------------------------------------------------------------------- */

/**
 * A page's `<script>` block is how it names its imports, and the names are the
 * only way to read `src={init}`. So the imports come out as a map before the
 * block does.
 */
function takeScript(body: string): {
  imports: Map<string, string>;
  rest: string;
} {
  const imports = new Map<string, string>();
  const rest = body.replace(
    /<script[^>]*>([\s\S]*?)<\/script>\s*/g,
    (_, contents: string) => {
      for (const [, name, path] of contents.matchAll(
        /import\s+(\w+)\s+from\s+["']([^"']+)["']/g,
      )) {
        imports.set(name, path);
      }
      return "";
    },
  );
  return { imports, rest };
}

/* -------------------------------------------------------------------------- */
/* Figures                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * `src={init}` -> the import's path -> the URL Vite serves that file from ->
 * absolute, because a raw page is read somewhere other than this origin.
 */
function assetUrl(
  identifier: string,
  imports: Map<string, string>,
  slug: string,
): string {
  const path = imports.get(identifier);
  if (path === undefined) {
    throw new Error(
      `src/docs/${slug}.md uses {${identifier}} but its <script> block does ` +
        `not import it`,
    );
  }
  const resolved = assets[path.replace(/^\$lib\//, "/src/lib/")];
  if (resolved === undefined) {
    throw new Error(
      `src/docs/${slug}.md imports ${path} as ${identifier}, but there is no ` +
        `such file under src/lib/assets`,
    );
  }
  return new URL(resolved, `${SITE}/`).href;
}

function attribute(tag: string, name: string): string | undefined {
  const quoted = new RegExp(`\\b${name}=(?:"([^"]*)"|'([^']*)')`).exec(tag);
  if (quoted) return quoted[1] ?? quoted[2];
  const braced = new RegExp(`\\b${name}=\\{([^}]*)\\}`).exec(tag);
  return braced?.[1];
}

function figure(alt: string, url: string, caption?: string): string {
  const image = `![${alt}](${url})`;
  return caption ? `${image}\n\n*${caption}*` : image;
}

/* -------------------------------------------------------------------------- */
/* Links                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * A relative link resolves against the router when the page is a route and
 * against nothing at all when the page is a file, so every link in the corpus
 * is absolute. `/docs/x/index` collapses to `/docs/x` the way the router's 308
 * collapses it, because the canonical URL of an index page has no `/index`.
 */
function absolutize(target: string, slug: string): string {
  if (/^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i.test(target)) return target;

  // The page's own directory, which is what `[a](auth)` on `bigquery/index`
  // means by "here". A top-level page has none, and an empty segment in the
  // base would put a `//` in every link out of one.
  const directory = slug.includes("/")
    ? `${slug.slice(0, slug.lastIndexOf("/"))}/`
    : "";
  const path = target.startsWith("/")
    ? target
    : new URL(target, `https://x/docs/${directory}`).pathname;

  const [, route, fragment] = /^([^#]*)(#.*)?$/.exec(path) as RegExpExecArray;
  const collapsed = route.replace(/\/$/, "").replace(/\/index$/, "");
  return `${SITE}${collapsed}${fragment ?? ""}`;
}

/* -------------------------------------------------------------------------- */
/* The rewrites                                                                */
/* -------------------------------------------------------------------------- */

/**
 * `<Tip>`, `<Note>` and `<Warning>` become blockquotes. A blockquote is
 * line-prefixed rather than wrapped, so the markdown nested inside a callout —
 * lists, code, links — keeps working, which is not true of any other rendering
 * of them.
 */
function blockquote(label: string, contents: string): string {
  const lines = contents.trim().split("\n");
  const [first, ...rest] = lines;
  return [`> **${label}:** ${first}`, ...rest.map((line) => `> ${line}`)]
    .join("\n")
    .replace(/^> +$/gm, ">");
}

/**
 * Replace a block element with its contents, dedented, one paragraph per line.
 * Everything the docs wrap in a `<div>` or a `<figure>` is a short block — an
 * image, a caption, an embed — so a line of it is a paragraph of markdown.
 */
function unwrap(prose: string, tag: string): string {
  return prose.replace(
    new RegExp(
      `^[ \\t]*<${tag}\\b[^>]*>[ \\t]*\\n([\\s\\S]*?)\\n[ \\t]*</${tag}>[ \\t]*$`,
      "gm",
    ),
    (_, inner: string) =>
      inner
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .join("\n\n"),
  );
}

function downgrade(
  prose: string,
  slug: string,
  imports: Map<string, string>,
): string {
  let out = prose;

  // Innermost first: a callout's body holds <Key>, <Link> and <code>, and the
  // callout is rewritten once its contents are already markdown.
  out = out.replace(
    /<Key>([\s\S]*?)<\/Key>/g,
    (_, key: string) => `\`${key}\``,
  );
  out = out.replace(
    /<Link\s+href="([^"]*)"\s*>([\s\S]*?)<\/Link>/g,
    (_, href: string, text: string) => `[${text.trim()}](${href})`,
  );

  // Presentational HTML the docs write by hand, mostly because markdown does
  // not reach inside a Svelte component's children. It carries no meaning a
  // markdown reader can use, so it comes off.
  out = out.replace(
    /<code[^>]*>([\s\S]*?)<\/code>/g,
    (_, code: string) => `\`${code.trim()}\``,
  );
  out = out.replace(/<\/?(?:span|pre|p)(?:\s[^>]*)?>/g, "");
  out = out.replace(
    /<figcaption[^>]*>([\s\S]*?)<\/figcaption>/g,
    (_, caption: string) => `*${caption.trim()}*`,
  );

  // <Figure> and the hand-rolled <img> that predates it say the same thing.
  out = out.replace(
    /<Figure\b([^>]*)>\s*(?:<\/Figure>)?/g,
    (tag, attributes: string) => {
      const src = attribute(attributes, "src");
      if (!src)
        throw new Error(
          `src/docs/${slug}.md has a <Figure> with no src: ${tag}`,
        );
      return figure(
        attribute(attributes, "alt") ?? "",
        assetUrl(src, imports, slug),
        attribute(attributes, "caption"),
      );
    },
  );
  out = out.replace(/<img\b([^>]*?)\/?>/g, (tag, attributes: string) => {
    const src = attribute(attributes, "src");
    if (!src)
      throw new Error(`src/docs/${slug}.md has an <img> with no src: ${tag}`);
    return figure(
      attribute(attributes, "alt") ?? "",
      /^[\w$]+$/.test(src)
        ? assetUrl(src, imports, slug)
        : absolutize(src, slug),
    );
  });

  // An embed has no markdown form; a link to the thing embedded does. A
  // <video> keeps its URL on a child <source>, and both carry fallback text
  // for a browser that cannot play them, which is not what a reader wants
  // here either.
  out = out.replace(
    /<(iframe|video)\b([^>]*)>([\s\S]*?)<\/\1>/g,
    (tag, element: string, attributes: string, contents: string) => {
      const src =
        attribute(attributes, "src") ??
        attribute(/<source\b[^>]*>/.exec(contents)?.[0] ?? "", "src");
      if (!src) {
        throw new Error(
          `src/docs/${slug}.md has a <${element}> with no src: ${tag}`,
        );
      }
      return `[${attribute(attributes, "title") ?? "Watch the video"}](${src})`;
    },
  );

  // The gallery is a hundred rendered screenshots. There is no markdown for
  // that, and inlining it would drown the page, so it becomes the one link
  // that gets a reader to the thing itself.
  out = out.replace(
    /<ThemeGallery\b[^>]*>\s*(?:<\/ThemeGallery>)?/g,
    `[See the themes rendered on harlequin.sh](${SITE}/docs/themes)`,
  );

  // The callouts, once their contents are markdown.
  const callouts: [RegExp, (tag: string) => string][] = [
    [/<Tip\b([^>]*)>([\s\S]*?)<\/Tip>/g, () => "Tip"],
    [/<Warning\b([^>]*)>([\s\S]*?)<\/Warning>/g, () => "Warning"],
    [
      /<Note\b([^>]*)>([\s\S]*?)<\/Note>/g,
      (tag) => attribute(tag, "title_text") ?? "Note",
    ],
  ];
  for (const [pattern, label] of callouts) {
    out = out.replace(pattern, (_, attributes: string, contents: string) =>
      blockquote(label(attributes), contents),
    );
  }

  // Block wrappers last, innermost first: a <figure> inside a flex <div> is a
  // gallery on the site and two images in a file. Their children are markdown
  // by now, so the wrapper is layout and nothing else — and the indentation it
  // was written with would read as a code block once the tags are gone.
  for (const tag of ["figure", "div"]) out = unwrap(out, tag);

  return out;
}

/**
 * Nothing that looks like a tag or an unresolved expression may survive. A page
 * that grows a component this module has never seen fails the build here, which
 * is the point: the alternative is `<NewThing>` shipped inside a file whose
 * content type promises markdown, and nobody finding out.
 */
function assertNothingLeftOver(prose: string, slug: string) {
  const leftovers = [
    ...[...prose.matchAll(/<\/?([A-Za-z][\w-]*)(?=[\s/>])[^>]*>/g)].map(
      (match) => `${match[0]} — no rule for this tag`,
    ),
    ...[...prose.matchAll(/\{[^{}\n]*\}/g)].map(
      (match) => `${match[0]} — an unresolved expression`,
    ),
  ];

  if (leftovers.length) {
    throw new Error(
      `src/docs/${slug}.md does not sanitize to markdown:\n  ` +
        `${leftovers.join("\n  ")}\n` +
        `Teach src/lib/server/docs.ts what it means, or write it differently.`,
    );
  }
}

/* -------------------------------------------------------------------------- */
/* Descriptions                                                                */
/* -------------------------------------------------------------------------- */

const DESCRIPTION_LIMIT = 120;

/**
 * The line `llms.txt` shows under a title. A `description` in the frontmatter
 * wins, and new pages should set one; the derived first sentence is here so
 * that adding a page never silently leaves a blank row in the index an agent
 * reads first.
 */
function describe(markdown: string): string {
  let fenced = false;
  let prose: string | undefined;
  for (const line of markdown.split("\n").slice(1)) {
    const text = line.trim();
    if (text.startsWith("```")) {
      fenced = !fenced;
    } else if (!fenced && text && !/^(?:[#>*+\-|]|\d+\.|!\[)/.test(text)) {
      prose = text;
      break;
    }
  }
  if (!prose) return "";

  const sentence =
    /^(.*?[.!?])(?:\s|$)/.exec(prose.trim())?.[1] ?? prose.trim();
  // Link text without its target, no emphasis marks, and no trailing colon:
  // a first sentence that introduces a code block reads as a broken line once
  // the code block is not under it.
  const plain = sentence
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/:$/, "");
  if (plain.length <= DESCRIPTION_LIMIT) return plain;
  const cut = plain.slice(0, DESCRIPTION_LIMIT);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:]$/, "")}…`;
}

/* -------------------------------------------------------------------------- */
/* The sanitizer                                                               */
/* -------------------------------------------------------------------------- */

/**
 * One mdsvex source, as the markdown it means. `slug` is the page's path under
 * `/docs`; it is what relative links resolve against and what error messages
 * name.
 */
export function sanitize(
  source: string,
  slug: string,
): { title: string; description: string; markdown: string } {
  const { meta, body } = splitFrontmatter(source, slug);
  const { imports, rest } = takeScript(body);

  const masked = maskCode(rest);
  let prose = downgrade(masked.text, slug, imports);

  // Links after the components, so `<Link>` is included, and before the check,
  // so a relative link left behind is a failure rather than a dead link.
  // `(<…>)` is the destination form markdown has for a URL with a paren in it,
  // and it stays that form: unwrapped, the link would end at the first `)`.
  prose = prose.replace(
    /(!?)\[([^\]]*)\]\((<[^>]*>|[^)\s]+)((?:\s+"[^"]*")?)\)/g,
    (_, bang: string, text: string, target: string, title: string) => {
      const bracketed = target.startsWith("<") && target.endsWith(">");
      const inner = bracketed ? target.slice(1, -1) : target;
      const resolved = bang ? inner : absolutize(inner, slug);
      return `${bang}[${text}](${bracketed ? `<${resolved}>` : resolved}${title})`;
    },
  );

  assertNothingLeftOver(prose, slug);

  const markdown = unmask({ text: prose, pieces: masked.pieces })
    // The malformed spellings too: `&lbrace` without its semicolon is what
    // src/docs/getting-started/hsql.md writes, and it is why the rendered page
    // shows agents a JSON object with `&lbrace` where `{` belongs.
    .replace(/&lbrace;?/g, "{")
    .replace(/&rbrace;?/g, "}")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // A page with no heading of its own reads as a fragment once it is a file
  // rather than a route with a title above it.
  const titled = `# ${meta.title}\n\n${markdown}\n`;

  return {
    title: meta.title,
    description: meta.description ?? describe(titled),
    markdown: titled,
  };
}

/* -------------------------------------------------------------------------- */
/* The corpus                                                                  */
/* -------------------------------------------------------------------------- */

function slugOf(path: string): string {
  return path.slice("/src/docs/".length, -".md".length).replace(/\/index$/, "");
}

/**
 * Every docs page, sanitized, in sidebar order.
 *
 * Order comes from `docsMenu` rather than from the glob so that every consumer
 * — the index, the full-text file, the API — presents the corpus the way the
 * site does. A file the menu does not list is a page no reader can navigate to,
 * and it fails here rather than appearing in `llms.txt` and nowhere else.
 */
export function buildCorpus(): CorpusPage[] {
  const bySlug = new Map(
    Object.entries(sources).map(([path, source]) => [slugOf(path), source]),
  );

  const missing = docsPages
    .filter((page) => !bySlug.has(page.slug))
    .map((page) => page.slug);
  const unlisted = [...bySlug.keys()]
    .filter((slug) => !docsPages.some((page) => page.slug === slug))
    .sort();
  if (missing.length || unlisted.length) {
    throw new Error(
      "The docs corpus and src/lib/docs_menu.ts disagree:" +
        (unlisted.length ? `\n  missing from the menu: ${unlisted}` : "") +
        (missing.length ? `\n  no such markdown file: ${missing}` : ""),
    );
  }

  return docsPages.map((page) => {
    const { title, description, markdown } = sanitize(
      bySlug.get(page.slug) as string,
      page.slug,
    );
    // The title comes from the page, not from the menu: the sidebar shortens
    // an overview page's label to fit next to its siblings ("Adapters
    // Overview" for a page whose own heading is "Database Adapters"), and the
    // heading is the one a reader of the file sees.
    return {
      slug: page.slug,
      title,
      topic: docsTopicLabel(page.slug),
      url: `${SITE}/docs/${page.slug}`,
      description,
      markdown,
    };
  });
}

/** One page of the corpus, by slug, or undefined if there is no such page. */
export function corpusPage(slug: string): CorpusPage | undefined {
  return buildCorpus().find((page) => page.slug === slug);
}
