<script lang="ts">
  let { title = "", tagline = "", id = "" } = $props();
</script>

<div class="mt-20 text-center" id={id || undefined}>
  <h2 class="font-mono text-4xl font-bold md:text-5xl">{title}</h2>
  <p
    class="mx-auto mt-4 w-fit border-t-2 border-purple pt-3 text-sm uppercase tracking-widest"
  >
    {tagline}
  </p>
</div>
