<script lang="ts">
  export let data;
  import { title, url } from "$lib/config";
  import ted from "$lib/assets/blog/ted_100.jpg";

  $: postUrl = `${url}blog/${data.slug}`;
  $: imageUrl = `${url}harlequin.png`;
</script>

<svelte:head>
  <title>{title}: {data.meta.title}</title>
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content={title} />
  <meta property="og:title" content={data.meta.title} />
  <meta property="og:description" content={data.meta.lede} />
  <meta property="og:url" content={postUrl} />
  <meta property="og:image" content={imageUrl} />
  <meta property="og:image:width" content="960" />
  <meta property="og:image:height" content="540" />
  <meta
    property="og:image:alt"
    content="Harlequin, the SQL IDE for your terminal"
  />
  <meta property="article:published_time" content={data.meta.publishedAt} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={data.meta.title} />
  <meta name="twitter:description" content={data.meta.lede} />
  <meta name="twitter:image" content={imageUrl} />
</svelte:head>
<h1 class="mb-4 font-accent text-3xl sm:text-5xl">{data.meta.title}</h1>
<div class="mb-6 flex justify-start">
  <img
    class="mr-2 h-[60px] w-[60px] flex-shrink-0 overflow-hidden rounded-full border border-purple"
    src={ted}
    alt="Headshot of Ted Conbeer"
  />
  <div class="my-auto flex flex-wrap justify-start gap-x-8 align-middle">
    <span class="font-bold sm:text-xl">Ted Conbeer</span>
    <div class="sm:text-xl">
      {new Date(data.meta.publishedAt).toLocaleDateString("en-us", {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
    </div>
  </div>
</div>
<summary class="mb-4 rounded border border-purple bg-green px-4 py-4 font-bold"
  >{data.meta.lede}</summary
>
<svelte:component this={data.content}></svelte:component>
