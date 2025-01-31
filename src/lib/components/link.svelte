<script lang="ts">
  let { href, children } = $props();
</script>

<a
  {href}
  target={href.startsWith("http") ? "_blank" : "_self"}
  class="underline hover:decoration-green hover:decoration-4 hover:underline-offset-4"
  >{@render children()}</a
>
