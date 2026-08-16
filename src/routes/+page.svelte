<script module lang="ts">
  // Module scope, so this is reset by a document load but not by a
  // client-side navigation back to the homepage.
  let first_mount = true;
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import Platforms from "./platforms.svelte";
  import Databases from "./databases.svelte";
  import Features from "./features.svelte";
  import Hero from "./hero.svelte";
  import HsqlFeatures from "./hsql_features.svelte";
  import SectionHeading from "./section_heading.svelte";
  import Tweets from "./tweets.svelte";

  onMount(() => {
    if (!first_mount) return;
    first_mount = false;

    // Back and forward should still land where the reader left off, and a
    // link to #hsql should still scroll to it.
    const [entry] = performance.getEntriesByType(
      "navigation",
    ) as PerformanceNavigationTiming[];
    if (entry?.type === "back_forward" || location.hash) return;

    // Everything else opens at the top of the page. Both SvelteKit and the
    // browser recover the scroll offset of the last visit when a tab is
    // reloaded, and Android Chrome reloads tabs on its own whenever it
    // discards one in the background — so a reader who had scrolled the
    // homepage before came back to it below the header.
    history.scrollRestoration = "manual";
    scrollTo(0, 0);
  });
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
    > share adapters, config files, profiles, and a query engine, so you, your scripts,
    and your agents can share one tool.
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
