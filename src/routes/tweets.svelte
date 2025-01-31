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
  import adrianmg from "$lib/assets/tweets/adrianmg.jpg";
  import TanelPoder from "$lib/assets/tweets/TanelPoder.jpg";
  import DataSuperNerd from "$lib/assets/tweets/DataSuperNerd.jpg";

  const tweets: Tweet[] = [
    {
      profile: {
        name: "Alex C. Viana",
        handle: "AlexVianaPro",
        src: "https://twitter.com/AlexVianaPro",
        img_src: AlexVianaPro,
      },
      body: `<p lang="en" dir="ltr">
        If you like <span style="color: blue; " 
          >@duckdb</span
        >
        and retro/efficient text interfaces Harlequin is pretty cool!
        <span style="color: blue; " >https://t.co/4tNKmt1yT4</span>
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
        looking for <span style="color: blue; " >https://t.co/DWWY68tQcs</span
        > <span style="color: blue; " >pic.twitter.com/Ol2JwcxXE8</span>
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
        its beautiful <span style="color: blue; "
          
          >@tedconbeer</span
        >
        <span ><img src="https://pbs.twimg.com/media/F5oFbuSboAArGmR?format=png&name=small" alt="harlequin screenshot"> </span>
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
      body: `<p lang="en" dir="ltr"><span style="color: blue; " >@tedconbeer</span> crushed it with Harelquin, a DuckDB IDE for your terminal.<br><br>I highly recommend trying it out <span style="color: blue; " >github.com/tconbeer/harle...</span> <span ><img src="https://pbs.twimg.com/media/F6bTLmvaIAAR4hc?format=png&name=4096x4096" alt="harlequin screenshot"></span></p>`,
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
      body: `<p lang="en" dir="ltr">Harlequin is a super snazzy terminal-based IDE for <span style="color: blue; " >@duckdb</span> that has a whole bunch of useful features. Think of it like the DuckDB CLI dialled up to 11. Go check it out! <span style="color: blue; " >https://t.co/HKVreF6xEv</span><br><br>(It&#39;s also one of them funky TUIs built with Textual, <span style="color: blue; " >@textualizeio</span> ) <span style="color: blue; " >https://t.co/7hkCWrWl8f</span></p>`,
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
      body: `<p lang="en" dir="ltr">So much awesome! 😀💪 <span style="color: blue; " >https://t.co/D5eBrRGDK9</span>`,
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
      body: `<p lang="en" dir="ltr">Oh <span style="color: blue; " >@davidgasquez</span> I love this so much<br/><span style="color: blue; " >harlequin.sh</span> - the terminal IDE for duckdb <br/> <img src="https://pbs.twimg.com/media/F8xAu05bsAAGlzd?format=jpg&name=4096x4096" alt="harlequin screenshot"></p>`,
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
      body: `<p lang="en" dir="ltr">Loving <span style="color: blue; " >@tedconbeer</span>’s snappy terminal SQL IDE — Harlequin. Had a blast writing a BigQuery adapter for it last weekend. Try it out and find all the bugs! <span style="color: blue; " >https://t.co/M3LvDpTupQ</span></p>`,
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
      body: `<p lang="en" dir="ltr">To have a <span style="color: blue; " >@SQL</span> IDE directly on your <span style="color: blue; " >@terminal</span>, use Harlequin.<br><br>Command-line database operations are resource-efficient and often quicker than switching between multiple apps. <span style="color: blue; " >github.com/tconbeer/harlequin</span> <img src="https://pbs.twimg.com/media/GDFzeyBXkAAUMgL?format=png&name=small" alt="harlequin screenshot">`,
      created_at: "9:01 AM · Jan 5, 2024",
      src: "https://twitter.com/KhuyenTran16/status/1743301579669696758",
    },
    {
      profile: {
        name: "Tanel Poder",
        handle: "TanelPoder",
        src: "https://twitter.com/TanelPoder",
        img_src: TanelPoder,
      },
      body: `<p lang="en" dir="ltr">Harlequin: The SQL IDE for Your Terminal (works also with DuckDB!)<br><span style="color: blue; " >harlequin.sh</span> <img alt="harlequin screenshot" src="https://pbs.twimg.com/media/GQPUTOWXIAADrpR?format=jpg&amp;name=small" >`,
      created_at: "7:45 PM · Jun 16, 2024",
      src: "https://twitter.com/TanelPoder/status/1802517863275643377",
    },
    {
      profile: {
        name: "Adrián Mato 🐙",
        handle: "adrianmg",
        src: "https://twitter.com/adrianmg",
        img_src: adrianmg,
      },
      body: `<p lang="en" dir="ltr">What is this beauty <span style="color: blue;" >harlequin.sh</span> <img alt="harlequin screenshot" src="https://pbs.twimg.com/media/GQUUIEAb0AADSUq?format=jpg&amp;name=small" >`,
      created_at: "7:02 PM · Jun 17, 2024",
      src: "https://x.com/adrianmg/status/1802869367753056498",
    },
    {
      profile: {
        name: "Gogeta",
        handle: "DataSuperNerd",
        src: "https://x.com/DataSuperNerd",
        img_src: DataSuperNerd,
      },
      body: `<p lang="en" dir="ltr">Harlequin is an SQL IDE in your terminal. If you interact with databases everyday, i highly recommend that you give it a try.<br><br>It&#39;s very simple to setup and use, but extremely elegant and graceful👌🏽<br><br>Thank you <span style="color: blue;">@tedconbeer</span> for creating harlequin. <img alt="harlequin screenshot" src="https://pbs.twimg.com/media/GiIhbIiacAAf5up?format=png&name=240x240"></p>`,
      created_at: "3:47 AM · Jan 25, 2025",
      src: "https://x.com/DataSuperNerd/status/1883104387175993383",
    },
    // AFTER ADDING CARDS, UPDATE THE CONFIG IN tailwind.config.js TO KEEP SCROLLING SMOOTH.
  ];
</script>

<p class="text-center">
  Thousands are using Harlequin. Join them with <code
    class="language-bash bg-pink px-1 py-1 text-sm selection:bg-purple"
    >uv tool install harlequin</code
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
