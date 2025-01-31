<script lang="ts">
  let { children } = $props();
</script>

<pre
  class="my-2 w-full overflow-x-auto rounded border border-purple bg-pink px-4 py-2 align-middle text-sm selection:bg-purple"><code
    class="inline-block overflow-x-auto align-middle">{@render children()}</code
  ></pre>

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
