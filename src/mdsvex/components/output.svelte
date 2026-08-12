<script lang="ts">
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

<div
  class="code-output my-4 flex w-full overflow-x-auto rounded border border-purple bg-pink align-middle [.code-command+&]:mt-0 [.code-command+&]:rounded-t-none"
>
  <pre
    class="my-2 flex-1 overflow-x-auto px-4 py-2 align-middle text-sm selection:bg-purple"><code
      class="inline-block overflow-x-auto align-middle"
      >{@render children()}</code
    ></pre>
</div>

<style>
  /* Firefox */
  * {
    scrollbar-width: thin;
    scrollbar-color: #d67bff #ffb6d9;
  }

  /* Chrome, Edge, and Safari */
  *::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  *::-webkit-scrollbar-track {
    background: #ffb6d9;
    border-radius: 5px;
  }

  *::-webkit-scrollbar-thumb {
    background-color: #d67bff;
  }
  *::-webkit-scrollbar-thumb:hover {
    background-color: #45ffca;
  }
  *::-webkit-scrollbar-thumb:active {
    background-color: #45ffca;
  }
</style>
