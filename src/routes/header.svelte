<script lang="ts">
  import { title, subtitle } from "$lib/config";
  import hamburger from "$lib/assets/icons/icons8-database-50.png";
  import { navigating } from "$app/stores";
  import Github from "./github.svelte";

  export let data;

  let showMenu = false;
  $: if ($navigating) showMenu = false;

  function toggleNavbar() {
    showMenu = !showMenu;
  }
</script>

<nav class="my-4 block w-full justify-between md:flex">
  <div class="flex justify-between">
    <div>
      <div>
        <a href="/" class="font-display text-4xl text-inherit">{title}</a>
      </div>
      <div class="mt-1">
        <span class="relative">
          <span
            class="absolute -inset-1 block -skew-y-3 bg-pink"
            aria-hidden="true"
          />
          <span class="relative text-sm text-black selection:bg-purple"
            >{subtitle}</span
          >
        </span>
      </div>
    </div>

    <div
      class="pt-4 transition-transform duration-700 md:hidden {showMenu
        ? 'rotate-180'
        : 'rotate-0'} "
    >
      <button
        on:click={toggleNavbar}
        on:keypress={toggleNavbar}
        aria-label="Click for nav menu."
      >
        <img
          src={hamburger}
          class="h-8 w-8"
          alt="A line drawing of a database, in lieu of a hamburger."
        />
      </button>
    </div>
  </div>

  <ul
    class="mt-4 md:mt-0 {showMenu
      ? 'block md:flex'
      : 'hidden md:flex'} mx-0 border-b border-t border-purple md:gap-8 md:border-none md:pt-2"
  >
    <li class="hidden lg:my-auto lg:block">
      <a
        href="/docs/getting-started"
        class="font-bold text-inherit no-underline decoration-green decoration-4 underline-offset-4 hover:underline"
        >Get Started</a
      >
    </li>
    <li class="my-2 sm:my-auto">
      <a
        href="/docs/getting-started"
        class="text-inherit no-underline decoration-green decoration-4 underline-offset-4 hover:underline"
        >Docs</a
      >
    </li>
    <li class="my-2 sm:my-auto">
      <a
        href="/blog"
        class="text-inherit no-underline decoration-green decoration-4 underline-offset-4 hover:underline"
        >Blog</a
      >
    </li>
    <li class="my-2 sm:my-auto">
      <a
        href="/about"
        class="text-inherit no-underline decoration-green decoration-4 underline-offset-4 hover:underline"
        >About</a
      >
    </li>
    <li class="my-2 sm:my-auto">
      <a
        href="https://github.com/sponsors/tconbeer"
        target="_blank"
        class="text-inherit no-underline decoration-green decoration-4 underline-offset-4 hover:underline"
        >Sponsor
      </a>
    </li>
    <li class="my-2 sm:my-auto">
      <Github {data} />
    </li>
  </ul>
</nav>
