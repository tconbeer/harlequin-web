<script lang="ts">
  let { children } = $props();
  import Alert from "$lib/components/alert.svelte";
  import warning from "$lib/assets/icons/icons8-warning-50.png";
</script>

<Alert icon_src={warning} title_text="Warning" border_color="pink"
  >{@render children()}</Alert
>
