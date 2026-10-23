import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.E2E_PORT) || 4317;
// CI builds in a step of its own, so the smoke tests serve that build rather
// than paying for a second one.
const serve = `vite preview --port ${port} --strictPort`;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: `http://localhost:${port}`,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // CI sets this to `chrome`, the runner's preinstalled Chrome, so it
        // downloads no browser and apt-installs nothing.
        channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
        // For a machine with a preinstalled Chromium that is not the build
        // this Playwright release downloads.
        launchOptions: {
          executablePath:
            process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
        },
      },
    },
  ],
  webServer: {
    command: process.env.E2E_PREBUILT ? serve : `vite build && ${serve}`,
    port,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
