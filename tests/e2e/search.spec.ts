import { expect, test } from "./fixtures";

test("the sidebar search suggests pages as you type", async ({ page }) => {
  await page.goto("/docs/getting-started");
  const box = page.getByRole("combobox");
  await box.fill("motherduck");
  const hits = page.getByRole("listbox", { name: "Search results" });
  await expect(hits.getByRole("option").first()).toBeVisible();
  await expect(hits).toContainText("MotherDuck");

  await box.press("ArrowDown");
  await box.press("Enter");
  await expect(page).toHaveURL(/\/docs\/[\w/-]+\?q=motherduck(#|$)/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("Enter with no row selected opens the results page", async ({ page }) => {
  await page.goto("/docs/getting-started");
  const box = page.getByRole("combobox");
  await box.fill("limit");
  await expect(page.getByRole("option").first()).toBeVisible();
  await box.press("Enter");
  await expect(page).toHaveURL(/\/docs\/search\?q=limit$/);
  await expect(page.getByRole("main").getByRole("link")).not.toHaveCount(0);
});

test("the results page reads its query from the URL", async ({ page }) => {
  const response = await page.goto("/docs/search?q=config");
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle("Harlequin: Search: config");
  await expect(page.getByRole("combobox")).toHaveValue("config");
  await expect(
    page
      .getByRole("article")
      .getByRole("link", { name: /config/i })
      .first(),
  ).toBeVisible();
});

test("the / shortcut focuses the search box", async ({ page }) => {
  await page.goto("/docs/getting-started");
  await page.locator("body").press("/");
  await expect(page.getByRole("combobox")).toBeFocused();
});
