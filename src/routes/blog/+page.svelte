<script lang="ts">
  import { title } from "$lib/config";
  import ted from "$lib/assets/blog/ted_100.jpg";
  export let data;
</script>

<svelte:head>
  <title>{title}: Blog</title>
</svelte:head>

<div class="mb-8 mt-6 w-full overflow-x-auto">
  <div class="mx-auto mt-4 w-full overflow-x-auto md:mt-0 md:w-2/3">
    <h1 class="mb-4 font-accent text-5xl">Harlequin Blog</h1>
    <section class="mt-6 border-b border-b border-green pb-5">
      <ul>
        {#each data.posts as post}
          <a href="/blog/{post.slug}">
            <li>
              <div class="mb-2 flex justify-start">
                <img
                  class="mr-2 h-[50px] w-[50px] flex-shrink-0 overflow-hidden rounded-full border border-purple"
                  src={ted}
                  alt="Headshot of Ted Conbeer"
                />
                <div
                  class="my-auto flex flex-wrap justify-start gap-x-8 align-middle"
                >
                  <span class="font-bold sm:text-xl">Ted Conbeer</span>
                  <div class="sm:text-xl">
                    {new Date(post.publishedAt).toLocaleDateString("en-us", {
                      weekday: "long",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
              <p class="text-xl">{post.title}</p>
              <p>{post.lede}</p>
            </li>
          </a>
        {/each}
      </ul>
    </section>
  </div>
</div>
