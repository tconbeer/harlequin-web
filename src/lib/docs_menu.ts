import type { DocsMenuItem, DocsPage, DocsTopic } from "$lib/types";

/**
 * The docs sidebar, declared by hand.
 *
 * This is the single source of truth for what is in the docs, what order it is
 * in, and how it is grouped. Array order is menu order — there is no sort key
 * to keep in sync — and `src/routes/api/docs/v1` fails the build if this list
 * and `src/docs/**\/*.md` disagree about which pages exist.
 *
 * To add a page: write the markdown file, then add an entry here next to its
 * neighbors. A `slug` is the path under `src/docs` with `.md` stripped; the
 * index page of a directory takes the bare directory name, and a topic repeats
 * that page as the first of its `items` so the overview has a row of its own.
 */
export const docsMenu: DocsMenuItem[] = [
  {
    topic: "Getting Started",
    slug: "getting-started",
    items: [
      { title: "Installing Harlequin", slug: "getting-started" },
      { title: "Running Harlequin", slug: "getting-started/running" },
      { title: "Using Harlequin", slug: "getting-started/usage" },
      { title: "Using hsql", slug: "getting-started/hsql" },
      { title: "Getting Help", slug: "getting-started/help" },
    ],
  },
  {
    // Fourteen adapters would be most of the menu, so they collapse into one
    // row near the top. The topics nested here are groups in their own
    // right; the rest are single-page adapters that sit alongside them.
    topic: "Database Adapters",
    slug: "adapters",
    items: [
      { title: "Adapters Overview", slug: "adapters" },
      {
        topic: "Adapter: DuckDB",
        slug: "duckdb",
        items: [
          { title: "DuckDB Basic Usage", slug: "duckdb" },
          { title: "Initialization Scripts", slug: "duckdb/initialization" },
          { title: "Loading Extensions", slug: "duckdb/extensions" },
          { title: "Transaction Handling", slug: "duckdb/transactions" },
          { title: "MotherDuck", slug: "duckdb/motherduck" },
        ],
      },
      {
        topic: "Adapter: SQLite",
        slug: "sqlite",
        items: [
          { title: "SQLite Basic Usage", slug: "sqlite" },
          { title: "Initialization Scripts", slug: "sqlite/initialization" },
          { title: "Loading Extensions", slug: "sqlite/extensions" },
          { title: "Transaction Handling", slug: "sqlite/transactions" },
        ],
      },
      {
        topic: "Adapter: Postgres",
        slug: "postgres",
        repo: "tconbeer/harlequin-postgres",
        items: [
          { title: "Postgres Basic Usage", slug: "postgres" },
          { title: "Multiple Databases", slug: "postgres/multiple" },
          { title: "Transaction Handling", slug: "postgres/transactions" },
        ],
      },
      {
        title: "Adapter: MySQL/MariaDB",
        slug: "mysql",
        repo: "tconbeer/harlequin-mysql",
      },
      { title: "Adapter: ODBC", slug: "odbc", repo: "tconbeer/harlequin-odbc" },
      {
        title: "Adapter: H2",
        slug: "h2",
        repo: "clang-engineer/harlequin-h2",
      },
      {
        topic: "Adapter: BigQuery",
        slug: "bigquery",
        repo: "joshtemple/harlequin-bigquery",
        items: [
          { title: "BQ Installation and Configuration", slug: "bigquery" },
          { title: "Auth and Permissions", slug: "bigquery/auth" },
        ],
      },
      {
        title: "Adapter: Trino",
        slug: "trino",
        repo: "rogerioguicampos/harlequin-trino",
      },
      {
        topic: "Adapter: Databricks",
        slug: "databricks",
        repo: "alexmalins/harlequin-databricks",
        items: [
          { title: "Installation and Basic Usage", slug: "databricks" },
          {
            title: "Initialization Scripts",
            slug: "databricks/initialization",
          },
        ],
      },
      {
        title: "Adapter: ADBC",
        slug: "adbc",
        repo: "TylerHillery/harlequin-adbc",
      },
      {
        title: "Adapter: RisingWave",
        slug: "risingwave",
        repo: "zen-xu/harlequin-risingwave",
      },
      {
        title: "Adapter: Wherobots",
        slug: "wherobots",
        repo: "wherobots/harlequin-wherobots",
      },
      {
        title: "Adapter: Cassandra",
        slug: "cassandra",
        repo: "vkhitrin/harlequin-cassandra",
      },
      {
        title: "Adapter: NebulaGraph",
        slug: "nebulagraph",
        repo: "wey-gu/harlequin-nebulagraph",
      },
      {
        title: "Adapter: Exasol",
        slug: "exasol",
        repo: "Nicoretti/harlequin-exasol",
      },
    ],
  },
  {
    topic: "Configuring Harlequin",
    slug: "config-file",
    items: [
      { title: "Config Overview", slug: "config-file" },
      { title: "Creating Config Files", slug: "config-file/creating-config" },
      { title: "Discovering Config Files", slug: "config-file/discovery" },
      { title: "Selecting a Profile", slug: "config-file/profiles" },
    ],
  },
  {
    topic: "Viewing Files",
    slug: "files",
    items: [
      { title: "Files Overview", slug: "files" },
      { title: "Local Files", slug: "files/local" },
      { title: "Remote Objects (S3)", slug: "files/remote" },
    ],
  },
  { title: "Choosing a Theme", slug: "themes" },
  {
    topic: "Customizing Key Bindings",
    slug: "keymaps",
    items: [
      { title: "About Key Bindings", slug: "keymaps" },
      { title: "Creating a Keymap", slug: "keymaps/config" },
      { title: "Selecting Keymaps", slug: "keymaps/usage" },
    ],
  },
  { title: "Exporting Data", slug: "export" },
  { title: "Managing Transactions", slug: "transactions" },
  { title: "Reference: Default Bindings", slug: "bindings" },
  {
    topic: "Troubleshooting",
    slug: "troubleshooting",
    items: [
      { title: "Common Problems", slug: "troubleshooting" },
      { title: "Key Bindings", slug: "troubleshooting/key-bindings" },
      {
        title: "Copying and Pasting",
        slug: "troubleshooting/copying-and-pasting",
      },
      { title: "Appearance", slug: "troubleshooting/appearance" },
      { title: "Locale", slug: "troubleshooting/locale" },
      {
        title: "Windows Timezone Database",
        slug: "troubleshooting/timezone-windows",
      },
      {
        title: "DuckDB Version Mismatch",
        slug: "troubleshooting/duckdb-version-mismatch",
      },
      {
        title: "Terminal Recommendations",
        slug: "troubleshooting/terminal-recommendations",
      },
    ],
  },
  {
    topic: "Contributing to Harlequin",
    slug: "contributing",
    items: [
      { title: "Ways to Contribute", slug: "contributing" },
      { title: "Creating an Adapter", slug: "contributing/adapter-guide" },
    ],
  },
];

