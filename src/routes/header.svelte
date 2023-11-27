<script lang="ts">
  import { title, subtitle } from "$lib/config";
  import hamburger from "$lib/assets/icons/icons8-database-50.png";
  import { navigating } from "$app/stores";

  let showMenu = false;
  $: if ($navigating) showMenu = false;

  function toggleNavbar() {
    showMenu = !showMenu;
  }
</script>

<nav class="my-4 flex w-full flex-wrap justify-between">
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
        <span class="relative text-sm text-black">{subtitle}</span>
      </span>
    </div>
  </div>

  <div
    class="pt-4 transition-transform duration-700 sm:hidden {showMenu
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

  <ul class="mt-4 sm:mt-0 {showMenu ? 'flex' : 'hidden'} gap-8 sm:flex sm:pt-2">
    <li>
      <a
        href="/docs/getting-started"
        class="text-inherit no-underline decoration-green decoration-4 underline-offset-4 hover:underline"
        >Get Started</a
      >
    </li>
    <li>
      <a
        href="/docs/getting-started"
        class="text-inherit no-underline decoration-green decoration-4 underline-offset-4 hover:underline"
        >Docs</a
      >
    </li>
    <li>
      <a
        href="/about"
        class="text-inherit no-underline decoration-green decoration-4 underline-offset-4 hover:underline"
        >About</a
      >
    </li>
    <li>
      <a
        href="https://github.com/tconbeer/harlequin"
        target="_blank"
        class="text-inherit no-underline decoration-green decoration-4 underline-offset-4 hover:underline"
        >GitHub
      </a>
    </li>
  </ul>
</nav>
