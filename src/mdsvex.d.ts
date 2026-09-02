// mdsvex compiles a `.md` file into a Svelte component, which TypeScript has no
// way to know: the docs route imports one per page, and the CLI reference page
// imports the vendored artifact the same way.
declare module "*.md" {
  import type { Component } from "svelte";
  const component: Component;
  export default component;
  export const metadata: Record<string, string>;
}
