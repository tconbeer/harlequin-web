import { expect, test } from "@playwright/test";

// Content types here are the dev/preview server's; in production vercel.json
// sets them, and its redirects do not apply under `vite preview` at all.

test("a docs page's markdown twin", async ({ request }) => {
  const response = await request.get("/docs/duckdb/motherduck.md");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("text/markdown");
  const body = await response.text();
  expect(body).toMatch(/^# MotherDuck\n/);
  expect(body).not.toMatch(/<script|&lbrace;/);
});

test("llms.txt and llms-full.txt", async ({ request }) => {
  const index = await request.get("/llms.txt");
  expect(index.status()).toBe(200);
  expect(index.headers()["content-type"]).toContain("text/plain");
  expect(await index.text()).toContain("https://harlequin.sh/docs/");

  const full = await request.get("/llms-full.txt");
  expect(full.status()).toBe(200);
  expect((await full.text()).length).toBeGreaterThan(
    (await index.text()).length,
  );
});

test("the docs API index and a page from it", async ({ request }) => {
  const response = await request.get("/api/docs/v1.json");
  expect(response.status()).toBe(200);
  const index = await response.json();
  expect(index.pages.length).toBeGreaterThan(50);
  const motherduck = index.pages.find(
    (page: { slug: string }) => page.slug === "duckdb/motherduck",
  );
  expect(motherduck).toMatchObject({
    title: "MotherDuck",
    url: "https://harlequin.sh/docs/duckdb/motherduck",
  });

  const page = await request.get("/api/docs/v1/duckdb/motherduck.json");
  expect(page.status()).toBe(200);
  const markdown = await request.get("/docs/duckdb/motherduck.md");
  expect((await page.json()).markdown).toBe(await markdown.text());
});

test("the search index", async ({ request }) => {
  const response = await request.get("/docs/search/index.json");
  expect(response.status()).toBe(200);
  expect(await response.json()).toBeTruthy();
});

test("the config schema is served under its own $id", async ({ request }) => {
  const response = await request.get("/schemas/config/v1.json");
  expect(response.status()).toBe(200);
  expect((await response.json()).$id).toBe(
    "https://harlequin.sh/schemas/config/v1.json",
  );
});

test("the blog API lists posts newest first", async ({ request }) => {
  const response = await request.get("/api/blog");
  expect(response.status()).toBe(200);
  const posts: { publishedAt: string }[] = await response.json();
  expect(posts.length).toBeGreaterThanOrEqual(3);
  const dates = posts.map((post) => Date.parse(post.publishedAt));
  expect(dates).toEqual([...dates].sort((a, b) => b - a));
});

test("static files", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("User-agent");

  const image = await request.get("/harlequin.png");
  expect(image.status()).toBe(200);
  expect(image.headers()["content-type"]).toBe("image/png");

  const manifest = await request.get("/artifacts/manifest.json");
  expect(manifest.status()).toBe(200);
});
