<script lang="ts">
    let {src, alt, caption} = $props();
</script>

<div class="flex flex-wrap justify-center py-2">
    <figure>
        <img src={src} alt={alt}  class="h-auto w-full max-h-80">
        {#if caption}
        <figcaption class="text-center text-sm text-purple font-bold">{caption}</figcaption>
        {/if}
    </figure>
</div>