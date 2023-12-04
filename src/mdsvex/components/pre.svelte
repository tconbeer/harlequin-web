<pre
  class="my-1 w-full overflow-x-auto rounded border border-purple bg-pink px-4 py-4 text-sm selection:bg-purple"><code
    ><slot /></code
  ></pre>

<style>
  /* Firefox */
  * {
    scrollbar-width: thin;
    scrollbar-color: #d67bff inherit;
  }

  /* Chrome, Edge, and Safari */
  *::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }

  *::-webkit-scrollbar-track {
    background: inherit;
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
