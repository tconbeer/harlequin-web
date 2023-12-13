<script lang="ts">
  import { title } from "$lib/config";
  export let data;
</script>

<svelte:head>
  <title>{title}: Blog</title>
</svelte:head>

<div class="mb-8 mt-6 w-full overflow-x-auto">
  <div class="mx-auto mt-4 w-full overflow-x-auto md:mt-0 md:w-2/3">
    <h1 class="mb-8 font-accent text-5xl">Harlequin Blog</h1>
    <ul role="list" class="divide-y divide-solid divide-pink">
      {#each data.posts as post}
        <li class="py-4">
          <a href="/blog/{post.slug}">
            <p class="text-xs">
              {new Date(post.publishedAt).toLocaleDateString("en-us", {
                weekday: "long",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
            <h2 class="text-xl font-bold">{post.title}</h2>
            <p>{post.lede}</p>
          </a>
        </li>
      {/each}
    </ul>
  </div>
</div>
