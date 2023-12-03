<script lang="ts">
  export let data;
  import { title } from "$lib/config";
  import ted from "$lib/assets/blog/ted_100.jpg";
</script>

<svelte:head>
  <title>{title}: {data.meta.title}</title>
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
