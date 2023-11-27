<script lang="ts">
  export let href: string;
</script>

<a
  {href}
  target={href.startsWith("http") ? "_blank" : "_self"}
  class="underline hover:decoration-green hover:decoration-4 hover:underline-offset-4"
  ><slot /></a
>
