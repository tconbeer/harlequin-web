export const config = {
  isr: {
    expiration: 60 * 60,
  },
};

export async function load({ fetch }) {
  const headers = new Headers({
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  });
  const options = {
    headers: headers,
  };
  const repo = "tconbeer/harlequin";
  const endpoint = `https://api.github.com/repos/${repo}`;
  const request = new Request(endpoint, options);
  const response = await fetch(request);
  if (!response.ok) {
    return { forks_count: 92, stargazers_count: 4085 };
  }
  const body = await response.json();
  const { forks_count, stargazers_count } = body;
  return { repo, forks_count, stargazers_count };
}
