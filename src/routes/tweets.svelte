<script lang="ts">
  import TweetCard from "$lib/components/tweet_card.svelte";
  import type { Tweet } from "$lib/types";
  import AlexVianaPro from "$lib/assets/tweets/AlexVianaPro.jpg";
  import pdrmnvd from "$lib/assets/tweets/pdrmnvd.jpg";
  import matsonj from "$lib/assets/tweets/matsonj.jpg";
  import nletcher from "$lib/assets/tweets/nletcher.jpg";
  import willmcgugan from "$lib/assets/tweets/willmcgugan.jpg";
  import _TylerHillery from "$lib/assets/tweets/_TylerHillery.jpg";
  import archieemwood from "$lib/assets/tweets/archieemwood.jpg";
  import _WaylonWalker from "$lib/assets/tweets/_WaylonWalker.jpg";
  import KhuyenTran16 from "$lib/assets/tweets/KhuyenTran16.jpg";
  import joshptemple from "$lib/assets/tweets/joshptemple.png";

  const tweets: Tweet[] = [
    {
      profile: {
        name: "Alex C. Viana",
        handle: "AlexVianaPro",
        src: "https://twitter.com/AlexVianaPro",
        img_src: AlexVianaPro,
      },
      body: `<p lang="en" dir="ltr">
        If you like <a style="color: blue; text-decoration: underline" href="https://twitter.com/duckdb?ref_src=twsrc%5Etfw"
          >@duckdb</a
        >
        and retro/efficient text interfaces Harlequin is pretty cool!
        <a style="color: blue; text-decoration: underline" href="https://t.co/4tNKmt1yT4">https://t.co/4tNKmt1yT4</a>
        <img src="https://pbs.twimg.com/tweet_video_thumb/FxS6gBKWcAMR0X4.jpg" alt="harlequin screenshot">
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
        looking for <a style="color: blue; text-decoration: underline" href="https://t.co/DWWY68tQcs">https://t.co/DWWY68tQcs</a
        > <a style="color: blue; text-decoration: underline" href="https://t.co/Ol2JwcxXE8">pic.twitter.com/Ol2JwcxXE8</a>
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
        its beautiful <a style="color: blue; text-decoration: underline"
          href="https://twitter.com/tedconbeer?ref_src=twsrc%5Etfw"
          >@tedconbeer</a
        >
        <a href="https://t.co/LRNHkPUnGt"><img src="https://pbs.twimg.com/media/F5oFbuSboAArGmR?format=png&name=small" alt="harlequin screenshot"> </a>
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
      body: `<p lang="en" dir="ltr"><a style="color: blue; text-decoration: underline" href="https://twitter.com/tedconbeer?ref_src=twsrc%5Etfw">@tedconbeer</a> crushed it with Harelquin, a DuckDB IDE for your terminal.<br><br>I highly recommend trying it out <a style="color: blue; text-decoration: underline" href="https://github.com/tconbeer/harlequin">github.com/tconbeer/harle...</a> <a href="https://t.co/iBcbTDFKxr"><img src="https://pbs.twimg.com/media/F6bTLmvaIAAR4hc?format=png&name=4096x4096" alt="harlequin screenshot"></a></p>`,
      created_at: "5:52 PM · Sep 19, 2023",
      src: "https://twitter.com/_TylerHillery/status/1704282296868831624",
    },
    {
      profile: {
        name: "nedned",
        handle: "nletcher",
        src: "https://twitter.com/nletcher",
        img_src: nletcher,
      },
      body: `<p lang="en" dir="ltr">Harlequin is a super snazzy terminal-based IDE for <a style="color: blue; text-decoration: underline" href="https://twitter.com/duckdb?ref_src=twsrc%5Etfw">@duckdb</a> that has a whole bunch of useful features. Think of it like the DuckDB CLI dialled up to 11. Go check it out! <a style="color: blue; text-decoration: underline" href="https://t.co/HKVreF6xEv">https://t.co/HKVreF6xEv</a><br><br>(It&#39;s also one of them funky TUIs built with Textual, <a style="color: blue; text-decoration: underline" href="https://twitter.com/textualizeio?ref_src=twsrc%5Etfw">@textualizeio</a> ) <a style="color: blue; text-decoration: underline" href="https://t.co/7hkCWrWl8f">https://t.co/7hkCWrWl8f</a></p>`,
      created_at: "8:24 AM · Sep 20, 2023",
      src: "https://twitter.com/nletcher/status/1704501782133514297",
    },
    {
      profile: {
        name: "Will McGugan",
        handle: "willmcgugan",
        src: "https://twitter.com/willmcgugan",
        img_src: willmcgugan,
      },
      body: `<p lang="en" dir="ltr">So much awesome! 😀💪 <a style="color: blue; text-decoration: underline" href="https://t.co/D5eBrRGDK9">https://t.co/D5eBrRGDK9</a>`,
      created_at: "11:27 AM · Sep 20, 2023",
      src: "https://twitter.com/willmcgugan/status/1704547880202051694",
    },
    {
      profile: {
        name: "Archie",
        handle: "archieemwood",
        src: "https://twitter.com/archieemwood",
        img_src: archieemwood,
      },
      body: `<p lang="en" dir="ltr">Oh <a style="color: blue; text-decoration: underline" href="https://twitter.com/davidgasquez?ref_src=twsrc%5Etfw">@davidgasquez</a> I love this so much<br/><a style="color: blue; text-decoration: underline" href="https://harlequin.sh">harlequin.sh</a> - the terminal IDE for duckdb <br/> <img src="https://pbs.twimg.com/media/F8xAu05bsAAGlzd?format=jpg&name=4096x4096" alt="harlequin screenshot"></p>`,
      created_at: "7:32 PM · October 19, 2023",
      src: "https://twitter.com/archieemwood/status/1714816865246310489?s=20",
    },
    {
      profile: {
        name: "Waylon Walker",
        handle: "_WaylonWalker",
        src: "https://twitter.com/_WaylonWalker",
        img_src: _WaylonWalker,
      },
      body: `<p lang="en" dir="ltr">harlequin now has sqlite support <img src="https://pbs.twimg.com/ext_tw_video_thumb/1735672960684335104/pu/img/tTTvSglcje0e1NOw.jpg" alt="harlequin video"></p>`,
      created_at: "7:48 AM · Dec 15, 2023",
      src: "https://twitter.com/_WaylonWalker/status/1735673098580488533",
    },
    {
      profile: {
        name: "Josh Temple",
        handle: "joshptemple",
        src: "https://twitter.com/joshptemple",
        img_src: joshptemple,
      },
      body: `<p lang="en" dir="ltr">Loving <a style="color: blue; text-decoration: underline" href="https://twitter.com/tedconbeer?ref_src=twsrc%5Etfw">@tedconbeer</a>’s snappy terminal SQL IDE — Harlequin. Had a blast writing a BigQuery adapter for it last weekend. Try it out and find all the bugs! <a style="color: blue; text-decoration: underline" href="https://t.co/M3LvDpTupQ">https://t.co/M3LvDpTupQ</a></p>`,
      created_at: "5:34 PM · Dec 21, 2023",
      src: "https://twitter.com/joshptemple/status/1737994913109713280",
    },
    {
      profile: {
        name: "Khuyen Tran",
        handle: "KhuyenTran16",
        src: "https://twitter.com/KhuyenTran16",
        img_src: KhuyenTran16,
      },
      body: `<p lang="en" dir="ltr">To have a <a style="color: blue; text-decoration: underline" href="https://twitter.com/sql?ref_src=twsrc%5Etfw">@SQL</a> IDE directly on your <a style="color: blue; text-decoration: underline" href="https://twitter.com/terminal?ref_src=twsrc%5Etfw">@terminal</a>, use Harlequin.<br><br>Command-line database operations are resource-efficient and often quicker than switching between multiple apps. <a style="color: blue; text-decoration: underline" href="https://t.co/Fdn5ufImK7">github.com/tconbeer/harlequin</a> <img src="https://pbs.twimg.com/media/GDFzeyBXkAAUMgL?format=png&name=small" alt="harlequin screenshot">`,
      created_at: "9:01 AM · Jan 5, 2024",
      src: "https://twitter.com/KhuyenTran16/status/1743301579669696758",
    },
  ];
</script>

<p class="text-center">
  Thousands are using Harlequin. Join them with <code
    class="language-bash bg-pink px-1 py-1 text-sm selection:bg-purple"
    >pipx install harlequin</code
  >.
</p>
<ul
  class="relative mt-4 flex gap-2 motion-safe:overflow-x-hidden motion-reduce:overflow-x-scroll"
>
  {#each { length: 2 } as _} <!-- eslint-disable-line -->
    {#each tweets as tweet}
      <li
        class="shrink-0 overflow-hidden motion-safe:animate-horizontal-scroll"
      >
        <TweetCard {tweet} />
      </li>
    {/each}
  {/each}
</ul>
