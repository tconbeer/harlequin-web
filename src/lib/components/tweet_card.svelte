<script lang="ts">
  export let tweet: Tweet;
  import type { Tweet } from "$lib/types";
  import x_icon from "$lib/assets/icons/icons8-twitterx-50.png";
  import LazyImage from "./lazy_image.svelte";
  /* eslint svelte/no-at-html-tags: "off" */
</script>

<div class="w-80 rounded border bg-white px-6 py-4 font-body">
  <div class="flex justify-between">
    <div class="flex">
      <LazyImage
        src={tweet.profile.img_src}
        className="h-12 w-12 rounded-full"
        alt="Twitter profile image for {tweet.profile.name}."
      />
      <div class="ml-4 flex flex-col">
        <a class="font-bold text-black" href={tweet.profile.src}
          >{tweet.profile.name}</a
        >
        <a class="text-sm text-gray-500" href={tweet.profile.src}
          >@{tweet.profile.handle}</a
        >
      </div>
    </div>
    <LazyImage src={x_icon} alt="X (Twitter) Icon" className="w-6 h-6" />
  </div>
  <a href={tweet.src} target="_blank">
    <!-- eslint-disable-next-line no-at-html-tags -->
    <div class="text-md mb-1 mt-3 leading-normal">
      {@html tweet.body}
    </div>
    <div class="mb-3 text-sm text-gray-500">{tweet.created_at}</div>
  </a>
</div>
