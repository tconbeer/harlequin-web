<script lang="ts">
  export let title = "";
  export let body = "";
  export let src = "";

  import LazyImage from "$lib/components/lazy_image.svelte";
</script>

<div
  class="mx-auto my-6 flex max-w-2xl flex-wrap bg-pink px-6 py-6 shadow-lg shadow-purple selection:bg-purple"
>
  {#if src}
    <div class="w-full pr-4 md:w-1/3">
      <h3 class="mb-3 text-xl font-bold">{title}</h3>
      <p>{body}</p>
    </div>
    <div class="mt-5 max-h-96 w-full md:mt-0 md:w-2/3">
      <LazyImage
        {src}
        alt="A screenshot showing {title} functionality."
        className="max-h-96 w-full object-cover object-left-top rounded-lg border-4 border-yellow"
      />
    </div>
  {:else}
    <div class="w-full">
      <h3 class="mb-3 text-xl font-bold">{title}</h3>
      <p>{body}</p>
    </div>
  {/if}
</div>
