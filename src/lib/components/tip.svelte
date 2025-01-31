<script lang="ts">
    let {children} = $props();
    import lightbulb from "$lib/assets/icons/icons8-lightbulb-50.png";
</script>

<div class="my-2 w-full overflow-x-auto rounded border border-2 border-green px-4 py-4 text-sm">
    <div class="flex items-center pb-2">
        <img class="w-6 h-6" src={lightbulb} alt="lightbulb icon">
        <span class="font-bold">Tip</span>
    </div>
    {@render children()}
</div>