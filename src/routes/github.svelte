<script lang="ts">
  import octocat from "$lib/assets/icons/icons8-github-30.png";
  import star from "$lib/assets/icons/icons8-star-16.png";
  import fork from "$lib/assets/icons/icons8-code-fork-16.png";
  export let data;
</script>

<div
  class="rounded-full py-1 transition-transform duration-200 hover:scale-105 hover:bg-green hover:shadow-lg active:translate-x-1 active:translate-y-1 sm:py-3 sm:pl-3 sm:pr-4"
>
  <a
    href="https://github.com/tconbeer/harlequin"
    target="_blank"
    title="Go to repository"
    class="text-inherit no-underline"
  >
    <div class="flex">
      <img src={octocat} alt="GitHub icon" class="my-auto h-[30px] w-[30px]" />
      <div>
        <div class="text-sm">tconbeer/harlequin</div>
        <div class="flex text-xs">
          <img
            src={star}
            alt="GitHub stars"
            class="h-[16px] w-[16px]"
          />{data.stargazers_count.toLocaleString()}&nbsp;<img
            src={fork}
            alt="GitHub forks"
            class="h-[16px] w-[16px]"
          />{data.forks_count.toLocaleString()}
        </div>
      </div>
    </div>
  </a>
</div>
