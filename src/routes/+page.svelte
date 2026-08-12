<script lang="ts">
  import Platforms from "./platforms.svelte";
  import Databases from "./databases.svelte";
  import Features from "./features.svelte";
  import Hero from "./hero.svelte";
  import HsqlFeatures from "./hsql_features.svelte";
  import SectionHeading from "./section_heading.svelte";
  import Themes from "./themes.svelte";
  import Tweets from "./tweets.svelte";
</script>

<article class="overflow-x-visible">
  <Hero />

  <h2 class="mt-12 text-center font-accent text-3xl">
    One Engine, Two Interfaces.
  </h2>
  <p class="mx-auto max-w-2xl text-center">
    <code class="whitespace-nowrap bg-pink px-0.5 selection:bg-purple"
      >harlequin</code
    >
    and
    <code class="whitespace-nowrap bg-pink px-0.5 selection:bg-purple"
      >hsql</code
    > share adapters, config files, profiles, and the query engine underneath — so
    the interactive session and the scripted one connect the same way and run your
    SQL the same way. Point both at one profile, and you and your agent can share
    one tool.
  </p>

  <h2 class="mt-12 text-center font-accent text-3xl">Runs Anywhere.</h2>
  <Platforms />

  <h2 class="mt-12 text-center font-accent text-3xl">
    Works with Your Database.
  </h2>
  <Databases />

  <SectionHeading
    title="harlequin"
    tagline="For humans, by humans"
    id="harlequin"
  />

  <h3 class="mt-12 text-center font-accent text-3xl">A feature-rich TUI.</h3>
  <Features />

  <Themes />

  <SectionHeading
    title="hsql"
    tagline="Your agent's favorite SQL client"
    id="hsql"
  />

  <h3 class="mt-12 text-center font-accent text-3xl">
    More features, fewer tokens.
  </h3>
  <HsqlFeatures />

  <h2 class="mt-12 text-center font-accent text-3xl">Join the Flock.</h2>
  <Tweets />
</article>
