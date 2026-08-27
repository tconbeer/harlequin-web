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
 * index page of a directory takes the bare directory name.
 */
export const docsMenu: DocsMenuItem[] = [
  {
    topic: "Getting Started",
    slug: "getting-started",
    pages: [
      { title: "Installing Harlequin", slug: "getting-started" },
      { title: "Running Harlequin", slug: "getting-started/running" },
      { title: "Using Harlequin", slug: "getting-started/usage" },
      { title: "Using hsql", slug: "getting-started/hsql" },
      { title: "Getting Help", slug: "getting-started/help" },
    ],
  },
  { title: "Database Adapters", slug: "adapters" },
  {
    topic: "Viewing Files",
    slug: "files",
    pages: [
      { title: "Files Overview", slug: "files" },
      { title: "Local Files", slug: "files/local" },
      { title: "Remote Objects (S3)", slug: "files/remote" },
    ],
  },
  { title: "Choosing a Theme", slug: "themes" },
  {
    topic: "Configuring Harlequin",
    slug: "config-file",
    pages: [
      { title: "Config Overview", slug: "config-file" },
      { title: "Creating Config Files", slug: "config-file/creating-config" },
      { title: "Discovering Config Files", slug: "config-file/discovery" },
      { title: "Selecting a Profile", slug: "config-file/profiles" },
    ],
  },
  {
    topic: "Customizing Key Bindings",
    slug: "keymaps",
    pages: [
      { title: "About Key Bindings", slug: "keymaps" },
      { title: "Creating a Keymap", slug: "keymaps/config" },
      { title: "Selecting Keymaps", slug: "keymaps/usage" },
    ],
  },
  { title: "Exporting Data", slug: "export" },
  { title: "Managing Transactions", slug: "transactions" },
  {
    topic: "Adapter: DuckDB",
    slug: "duckdb",
    pages: [
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
    pages: [
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
    pages: [
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
    topic: "Adapter: BigQuery",
    slug: "bigquery",
    repo: "joshtemple/harlequin-bigquery",
    pages: [
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
    pages: [
      { title: "Installation and Basic Usage", slug: "databricks" },
      { title: "Initialization Scripts", slug: "databricks/initialization" },
    ],
  },
  { title: "Adapter: ADBC", slug: "adbc", repo: "TylerHillery/harlequin-adbc" },
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
  { title: "Reference: Default Bindings", slug: "bindings" },
  {
    topic: "Troubleshooting",
    slug: "troubleshooting",
    pages: [
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
    pages: [
      { title: "Ways to Contribute", slug: "contributing" },
      { title: "Creating an Adapter", slug: "contributing/adapter-guide" },
    ],
  },
];

export function isTopic(item: DocsMenuItem): item is DocsTopic {
  return "pages" in item;
}

/** Every page, flattened into sidebar order. Drives Previous/Next. */
export const docsPages: DocsPage[] = docsMenu.flatMap((item) =>
  isTopic(item) ? item.pages : [item],
);

/** The label of the group a page belongs to, or null for a top-level page. */
const topicBySlug = new Map<string, string>(
  docsMenu.flatMap((item) =>
    isTopic(item)
      ? item.pages.map((page): [string, string] => [page.slug, item.topic])
      : [],
  ),
);

/** GitHub repo by first slug segment, for both grouped and standalone pages. */
const repoByTopicSlug = new Map<string, string>(
  docsMenu.flatMap((item): [string, string][] =>
    item.repo ? [[item.slug, item.repo]] : [],
  ),
);

export function docsTopicLabel(slug: string): string | null {
  return topicBySlug.get(slug) ?? null;
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
