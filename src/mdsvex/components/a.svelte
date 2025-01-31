<script lang="ts">
  let { href, children } = $props();
  import Link from "$lib/components/link.svelte";
</script>

<Link {href}>{@render children()}</Link>
