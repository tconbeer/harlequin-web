<!-- Tables scroll in their own box: the generated option table is wider than
  the column the docs render in, and a page that scrolls sideways as a whole is
  worse than a table that does. -->
<div class="my-4 w-full overflow-x-auto">
  <table class="w-full border-collapse text-left text-sm">
    <slot />
  </table>
</div>
