<script lang="ts">
  interface Props {
    src: string;
    alt: string;
    caption: string;
  }
  let { src, alt, caption }: Props = $props();
</script>

<div class="flex flex-wrap justify-center py-2">
  <figure>
    <img {src} {alt} class="h-auto max-h-80 w-full" />
    {#if caption}
      <figcaption class="text-center text-sm font-bold text-purple">
        {caption}
      </figcaption>
    {/if}
  </figure>
</div>
