export const config = {
  isr: {
    expiration: 60 * 60,
  },
};

export async function load({ fetch, params }) {
  const headers = new Headers({
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  });
  const options = {
    headers: headers,
  };
  const repoMap = {
    postgres: "tconbeer/harlequin-postgres",
    mysql: "tconbeer/harlequin-mysql",
    odbc: "tconbeer/harlequin-odbc",
    bigquery: "joshtemple/harlequin-bigquery",
    trino: "TylerHillery/harlequin-trino",
    databricks: "alexmalins/harlequin-databricks",
    adbc: "TylerHillery/harlequin-adbc",
    risingwave: "zen-xu/harlequin-risingwave",
    wherobots: "wherobots/harlequin-wherobots",
    cassandra: "vkhitrin/harlequin-cassandra",
    nebulagraph: "wey-gu/harlequin-nebulagraph",
  };
  const repo = repoMap[params["topic"]];
  if (repo) {
    const endpoint = `https://api.github.com/repos/${repo}`;
    const request = new Request(endpoint, options);
    const response = await fetch(request);
    if (response.ok) {
      const body = await response.json();
      const { forks_count, stargazers_count } = body;
      return { repo, forks_count, stargazers_count };
    }
  }
  return { repo: null };
}
