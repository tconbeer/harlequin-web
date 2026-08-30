/**
 * The sanitizer, rewrite by rewrite.
 *
 * Each of the eight steps `sanitize()` performs gets its own assertions, over
 * a source written inline rather than over a page from `src/docs`. That is
 * deliberate: a test that reads a real page fails when someone rewords the
 * page, which teaches everyone to stop reading the failure. These fail only
 * when the sanitizer changes.
 *
 * What it costs is the whole-page view — nothing here would notice two
 * rewrites that are each right and compose wrong. `docs_lint.test.ts` covers
 * the corpus for the properties that can be stated without pinning its prose.
 */

import { describe, expect, it } from "vitest";
import { buildCorpus, corpusPage, sanitize } from "./docs";

describe("frontmatter", () => {
  it("takes the title out of the body and puts it back as a heading", () => {
    const { title, markdown } = sanitize(
      "---\ntitle: Using hsql\n---\n\nBody.\n",
      "getting-started/hsql",
    );
    expect(title).toBe("Using hsql");
    expect(markdown).toBe("# Using hsql\n\nBody.\n");
  });

  it("refuses a page with no frontmatter", () => {
    expect(() => sanitize("Body.\n", "orphan")).toThrow(/no frontmatter/);
  });

  it("refuses a page with no title", () => {
    expect(() => sanitize("---\nfoo: bar\n---\n\nBody.\n", "orphan")).toThrow(
      /no title/,
    );
  });
});

describe("descriptions", () => {
  const meta = "---\ntitle: T\n---\n\n";

  it("derives the first sentence of prose", () => {
    const { description } = sanitize(
      `${meta}## Heading\n\nFirst one. Second one.\n`,
      "p",
    );
    expect(description).toBe("First one.");
  });

  it("skips headings, lists, code and images to find it", () => {
    const { description } = sanitize(
      `${meta}## Heading\n\n- a list\n\n\`\`\`bash\nls\n\`\`\`\n\nThe prose.\n`,
      "p",
    );
    expect(description).toBe("The prose.");
  });

  it("truncates on a word boundary", () => {
    const { description } = sanitize(`${meta}${"word ".repeat(40)}\n`, "p");
    expect(description.length).toBeLessThanOrEqual(121);
    expect(description).toMatch(/word…$/);
  });

  it("lets the frontmatter override it", () => {
    const { description } = sanitize(
      `---\ntitle: T\ndescription: The one we meant.\n---\n\nSomething else.\n`,
      "p",
    );
    expect(description).toBe("The one we meant.");
  });
});

describe("components", () => {
  const wrap = (body: string) =>
    sanitize(`---\ntitle: T\n---\n\n${body}\n`, "a/b").markdown;

  it("downgrades <Key> to code", () => {
    expect(wrap("Press <Key>ctrl+q</Key> to quit.")).toContain(
      "Press `ctrl+q` to quit.",
    );
  });

  it("downgrades <Link> to a markdown link", () => {
    expect(wrap('<Link href="/docs/themes">themes</Link>')).toContain(
      "[themes](https://harlequin.sh/docs/themes)",
    );
  });

  it("downgrades callouts to blockquotes, keeping the markdown inside", () => {
    expect(wrap("<Tip>\nSee [themes](/docs/themes).\n</Tip>")).toContain(
      "> **Tip:** See [themes](https://harlequin.sh/docs/themes).",
    );
    expect(wrap("<Warning>Careful.</Warning>")).toContain(
      "> **Warning:** Careful.",
    );
    expect(
      wrap('<Note title_text="Note for Mac Users">Careful.</Note>'),
    ).toContain("> **Note for Mac Users:** Careful.");
    expect(wrap("<Note>Careful.</Note>")).toContain("> **Note:** Careful.");
  });

  it("keeps a multi-line callout a blockquote all the way down", () => {
    expect(wrap("<Tip>\nOne.\n\nTwo.\n</Tip>")).toContain(
      "> **Tip:** One.\n>\n> Two.",
    );
  });

  it("replaces the theme gallery with a link to the rendered page", () => {
    expect(wrap("<ThemeGallery grow=false></ThemeGallery>")).toContain(
      "[See the themes rendered on harlequin.sh](https://harlequin.sh/docs/themes)",
    );
  });

  it("refuses a component it has no rule for", () => {
    expect(() => wrap("<Carousel></Carousel>")).toThrow(/no rule for this tag/);
  });

  it("refuses an identifier it could not resolve", () => {
    expect(() => wrap("The value is {answer}.")).toThrow(
      /an unresolved expression/,
    );
  });
});

