import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    // The tests read the docs corpus through `import.meta.glob`, so they need
    // Vite's resolution, not Node's — which is why the test runner is this one
    // and not a bare script.
    include: ["src/**/*.test.ts"],
  },
});
