/**
 * The results page is the same page whatever the query: the shell prerenders,
 * and the results are computed in the browser from the index the sidebar's
 * search box has usually already fetched. A prerendered page is rendered
 * without a query string, so `q` is read after hydration rather than in a load.
 */
export const prerender = true;
