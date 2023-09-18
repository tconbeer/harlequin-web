export type DocsPage = {
  title: string;
  slug: string;
  menuOrder: number;
};

export type TweetProfile = {
  name: string;
  handle: string;
  img_src: string;
  src: string;
};

export type Tweet = {
  profile: TweetProfile;
  body: string;
  created_at: string;
  src: string;
};
