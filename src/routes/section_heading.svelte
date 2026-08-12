<script lang="ts">
  let { title = "", tagline = "", id = "" } = $props();
</script>

<div class="mt-20 text-center" id={id || undefined}>
  <div class="mx-auto mb-4 h-1 w-24 rounded bg-purple"></div>
  <h2 class="font-display text-4xl md:text-5xl">{title}</h2>
  <p class="mt-3">
    <span class="relative">
      <span class="absolute -inset-1 block -skew-y-3 bg-pink" aria-hidden="true"
      ></span>
      <span class="relative selection:bg-purple">{tagline}</span>
    </span>
  </p>
</div>