describe("figures", () => {
  const page = (body: string) =>
    sanitize(
      `---\ntitle: T\n---\n\n<script>\n  import init from "$lib/assets/docs/getting-started/init.png"\n</script>\n\n${body}\n`,
      "a/b",
    ).markdown;

  it("resolves src={identifier} through the script block's imports", () => {
    expect(page('<Figure src={init} alt="A screenshot."></Figure>')).toMatch(
      /!\[A screenshot\.\]\(https:\/\/harlequin\.sh\/\S*init\S*\.png\)/,
    );
  });

  it("adds a caption as an italic line under the image", () => {
    expect(
      page('<Figure src={init} alt="A." caption="A blank slate."></Figure>'),
    ).toContain("\n\n*A blank slate.*");
  });

  it("reads a hand-rolled <figure> the same way", () => {
    const markdown = page(
      '<div class="flex">\n' +
        "    <figure>\n" +
        '        <img src={init} alt="A." class="h-auto">\n' +
        '        <figcaption class="text-center">A blank slate.</figcaption>\n' +
        "    </figure>\n" +
        "</div>",
    );
    expect(markdown).toMatch(/!\[A\.\]\(https:\/\/harlequin\.sh\/\S+\.png\)/);
    expect(markdown).toContain("*A blank slate.*");
    // Dedented: the wrapper's indentation would otherwise read as a code block.
    expect(markdown).not.toMatch(/^ {4}!\[/m);
  });

  it("refuses an identifier the script block does not import", () => {
    expect(() => page("<Figure src={nope}></Figure>")).toThrow(
      /does not import it/,
    );
  });

  it("refuses an import that names no file", () => {
    expect(() =>
      sanitize(
        `---\ntitle: T\n---\n\n<script>\n  import gone from "$lib/assets/docs/gone.png"\n</script>\n\n<Figure src={gone}></Figure>\n`,
        "a/b",
      ),
    ).toThrow(/no such file under src\/lib\/assets/);
  });
});

describe("links", () => {
  const link = (body: string, slug = "duckdb/motherduck") =>
    sanitize(`---\ntitle: T\n---\n\n${body}\n`, slug).markdown;

  it("absolutizes a site-absolute path", () => {
    expect(link("[a](/docs/themes)")).toContain(
      "[a](https://harlequin.sh/docs/themes)",
    );
  });

  it("resolves a relative path against the page's own directory", () => {
    expect(link("[a](initialization)")).toContain(
      "[a](https://harlequin.sh/docs/duckdb/initialization)",
    );
    expect(link("[a](../config-file)")).toContain(
      "[a](https://harlequin.sh/docs/config-file)",
    );
  });

  it("drops a trailing /index the way the router's 308 drops it", () => {
    expect(link("[a](/docs/duckdb/index)")).toContain(
      "[a](https://harlequin.sh/docs/duckdb)",
    );
    expect(link("[a](mysql/index)", "adapters")).toContain(
      "[a](https://harlequin.sh/docs/mysql)",
    );
  });

  it("keeps a fragment on the end", () => {
    expect(link("[a](/docs/bindings#results-viewer-bindings)")).toContain(
      "[a](https://harlequin.sh/docs/bindings#results-viewer-bindings)",
    );
  });

  it("leaves external links, anchors and mail alone", () => {
    expect(link("[a](https://duckdb.org)")).toContain(
      "[a](https://duckdb.org)",
    );
    expect(link("[a](#colors)")).toContain("[a](#colors)");
    expect(link("[a](mailto:ted@example.com)")).toContain(
      "[a](mailto:ted@example.com)",
    );
  });
});

describe("code", () => {
  const code = (body: string) =>
    sanitize(`---\ntitle: T\n---\n\n${body}\n`, "a/b").markdown;

  it("unlabels the site-private output fence", () => {
    expect(code("```output\nhello\n```")).toContain("```\nhello\n```");
  });

  it("leaves bash fences labelled, and adds no prompt", () => {
    expect(code("```bash\nharlequin\n```")).toContain(
      "```bash\nharlequin\n```",
    );
    expect(code("```bash\nharlequin\n```")).not.toContain("$ harlequin");
  });

  it("un-escapes the braces mdsvex made the author write", () => {
    expect(code('```json\n&lbrace;"a": 1&rbrace;\n```')).toContain(
      '```json\n{"a": 1}\n```',
    );
  });

  it("un-escapes the malformed spelling too", () => {
    // src/docs/getting-started/hsql.md writes `&lbrace` without its semicolon,
    // which is why the rendered page shows `&amp;lbrace` to anyone reading the
    // --stats example.
    expect(code('```output\n&lbrace"status":"ok"&rbrace\n```')).toContain(
      '```\n{"status":"ok"}\n```',
    );
  });

  it("does not rewrite anything inside a fence", () => {
    const fenced = "```svelte\n<Key>a</Key>\n[b](/docs/themes)\n```";
    expect(code(fenced)).toContain(fenced);
  });

  it("does not rewrite anything inside an inline span", () => {
    expect(code("Pass `--md_token <my token>` to it.")).toContain(
      "Pass `--md_token <my token>` to it.",
    );
  });
});

describe("the corpus", () => {
  const corpus = buildCorpus();

  it("has one page per markdown file, in sidebar order", () => {
    const files = import.meta.glob("/src/docs/**/*.md");
    expect(corpus.length).toBe(Object.keys(files).length);
    expect(corpus[0].slug).toBe("getting-started");
  });

  it("gives every page a title, a description and a canonical URL", () => {
    for (const page of corpus) {
      expect(page.title, page.slug).toBeTruthy();
      expect(page.description, page.slug).toBeTruthy();
      expect(page.url).toBe(`https://harlequin.sh/docs/${page.slug}`);
    }
  });

  it("opens every page with its title as an h1", () => {
    for (const page of corpus) {
      expect(page.markdown.split("\n")[0], page.slug).toBe(`# ${page.title}`);
    }
  });

  it("finds a page by slug", () => {
    expect(corpusPage("duckdb/motherduck")?.title).toBe("MotherDuck");
    expect(corpusPage("no/such/page")).toBeUndefined();
  });
});
