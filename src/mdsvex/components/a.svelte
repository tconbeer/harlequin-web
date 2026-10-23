<script lang="ts">
  import type { Snippet } from "svelte";
  let { href, children }: { href: string; children: Snippet } = $props();
  import Link from "$lib/components/link.svelte";
</script>

<Link {href}>{@render children()}</Link>
