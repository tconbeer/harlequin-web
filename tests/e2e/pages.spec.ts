import { expect, test } from "./fixtures";

test("home page renders its sections", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/^Harlequin/);
  await expect(
    page.getByRole("heading", { name: "One Engine, Two Interfaces." }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Works with Your Database." }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Join the Flock." }),
  ).toBeAttached();
});

test("header links reach docs, blog and about", async ({ page }) => {
  await page.goto("/");
  const nav = page.locator("nav").first();

  await nav.getByRole("link", { name: "Blog", exact: true }).click();
  await expect(page).toHaveURL(/\/blog$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Harlequin Blog" }),
  ).toBeVisible();

  await nav.getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "About Harlequin" }),
  ).toBeVisible();

  await nav.getByRole("link", { name: "Docs", exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/getting-started$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Installing Harlequin" }),
  ).toBeVisible();
});

test("blog index links to its posts", async ({ page }) => {
  const response = await page.goto("/blog");
  expect(response?.status()).toBe(200);
  const posts = page.getByRole("main").getByRole("listitem");
  expect(await posts.count()).toBeGreaterThanOrEqual(3);

  const firstTitle = await posts.first().getByRole("heading").innerText();
  await posts.first().getByRole("link").click();
  await expect(page).toHaveURL(/\/blog\/[\w-]+$/);
  await expect(page.getByRole("heading", { name: firstTitle })).toBeVisible();
});

test("a blog post renders directly", async ({ page }) => {
  const response = await page.goto("/blog/dr-claude");
  expect(response?.status()).toBe(200);
  await expect(
    page.getByRole("heading", { name: /^Dr\. Claude/ }),
  ).toBeVisible();
  await expect(page.getByText("I’ve been an analyst")).toBeVisible();
});

test.describe("missing pages", () => {
  test.use({ allowedFailures: /\/no-such-page$/ });

  test("an unknown route is a 404", async ({ page }) => {
    const response = await page.goto("/no-such-page");
    expect(response?.status()).toBe(404);
    await expect(page.getByText("404")).toBeVisible();
  });

  test("an unknown docs page is a 404", async ({ page }) => {
    const response = await page.goto("/docs/no-such-page");
    expect(response?.status()).toBe(404);
    await expect(page.getByText("404")).toBeVisible();
  });
});
