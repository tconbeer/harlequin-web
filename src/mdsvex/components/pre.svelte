<script lang="ts">
  import type { Snippet } from "svelte";

  let { children } = $props();
  import clippy from "$lib/assets/icons/icons8-clipboard-48.png";
  import check from "$lib/assets/icons/icons8-check-50.png";

  let copy_icon = $state(clippy);
  const element_id = crypto.randomUUID();

  function copy() {
    copy_icon = check;
    setTimeout(() => {
      copy_icon = clippy;
    }, 1000);
    var code_snippet = document.getElementById(element_id)?.innerText.trim();
    if (code_snippet && code_snippet?.startsWith("$")) {
      code_snippet = code_snippet.slice(1).trim();
    }
    if (code_snippet) {
      navigator.clipboard.writeText(code_snippet);
    }
  }
</script>

<div
  class="flex w-full overflow-x-auto rounded border border-purple bg-pink align-middle"
>
  <pre
    class="my-2 flex-1 overflow-x-auto px-4 py-2 align-middle text-sm selection:bg-purple"><code
      class="inline-block overflow-x-auto align-middle"
      id={element_id}>{@render children()}</code
    ></pre>
  <button
    onclick={copy}
    class="active:rotate-360 group rounded px-2 transition duration-200 hover:bg-green"
  >
    <img
      class="duration-400 h-4 w-4 transition group-hover:scale-110 group-active:translate-x-1 group-active:translate-y-1"
      src={copy_icon}
      alt="clipboard icon"
    />
  </button>
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
