<script lang="ts">
  import * as config from "$lib/config";
</script>

<footer class="mt-12 border-t border-t-pink">
  <nav class="my-4 flex w-full flex-wrap">
    <ul class="mx-auto mt-4 flex gap-8 sm:mt-0 sm:pt-2">
      <li>
        <a
          href="/docs/getting-started"
          class="text-inherit no-underline decoration-green decoration-4 underline-offset-4 hover:underline"
          >Docs</a
        >
      </li>
      <li>
        <a
          href="/blog"
          class="text-inherit no-underline decoration-green decoration-4 underline-offset-4 hover:underline"
          >Blog</a
        >
      </li>
      <li>
        <a
          href="/about"
          class="text-inherit no-underline decoration-green decoration-4 underline-offset-4 hover:underline"
          >About</a
        >
      </li>
      <li>
        <a
          href="https://github.com/tconbeer/harlequin"
          target="_blank"
          class="text-inherit no-underline decoration-green decoration-4 underline-offset-4 hover:underline"
          >GitHub
        </a>
      </li>
    </ul>
  </nav>
  <p class="my-2 text-center text-xs">
    {config.company} &copy{new Date().getFullYear()}. Icons by
    <a href="https://icons8.com/">Icons8</a>.
  </p>
</footer>
