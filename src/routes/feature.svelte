<script lang="ts">
  export let title = "";
  export let body = "";
  export let src = "";
</script>

<div
  class="mx-auto my-6 flex max-w-2xl flex-wrap bg-pink px-6 py-6 shadow-lg shadow-purple"
>
  {#if src}
    <div class="w-full pr-4 md:w-1/3">
      <h3 class="mb-3 text-xl font-bold">{title}</h3>
      <p>{body}</p>
    </div>
    <img
      {src}
      alt="A screenshot showing {title} functionality."
      class="mt-5 max-h-96 w-full rounded-lg border-4 border-yellow object-cover object-left-top md:mt-0 md:w-2/3"
    />
  {:else}
    <div class="w-full">
      <h3 class="mb-3 text-xl font-bold">{title}</h3>
      <p>{body}</p>
    </div>
  {/if}
</div>
