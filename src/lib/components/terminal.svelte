<script lang="ts">
  import type { TerminalLine } from "$lib/types";

  let {
    lines = [] as TerminalLine[],
    label = "",
    size_class = "text-sm",
  } = $props();
</script>

<div
  class="flex w-full flex-col overflow-hidden rounded-lg border-4 border-yellow bg-black"
>
  {#if label}
    <div
      class="flex flex-none items-center gap-2 border-b border-purple px-3 py-2"
    >
      <span class="h-2 w-2 flex-none rounded-full bg-pink"></span>
      <span class="h-2 w-2 flex-none rounded-full bg-yellow"></span>
      <span class="h-2 w-2 flex-none rounded-full bg-green"></span>
      <span class="ml-2 truncate font-mono text-xs text-purple">{label}</span>
    </div>
  {/if}
  <pre
    class="flex-1 overflow-x-auto px-4 py-3 font-mono leading-relaxed text-yellow selection:bg-purple {size_class}">{#each lines as line, i}{#if line.kind === "command"}<span
          class="select-none font-bold text-purple"
          >$ </span><span class="font-bold text-green">{line.text}</span
        >{:else if line.kind === "note"}<span class="text-pink"
          >{line.text}</span
        >{:else}<span>{line.text}</span>{/if}{i < lines.length - 1
        ? "\n"
        : ""}{/each}</pre>
</div>

<style>
  /* Firefox */
  * {
    scrollbar-width: thin;
    scrollbar-color: #d67bff #000000;
  }

  /* Chrome, Edge, and Safari */
  *::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  *::-webkit-scrollbar-track {
    background: #000000;
  }

  *::-webkit-scrollbar-thumb {
    background-color: #d67bff;
    border-radius: 5px;
  }
  *::-webkit-scrollbar-thumb:hover {
    background-color: #45ffca;
  }
</style>
