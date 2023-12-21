<script>
  import LazyImage from "$lib/components/lazy_image.svelte";
  const databases = import.meta.glob("$lib/assets/databases/*.{svg,png}", {
    as: "url",
    eager: true,
  });
</script>

<p class="text-center">
  Whether in-process, local, or in the cloud, Harlequin makes it easy to explore
  your data.
</p>
<p class="text-center text-xs">
  More coming soon. Don't see your database here?
  <a
    href="https://github.com/tconbeer/harlequin/issues/new/choose"
    target="_blank"
    class="underline hover:decoration-green hover:decoration-4 hover:underline-offset-4"
    >Open an issue</a
  >
  or
  <a
    href="/docs/contributing/adapter-guide"
    class="underline hover:decoration-green hover:decoration-4 hover:underline-offset-4"
    >create your own adapter</a
  >.
</p>
<ul class="my-4 flex flex-wrap justify-center gap-2 md:px-16">
  {#each Object.values(databases) as database}
    <li class="h-[50px] w-[50px]">
      <LazyImage
        src={database}
        alt="Icon for a supported database."
        className="object-fit grayscale"
      />
    </li>
  {/each}
</ul>
