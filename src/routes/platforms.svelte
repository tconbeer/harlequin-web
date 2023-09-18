<script>
  import LazyImage from "$lib/components/lazy_image.svelte";
  import windows from "$lib/assets/platforms/icons8-windows-50.png";
  import mac from "$lib/assets/platforms/icons8-mac-50.png";
  import linux from "$lib/assets/platforms/icons8-linux-50.png";

  import bash from "$lib/assets/platforms/icons8-bash-50.png";
  import zsh from "$lib/assets/platforms/zsh.png";
  import fish from "$lib/assets/platforms/fish.png";

  import cmd from "$lib/assets/platforms/icons8-command-prompt-50.png";
  import powershell from "$lib/assets/platforms/icons8-powershell-50.png";
  import terminal from "$lib/assets/platforms/icons8-terminal-50.png";
  import iterm from "$lib/assets/platforms/iterm2.png";
  import tmux from "$lib/assets/platforms/tmux.png";

  const platforms = [
    windows,
    mac,
    linux,
    bash,
    zsh,
    fish,
    cmd,
    powershell,
    terminal,
    iterm,
    tmux,
  ];
</script>

<p class="text-center">
  Any shell, any terminal, any machine. Fish in tmux on Alpine over SSH? Sure.
  Windows cmd? Yep.
</p>
<ul class="my-4 flex flex-wrap justify-between gap-2 md:px-16">
  {#each platforms as platform}
    <li class="h-[50px] w-[50px]">
      <LazyImage
        src={platform}
        alt="Icon for an OS, Shell, or Terminal."
        className="object-fit grayscale"
      />
    </li>
  {/each}
</ul>
