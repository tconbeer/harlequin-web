import { error, redirect } from "@sveltejs/kit";

export async function load({ params, data }) {
  try {
    let page;
    if (params.page) {
      page = await import(`../../../../docs/${params.topic}/${params.page}.md`);
    } else {
      page = await import(`../../../../docs/${params.topic}.md`);
    }
    return {
      ...data,
      content: page.default,
      meta: page.metadata,
    };
  } catch (e) {
    if (!params.page) {
      redirect(301, `/docs/${params.topic}/index`);
    } else {
      error(404, `Could not find ${params.topic}/${params.page}`);
    }
  }
}
