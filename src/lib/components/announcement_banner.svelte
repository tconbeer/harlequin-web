<script lang="ts">
  import exclamation from "$lib/assets/icons/icons8-exclamation-50.png";

  const issueUrl = "https://github.com/tconbeer/harlequin/issues/1119";
</script>

<!-- A temporary site-wide notice, mounted at the top of the homepage and at the
     top of the docs shell (which every docs page renders through, so one mount
     covers all of them). The copy lives here rather than at either mount, so the
     two cannot drift apart while the notice is up, and taking the notice down is
     deleting the two tags that render this. The page background is `bg-yellow`,
     so the banner is not. -->
<aside
  class="mt-4 flex w-full items-start gap-2 rounded border-2 border-purple bg-pink px-4 py-3 text-sm text-black"
>
  <img class="mt-0.5 h-5 w-5 flex-none" src={exclamation} alt="" />
  <p class="min-w-0 break-words">
    Python 3.15 is not supported by all Harlequin dependencies. For the best
    experience, install Harlequin using Python 3.14 with <code
      class="bg-black px-1 font-mono text-yellow selection:bg-purple"
      >uv tool install --python 3.14 harlequin</code
    >. See
    <a
      href={issueUrl}
      target="_blank"
      rel="noreferrer"
      class="underline hover:decoration-green hover:decoration-4 hover:underline-offset-4"
      >this issue</a
    > for updates.
  </p>
</aside>
