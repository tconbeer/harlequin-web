<script lang="ts">
  import TweetCard from "$lib/components/tweet_card.svelte";
  import type { Tweet } from "$lib/types";
  import AlexVianaPro from "$lib/assets/tweets/AlexVianaPro.jpg";
  import pdrmnvd from "$lib/assets/tweets/pdrmnvd.jpg";
  import matsonj from "$lib/assets/tweets/matsonj.jpg";

  const tweets: Tweet[] = [
    {
      profile: {
        name: "Alex C. Viana",
        handle: "AlexVianaPro",
        src: "https://twitter.com/AlexVianaPro",
        img_src: AlexVianaPro,
      },
      body: `<p lang="en" dir="ltr">
        If you like <a style="color: blue" href="https://twitter.com/duckdb?ref_src=twsrc%5Etfw"
          >@duckdb</a
        >
        and retro/efficient text interfaces Harlequin is pretty cool!
        <a style="color: blue" href="https://t.co/4tNKmt1yT4">https://t.co/4tNKmt1yT4</a>
        <a style="color: blue" href="https://t.co/5Upic8iPXv">pic.twitter.com/5Upic8iPXv</a>
      </p>`,
      created_at: "6:24 AM · May 29, 2023",
      src: "https://twitter.com/AlexVianaPro/status/1663159262971936770",
    },
    {
      profile: {
        name: "pedram🐤",
        handle: "pdrmnvd",
        src: "https://twitter.com/pdrmnvd",
        img_src: pdrmnvd,
      },
      body: `<p lang="en" dir="ltr">
        pretty sweet terminal-based duckdb sql editor! just what i&#39;ve been
        looking for <a style="color: blue" href="https://t.co/DWWY68tQcs">https://t.co/DWWY68tQcs</a
        > <a style="color: blue" href="https://t.co/Ol2JwcxXE8">pic.twitter.com/Ol2JwcxXE8</a>
      </p>`,
      created_at: "9:46 PM · Jul 5, 2023",
      src: "https://twitter.com/pdrmnvd/status/1676799655513030663",
    },
    {
      profile: {
        name: "Jacob Matson",
        handle: "matsonj",
        src: "https://twitter.com/matsonj",
        img_src: matsonj,
      },
      body: `<p lang="en" dir="ltr">
        its beautiful <a style="color: blue"
          href="https://twitter.com/tedconbeer?ref_src=twsrc%5Etfw"
          >@tedconbeer</a
        > <a style="color: blue" href="https://t.co/LRNHkPUnGt">pic.twitter.com/LRNHkPUnGt</a>
      </p>`,
      created_at: "7:09 PM · Sep 9, 2023",
      src: "https://twitter.com/matsonj/status/1700677797117907444",
    },
  ];
</script>

<p class="text-center">
  Thousands are using Harlequin. Join them with <code
    class="language-bash bg-pink px-1 py-1 text-sm">pipx install harlequin</code
  >.
</p>
<ul class="mt-4 flex flex-wrap justify-center gap-4">
  {#each tweets as tweet}
    <li class="max-w-sm">
      <TweetCard {tweet} />
    </li>
  {/each}
</ul>
