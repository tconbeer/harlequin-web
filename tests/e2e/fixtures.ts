import { test as base, expect } from "@playwright/test";

type Fixtures = {
  // Same-origin URLs a test expects to fail, e.g. the 404 page itself.
  allowedFailures: RegExp | null;
  pageErrors: string[];
};

/**
 * Fails any test whose page logs a console error, throws, or gets a failing
 * same-origin response. Third-party requests (GitHub's API, Google Fonts) are
 * outside the site's control and are not counted.
 */
export const test = base.extend<Fixtures>({
  allowedFailures: [null, { option: true }],
  pageErrors: [
    async ({ page, baseURL, allowedFailures }, use) => {
      const errors: string[] = [];
      const sameOrigin = (url: string) => url.startsWith(baseURL ?? "");
      const allowed = (url: string) => allowedFailures?.test(url) ?? false;

      // The unauthenticated GitHub API rate-limits shared CI runners; a stub
      // keeps the badge, and the test, the same on every run.
      await page.route("https://api.github.com/repos/**", (route) =>
        route.fulfill({
          json: { forks_count: 100, stargazers_count: 5000 },
        }),
      );
      page.on("console", (message) => {
        if (message.type() !== "error") return;
        const location = message.location().url;
        if (location && !sameOrigin(location)) return;
        // Chromium reports a failed load as a console error naming no URL;
        // the response listener below decides whether that one counts.
        if (message.text().startsWith("Failed to load resource")) return;
        errors.push(`console: ${message.text()}`);
      });
      page.on("pageerror", (error) => errors.push(`pageerror: ${error}`));
      page.on("requestfailed", (request) => {
        const url = request.url();
        if (!sameOrigin(url) || allowed(url)) return;
        errors.push(`requestfailed: ${url} ${request.failure()?.errorText}`);
      });
      page.on("response", (response) => {
        const url = response.url();
        if (!sameOrigin(url) || allowed(url) || response.status() < 400) return;
        errors.push(`response: ${response.status()} ${url}`);
      });

      await use(errors);
      expect(errors, "errors on the page").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
