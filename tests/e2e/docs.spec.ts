import { expect, test } from "./fixtures";

test("a deep docs page opens its branch of the sidebar", async ({ page }) => {
  const response = await page.goto("/docs/duckdb/motherduck");
  expect(response?.status()).toBe(200);
  await expect(
    page.getByRole("heading", { level: 1, name: "MotherDuck" }),
  ).toBeVisible();

  const sidebar = page.getByRole("navigation", { name: "Documentation" });
  await expect(
    sidebar.getByRole("link", { name: "MotherDuck", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await expect(page).toHaveTitle("Harlequin: MotherDuck");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://harlequin.sh/docs/duckdb/motherduck",
  );
});

test("the sidebar and pager navigate between pages", async ({ page }) => {
  await page.goto("/docs/getting-started");
  const pager = page.getByRole("navigation", { name: "Pager" });
  await pager.getByRole("link", { name: /Next/ }).click();
  await expect(page).toHaveURL(/\/docs\/getting-started\/running$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Running Harlequin" }),
  ).toBeVisible();

  await pager.getByRole("link", { name: /Previous/ }).click();
  await expect(page).toHaveURL(/\/docs\/getting-started$/);

  const sidebar = page.getByRole("navigation", { name: "Documentation" });
  await sidebar.getByRole("link", { name: "Choosing a Theme" }).click();
  await expect(page).toHaveURL(/\/docs\/themes$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Choosing a Theme" }),
  ).toBeVisible();
});

test("a sidebar topic expands and collapses", async ({ page }) => {
  await page.goto("/docs/getting-started");
  const sidebar = page.getByRole("navigation", { name: "Documentation" });
  const toggle = sidebar.getByRole("button", { name: "Expand The hsql CLI" });
  await toggle.click();
  await expect(
    sidebar.getByRole("link", { name: "Exit Codes and Streams" }),
  ).toBeVisible();
  await sidebar.getByRole("button", { name: "Collapse The hsql CLI" }).click();
  await expect(
    sidebar.getByRole("link", { name: "Exit Codes and Streams" }),
  ).toBeHidden();
});

test("the theme gallery shows every theme", async ({ page }) => {
  await page.goto("/docs/themes");
  const gallery = page.locator("article img[src$='.svg']");
  await expect(gallery.first()).toBeAttached();
  expect(await gallery.count()).toBeGreaterThanOrEqual(12);
  // Lazy images get their source once scrolled into view.
  await gallery.first().scrollIntoViewIfNeeded();
  await expect(gallery.first()).toHaveJSProperty("complete", true);
});

test("an index page's /index URL redirects to the topic", async ({ page }) => {
  await page.goto("/docs/duckdb/index");
  await expect(page).toHaveURL(/\/docs\/duckdb$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "DuckDB Basic Usage" }),
  ).toBeVisible();
});

test("View as Markdown links to the page's .md twin", async ({ page }) => {
  await page.goto("/docs/duckdb/motherduck");
  const link = page.getByRole("link", { name: "View as Markdown" });
  await expect(link).toHaveAttribute("href", "/docs/duckdb/motherduck.md");
});

test("Copy as Markdown puts the page on the clipboard", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/docs/duckdb/motherduck");
  await page.getByRole("button", { name: /Copy as Markdown/ }).click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toContain("# MotherDuck");
});
