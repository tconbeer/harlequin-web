import adapter from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsvex } from "mdsvex";
import rehypeSlug from "rehype-slug";

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
  extensions: [".md"],
  layout: "./src/mdsvex/docs.svelte",
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

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  extensions: [".svelte", ".md"],
  preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],

  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter(),
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
  },
};

export default config;
