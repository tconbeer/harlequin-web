import { error } from "@sveltejs/kit";

export async function load({ params }) {
  try {
    let page;
    if (params.page) {
      page = await import(`../../../../docs/${params.topic}/${params.page}.md`);
    } else {
      page = await import(`../../../../docs/${params.topic}.md`);
    }
    return {
      content: page.default,
      meta: page.metadata,
    };
  } catch (e) {
    throw error(404, `Could not find ${params.topic}/${params.page}`);
  }
}
