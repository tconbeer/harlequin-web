import { error } from "@sveltejs/kit";

export async function load({ params }) {
  try {
    const page = await import(`../../../blog/${params.post}.md`);
    return {
      content: page.default,
      meta: page.metadata,
    };
  } catch (e) {
    throw error(404, `Could not find ${params.post}`);
  }
}
