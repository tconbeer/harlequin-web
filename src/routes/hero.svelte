<script lang="ts">
  import screenshot from "$lib/assets/themes/harlequin.svg?raw";
  import Terminal from "$lib/components/terminal.svelte";
  import type { TerminalLine } from "$lib/types";

  const FLIP_MS = 8000;

  const panels = [
    { command: "harlequin", label: "the TUI" },
    { command: "hsql", label: "the CLI" },
  ];

  const session: TerminalLine[] = [
    { text: 'hsql -P prod -c "select * from orders limit 3"', kind: "command" },
    { text: " order_id | customer | total" },
    { text: "----------+----------+--------" },
    { text: " 1001     | acme     | 249.00" },
    { text: " 1002     | globex   |  87.50" },
    { text: " 1003     | initech  | 512.25" },
    { text: "(3 rows)", kind: "note" },
    { text: "" },
    {
      text: "hsql -P prod --csv --limit -1 --stats -f report.sql > out.csv",
      kind: "command",
    },
    {
      text: `{"status":"ok","rows":1284,"truncated":false,"elapsed_ms":18}`,
      kind: "note",
    },
  ];

  let index = $state(0);
  let paused = $state(false);

  $effect(() => {
    if (paused) {
      return;
    }
    const timer = setInterval(() => {
      index = (index + 1) % panels.length;
    }, FLIP_MS);
    return () => clearInterval(timer);
  });

  function show(i: number) {
    index = i;
    paused = true;
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<section
  class="flip mx-auto"
  onmouseenter={() => (paused = true)}
  onmouseleave={() => (paused = false)}
  onfocusin={() => (paused = true)}
>
  <div class="flip-inner grid" class:flipped={index === 1}>
    <div
      class="face flex min-w-0 flex-col"
      inert={index === 0 ? undefined : true}
      aria-hidden={index === 0 ? undefined : "true"}
    >
      <p class="mt-12 text-center font-mono text-sm text-purple">harlequin</p>
      <h2 class="text-center font-accent text-3xl">
        Portable, powerful, colorful.
      </h2>
      <p class="text-center">
        An easy, fast, and beautiful database client for the terminal.
      </p>
      <div
        class="mx-auto w-fit py-6 transition-transform duration-200 hover:scale-105 active:translate-x-1 active:translate-y-1"
      >
        <a
          href="/docs/getting-started"
          class="rounded-full bg-green px-6 py-3 text-center font-bold shadow-lg"
          >Get Started</a
        >
      </div>
      <figure
        class="mx-auto w-full min-w-0 max-w-screen-lg py-2 drop-shadow-lg"
      >
        <!-- eslint-disable-next-line svelte/no-at-html-tags -- local asset -->
        {@html screenshot}
      </figure>
    </div>

    <div
      class="face back flex min-w-0 flex-col"
      inert={index === 1 ? undefined : true}
      aria-hidden={index === 1 ? undefined : "true"}
    >
      <p class="mt-12 text-center font-mono text-sm text-purple">hsql</p>
      <h2 class="text-center font-accent text-3xl">
        Capable, usable, efficient.
      </h2>
      <p class="text-center">The best SQL client for automations and agents.</p>
      <div
        class="mx-auto w-fit py-6 transition-transform duration-200 hover:scale-105 active:translate-x-1 active:translate-y-1"
      >
        <a
          href="/docs/headless"
          class="rounded-full bg-green px-6 py-3 text-center font-bold shadow-lg"
          >Meet hsql</a
        >
      </div>
      <figure
        class="mx-auto flex w-full min-w-0 max-w-screen-lg flex-1 items-center py-2 drop-shadow-lg"
      >
        <Terminal
          lines={session}
          label="hsql — prod"
          size_class="text-[clamp(0.5rem,2.05vw,1.5rem)]"
        />
      </figure>
    </div>
  </div>
</section>

<nav class="mt-2 flex justify-center gap-1" aria-label="Choose a command">
  {#each panels as panel, i}
    <button
      onclick={() => show(i)}
      aria-current={index === i ? "true" : undefined}
      aria-label="{panel.command} — {panel.label}"
      title="{panel.command} — {panel.label}"
      class="group p-2"
    >
      <span
        class="block h-3 w-3 rounded-full border-2 border-purple transition-colors duration-200 {index ===
        i
          ? 'bg-purple'
          : 'bg-transparent group-hover:bg-pink'}"
      ></span>
    </button>
  {/each}
</nav>

<style>
  .flip {
    perspective: 2400px;
  }

  .flip-inner {
    transform-style: preserve-3d;
    transition: transform 1000ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .flip-inner.flipped {
    transform: rotateY(180deg);
  }

  .face {
    grid-area: 1 / 1;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  .back {
    transform: rotateY(180deg);
  }

  @media (prefers-reduced-motion: reduce) {
    .flip-inner {
      transition: none;
    }
  }
</style>
