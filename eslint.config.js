import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import svelte from "eslint-plugin-svelte";
import { defineConfig } from "eslint/config";
import globals from "globals";
import ts from "typescript-eslint";
import svelteConfig from "./svelte.config.js";

export default defineConfig(
  {
    ignores: [
      ".svelte-kit/",
      ".vercel/",
      "build/",
      "package/",
      "playwright-report/",
      "test-results/",
      // Vendored from tconbeer/harlequin and pinned by its manifest.
      "static/artifacts/",
    ],
  },
  js.configs.recommended,
  ts.configs.recommended,
  svelte.configs.recommended,
  prettier,
  svelte.configs.prettier,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      // The site has no `paths.base`, so `resolve()` would be a no-op on
      // every internal link.
      "svelte/no-navigation-without-resolve": "off",
      // Every list here is static, rendered once and never reordered.
      "svelte/require-each-key": "off",
    },
  },
  {
    files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],
    languageOptions: {
      parserOptions: {
        parser: ts.parser,
        extraFileExtensions: [".svelte"],
        svelteConfig,
      },
    },
  },
);
