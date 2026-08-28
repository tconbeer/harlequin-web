// A single docs page: one markdown file under src/docs. `slug` is the URL path
// after /docs/, and matches the file path with `.md` (and a trailing `/index`)
// stripped: src/docs/duckdb/motherduck.md -> "duckdb/motherduck".
export type DocsPage = {
  title: string;
  slug: string;
  // For a third-party adapter, "owner/name" on GitHub; drives the stars badge.
  repo?: string;
};

// A collapsible group in the sidebar. `slug` is its overview page — the
// directory's index.md — which the group's label links to and which is also
// listed first among its items. `items` are usually pages, but a group that
// collects other groups (Database Adapters) nests them here instead.
export type DocsTopic = {
  topic: string;
  slug: string;
  repo?: string;
  items: DocsMenuItem[];
};

export type DocsMenuItem = DocsTopic | DocsPage;

export type BlogPage = {
  title: string;
  slug: string;
  publishedAt: string;
  lede: string;
};

export type TweetProfile = {
  name: string;
  handle: string;
  img_src: string;
  src: string;
};

// One line of a mocked-up terminal session. "command" lines get a prompt,
// "note" lines are what hsql writes to stderr, and everything else is stdout.
export type TerminalLine = {
  text: string;
  kind?: "command" | "note";
};

export type Tweet = {
  profile: TweetProfile;
  body: string;
  created_at: string;
  src: string;
};
