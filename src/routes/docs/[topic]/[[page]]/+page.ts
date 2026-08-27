import { docsRepo } from "$lib/docs_menu";
import { error, redirect } from "@sveltejs/kit";

export const config = {
  isr: {
    expiration: 60 * 60,
  },
};

// A topic is either a single file (src/docs/adapters.md) or a directory with an
// index (src/docs/duckdb/index.md); both answer to /docs/<topic>.
async function importPage(topic: string, page: string | undefined) {
  if (page) {
    return await import(`../../../../docs/${topic}/${page}.md`);
  }
  try {
    return await import(`../../../../docs/${topic}.md`);
  } catch {
    return await import(`../../../../docs/${topic}/index.md`);
  }
}

// Unauthenticated, so rate-limited and allowed to fail: the badge is nice to
// have and the page must not wait on it or break with it.
async function getRepoStats(fetch: typeof globalThis.fetch, repo: string) {
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    if (!response.ok) return null;
    const { forks_count, stargazers_count } = await response.json();
    return { repo, forks_count, stargazers_count };
  } catch {
    return null;
  }
}

export async function load({ fetch, params, url }) {
  // /docs/duckdb/index is how the sidebar used to link to /docs/duckdb. Send
  // the old shape to the canonical one rather than serving both.
  if (params.page === "index") {
    redirect(308, `/docs/${params.topic}${url.search}`);
  }

  let page;
  try {
    page = await importPage(params.topic, params.page);
  } catch {
    error(
      404,
      `Could not find /docs/${params.topic}${params.page ? `/${params.page}` : ""}`,
    );
  }

  // Every page of an adapter topic carries its repo badge, not just the index.
  const repo = docsRepo(params.topic);
  return {
    content: page.default,
    meta: page.metadata,
    github: repo ? await getRepoStats(fetch, repo) : null,
  };
}