export function isTopic(item: DocsMenuItem): item is DocsTopic {
  return "items" in item;
}

/**
 * Every page, flattened into sidebar order, with the topics it sits inside
 * (outermost first). A topic's overview page appears once — as the first of
 * its own items — so the flat list has one entry per markdown file.
 */
function walk(
  items: DocsMenuItem[],
  ancestors: DocsTopic[] = [],
): { page: DocsPage; ancestors: DocsTopic[] }[] {
  return items.flatMap((item) =>
    isTopic(item)
      ? walk(item.items, [...ancestors, item])
      : [{ page: item, ancestors }],
  );
}

const flattened = walk(docsMenu);

/** Every page, in sidebar order. Drives Previous/Next. */
export const docsPages: DocsPage[] = flattened.map((entry) => entry.page);

type TopicEntry = { topic: DocsTopic; parent: DocsTopic | null };

function collectTopics(
  items: DocsMenuItem[],
  parent: DocsTopic | null = null,
): TopicEntry[] {
  return items.flatMap((item) =>
    isTopic(item)
      ? [{ topic: item, parent }, ...collectTopics(item.items, item)]
      : [],
  );
}

/** Every topic, outermost first, paired with the topic that contains it. */
export const docsTopics: TopicEntry[] = collectTopics(docsMenu);

const ancestorsBySlug = new Map<string, DocsTopic[]>(
  flattened.map((entry) => [entry.page.slug, entry.ancestors]),
);

/** GitHub repo by first slug segment, for both grouped and standalone pages. */
const repoByTopicSlug = new Map<string, string>(
  [...docsTopics.map((entry) => entry.topic), ...docsPages].flatMap(
    (item): [string, string][] => (item.repo ? [[item.slug, item.repo]] : []),
  ),
);

/** The topics containing a page, outermost first; empty for a top-level page. */
export function docsAncestors(slug: string): DocsTopic[] {
  return ancestorsBySlug.get(slug) ?? [];
}

/** The label of the group a page sits in directly, or null at the top level. */
export function docsTopicLabel(slug: string): string | null {
  return docsAncestors(slug).at(-1)?.topic ?? null;
}

/** The repo documented by a topic — `params.topic`, not a full page slug. */
export function docsRepo(topicSlug: string): string | null {
  return repoByTopicSlug.get(topicSlug) ?? null;
}

/** The pages on either side of `slug`, for the Previous/Next buttons. */
export function docsNeighbors(slug: string): {
  prev: DocsPage | null;
  next: DocsPage | null;
} {
  const i = docsPages.findIndex((page) => page.slug === slug);
  if (i < 0) return { prev: null, next: null };
  return { prev: docsPages[i - 1] ?? null, next: docsPages[i + 1] ?? null };
}
