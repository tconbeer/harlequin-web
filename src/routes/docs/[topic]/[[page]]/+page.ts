import type { PageLoad } from './$types';
import { error, redirect } from "@sveltejs/kit";

export async function load({ url, params, data }): Promise<PageLoad> {
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
      if (!url.searchParams.get("redirect_from")) {
        if (!params.page) {
          redirect(308, `/docs/${params.topic}/index?redirect_from=${url.pathname}`);
        } else if (params.page == "index") {
          redirect(308, `/docs/${params.topic}?redirect_from=${url.pathname}`);
        } else {
          error(404, `Could not find /docs/${params.topic}/${params.page}`);
        }
      } else {
        error(404, `Could not find ${url.searchParams.get("redirect_from")}`);
      }
  }
}
