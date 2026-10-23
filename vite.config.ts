import adapter from "@sveltejs/adapter-vercel";
import { sveltekit } from "@sveltejs/kit/vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { mdsvex, type MdsvexOptions } from "mdsvex";
import { fileURLToPath } from "node:url";
import rehypeSlug from "rehype-slug";
import { defineConfig } from "vitest/config";

const mdsvexOptions: MdsvexOptions = {
  extensions: [".md"],
  // Absolute: mdsvex writes the layout path into each page's import as given.
  layout: fileURLToPath(new URL("./src/mdsvex/docs.svelte", import.meta.url)),
  // Curly quotes and ellipses, but `--` stays `--`: these pages are mostly
  // about a command line, and smartypants turns a `--flag` that is not inside
  // backticks into an em dash. That is silent, it is wrong, and the generated
  // CLI reference is full of help text that mentions a flag in prose.
  smartypants: { dashes: false },
  highlight: {
    highlighter: (code, lang) => {
      // Svelte trims whitespace at the edges of a component's children, which
      // would eat the leading indent and trailing spaces of a code block. The
      // empty expressions are the smallest thing that keeps the text node off
      // both edges, so the code survives verbatim.
      const verbatim = `{""}${code}{""}`;
      if (lang == "bash") {
        return `<Components.pre><span class="text-purple font-bold select-none">$&nbsp;</span>${verbatim}</Components.pre>`;
      } else if (lang == "output") {
        // Not typed by the reader, so: no copy button, no prompt, and a
        // terminal-black block that joins the command block above it.
        return `<Components.output>${verbatim}</Components.output>`;
      } else {
        return `<Components.pre>${verbatim}</Components.pre>`;
      }
    },
  },
  rehypePlugins: [rehypeSlug],
};

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit({
      extensions: [".svelte", ".md"],
      preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
      // The ISR pages and /api/blog run as Vercel functions. Named here so the
      // production runtime is the line `engines.node` pins rather than whatever
      // Node the build happened to run on.
      adapter: adapter({ runtime: "nodejs24.x" }),
      csp: {
        mode: "auto",
        directives: {
          "script-src": ["self"],
          "object-src": ["none"],
          "base-uri": ["self"],
        },
        reportOnly: {
          "report-to": ["self"],
        },
      },
      prerender: {
        handleMissingId: "ignore",
      },
    }),
  ],
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
