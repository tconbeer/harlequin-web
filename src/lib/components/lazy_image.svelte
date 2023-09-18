<script lang="ts">
  export let src = "";
  export let alt = "";
  export let className = "";

  import { onMount } from "svelte";
  import IntersectionObserver from "./intersection_observer.svelte";

  let nativeLoading = false;

  onMount(() => {
    if ("loading" in HTMLImageElement.prototype) {
      nativeLoading = true;
    }
  });
</script>

<IntersectionObserver once={true} let:intersecting>
  {#if intersecting || nativeLoading}
    <img {src} {alt} class={className} loading="lazy" />
  {/if}
</IntersectionObserver>
