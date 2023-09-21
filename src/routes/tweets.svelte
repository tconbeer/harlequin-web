<script lang="ts">
  import TweetCard from "$lib/components/tweet_card.svelte";
  import type { Tweet } from "$lib/types";
  import AlexVianaPro from "$lib/assets/tweets/AlexVianaPro.jpg";
  import pdrmnvd from "$lib/assets/tweets/pdrmnvd.jpg";
  import matsonj from "$lib/assets/tweets/matsonj.jpg";
  import nletcher from "$lib/assets/tweets/nletcher.jpg";
  import willmcgugan from "$lib/assets/tweets/willmcgugan.jpg";
  import _TylerHillery from "$lib/assets/tweets/_TylerHillery.jpg";

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
    {
      profile: {
        name: "Tyler Hillery",
        handle: "_TylerHillery",
        src: "https://twitter.com/_TylerHillery",
        img_src: _TylerHillery,
      },
      body: `<p lang="en" dir="ltr"><a style="color: blue" href="https://twitter.com/tedconbeer?ref_src=twsrc%5Etfw">@tedconbeer</a> crushed it with Harelquin, a DuckDB IDE for your terminal.<br><br>I highly recommend trying it out <a style="color: blue" href="https://t.co/vZOCzpQZ6Y">https://t.co/vZOCzpQZ6Y</a> <a style="color: blue" href="https://t.co/iBcbTDFKxr">pic.twitter.com/iBcbTDFKxr</a></p>`,
      created_at: "5:52 PM · Sep 19, 2023",
      src: "https://twitter.com/willmcgugan/status/1704547880202051694",
    },
    {
      profile: {
        name: "nedned",
        handle: "nletcher",
        src: "https://github.com/nletcher",
        img_src: nletcher,
      },
      body: `<p lang="en" dir="ltr">Harlequin is a super snazzy terminal-based IDE for <a style="color: blue" href="https://twitter.com/duckdb?ref_src=twsrc%5Etfw">@duckdb</a> that has a whole bunch of useful features. Think of it like the DuckDB CLI dialled up to 11. Go check it out! <a style="color: blue" href="https://t.co/HKVreF6xEv">https://t.co/HKVreF6xEv</a><br><br>(It&#39;s also one of them funky TUIs built with Textual, <a style="color: blue" href="https://twitter.com/textualizeio?ref_src=twsrc%5Etfw">@textualizeio</a> ) <a style="color: blue" href="https://t.co/7hkCWrWl8f">https://t.co/7hkCWrWl8f</a></p>`,
      created_at: "8:24 AM · Sep 20, 2023",
      src: "https://twitter.com/nletcher/status/1704501782133514297",
    },
    {
      profile: {
        name: "Will McGugan",
        handle: "willmcgugan",
        src: "https://github.com/willmcgugan",
        img_src: willmcgugan,
      },
      body: `<p lang="en" dir="ltr">So much awesome! 😀💪 <a style="color: blue" href="https://t.co/D5eBrRGDK9">https://t.co/D5eBrRGDK9</a>`,
      created_at: "11:27 AM · Sep 20, 2023",
      src: "https://twitter.com/willmcgugan/status/1704547880202051694",
    },
  ];
</script>

<p class="text-center">
  Thousands are using Harlequin. Join them with <code
    class="language-bash bg-pink px-1 py-1 text-sm">pipx install harlequin</code
  >.
</p>
<ul class="mt-4 flex flex-wrap justify-center gap-2">
  {#each tweets as tweet}
    <li class="max-w-xs">
      <TweetCard {tweet} />
    </li>
  {/each}
</ul>
