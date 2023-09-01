import { error } from "@sveltejs/kit";

export async function load({ params }) {
  try {
    const page = await import(`../../../docs/${params.slug}.md`);
    return {
      content: page.default,
      meta: page.metadata,
    };
  } catch (e) {
    throw error(404, `Could not find ${params.slug}`);
  }
}
