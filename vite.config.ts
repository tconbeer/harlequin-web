import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [sveltekit()],
  build: {
    // Every asset gets a URL, however small it is. A figure's src is the URL
    // Vite serves it from, and `src/lib/server/docs.ts` absolutizes that into
    // the markdown corpus — an asset inlined as a data URI would ship its
    // whole payload inside every page that shows it.
    assetsInlineLimit: 0,
  },
  test: {
    // The tests read the docs corpus through `import.meta.glob`, so they need
    // Vite's resolution, not Node's — which is why the test runner is this one
    // and not a bare script.
    include: ["src/**/*.test.ts"],
  },
});
