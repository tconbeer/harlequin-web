---
title: Files Overview
topic: Viewing Files
menuOrder: 2
---

<script>
    import Key from "$lib/components/key.svelte"
    import file_tree from "$lib/assets/docs/file-tree.png"
</script>

Harlequin's Data Catalog optionally displays file trees for either local files or remote objects stored in Amazon S3 (or another object storage service that provides an S3-compatible API.)

To view the file tree, use your mouse to select the "Files" tab, or focus on the Data Catalog with <Key>F6</Key> and then switch tabs with <Key>k</Key> or <Key>j</Key>. Insert file paths into the query editor with <Key>ctrl+enter</Key> or <Key>ctrl+j</Key>, or copy them to the clipboard with <Key>ctrl+c</Key>.

<div class="flex flex-wrap justify-center py-2">
    <figure>
        <img src={file_tree} alt="Example of the file tree."  class="h-auto w-full max-h-80">
        <figcaption class="text-center text-sm text-purple font-bold">Example of the file tree.</figcaption>
    </figure>
</div>

Keep reading for:

1. [Local Files](local)
2. [Remote Objects (S3)](remote)
