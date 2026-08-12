export type DocsPage = {
  title: string;
  slug: string;
  menuOrder: number;
};
export type DocsTopic = {
  topic: string;
  slug: string;
  slugPrefix: string;
  menuOrder: number;
};

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
