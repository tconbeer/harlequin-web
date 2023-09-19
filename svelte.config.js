import adapter from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/kit/vite";
import { mdsvex } from "mdsvex";
import rehypeSlug from "rehype-slug";

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
  extensions: [".md"],
  layout: "./src/mdsvex/docs.svelte",
  highlight: {
    highlighter: (code, lang) => {
      if (lang == "bash") {
        return `<Components.pre><span class="text-purple font-bold select-none">$ </span>${code}</Components.pre>`;
      } else {
        return `<Components.pre>${code}</Components.pre>`;
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
  },
};

export default config;
