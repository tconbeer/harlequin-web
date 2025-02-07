---
title: Copying and Pasting
menuOrder: 920
---

<script>
    import Key from "$lib/components/key.svelte"
</script>

Harlequin's Query Editor, Data Catalog, and Results Viewer support cut and copy, and its Query Editor supports paste. However, this is more complex than it seems. If these features are not working for you, there could be a number of root causes. This section walks through how copy-paste works in Harlequin, and offers some solutions for common problems.

### Internal Copy and Paste

Harlequin's Query Editor implements its own internal clipboard, so copying and pasting within the Query Editor should always work. To test the internal clipboard, select text in the Query Editor and press <Key>ctrl+c</Key> to copy it. Paste it with <Key>ctrl+u</Key> (`u`, not `v` for this step!). If that doesn't work, Harlequin isn't receiving those key presses from your terminal. Please [open an issue](https://github.com/tconbeer/harlequin/issues).

### Copying outside Harlequin, Pasting inside Harlequin

There are two mechanisms for Harlequin to receive clipboard data when you initiate a paste.

1.  Harlequin receives a key press that it interprets as a paste command. This happens when you press <Key>ctrl+u</Key>, and depending on your terminal, may or may not happen when you press <Key>ctrl+v</Key>. When Harlequin interprets a key press as a paste command, it attempts to access the system clipboard and paste its contents. If it cannot access the system clipboard, Harlequin will paste the contents of its internal clipboard. To determine if Harlequin can access the system clipboard:

    - Copy some text outside of Harlequin.
    - Focus on the Harlequin Query Editor, then press <Key>ctrl+u</Key> (`u`, not `v` for this step!).
    - If Harlequin does not paste anything, or if it pastes something different from what you just copied, Harlequin cannot access the system clipboard. You can work around this by pasting using your terminal's built-in paste functionality, or by fixing its access to the system clipboard (keep reading).
    - Starting in Harlequin v1.1, you should see a notification pop-up if Harlequin cannot access your system clipboard.

2.  Harlequin receives a native `Paste` message from the terminal. To trigger a `Paste` message, you want to use the same keys that you would to paste into your shell. This might be <Key>ctrl+v</Key>, <Key>shift+insert</Key>, or a right click of your mouse. When Harlequin receives a `Paste` message, it will insert the contents of that message into the Query Editor. Since this doesn't rely on the clipboard, this should work on nearly any terminal, whether Harlequin and the terminal share a host or not. Many terminals allow you to configure the key or mouse bindings for `Paste`.

If Harlequin cannot access the system clipboard, there may be a couple of causes:

1.  If Harlequin is installed on Linux, you may be missing a clipboard library. Try `sudo apt install xclip` or `sudo apt install xsel` to install a library that will allow Harlequin to access the system clipboard.
2.  Harlequin's host (the operating system where Harlequin is running) may have its clipboard disabled. This is common in GitHub Codespaces, CI runners, and other servers that don't typically support user input or a display. If you control the server, you can install or start an X Server (like X11) to enable the clipboard. As a workaround, try triggering a native `Paste` event in your terminal instead.
3.  If your terminal is attaching to a remote host to run Harlequin, e.g., via SSH, the terminal or SSH client may or may not support clipboard "redirection" (sharing the clipboard between the machines). In this case, Harlequin may be able to access its host's clipboard, but that clipboard won't be the same as the one you use for everything else. As a workaround, try triggering a native `Paste` event in your terminal instead (sadly this might also be disabled).

If all is lost, you can open a text file with Harlequin with <Key>ctrl+o</Key> or by clicking "Open Query" in the footer.

### Copying inside Harlequin, Pasting outside Harlequin

If you've made it this far, I'm so sorry. I hope you've learned something today.

The same dynamics from above apply, but we don't have the `Paste` event to move the data for us. The workarounds are:

1.  You can try to use your terminal's native copy functionality. This is unlikely to do what you want, since it'll copy Harlequin's UI (borders, whitespace, etc), alongside your query. But if you want to try:

    - In your terminal's settings, enable "Copy on Selection." You can test this in your shell -- if you select (highlight) text with your mouse, it should get copied to your clipboard.
    - In Harlequin, hold <Key>Shift</Key> while using your mouse to select the text you want to copy (on most terminals, this triggers selection when the terminal is in "app mode"). You'll know you're doing this right if the highlight color is different from what you normally see when highlighting text in Harlequin. Your selection should get copied to the clipboard (whitespace, `|`'s, and all).

2.  You can save your query to a file and open it in another program. Press <Key>ctrl+s</Key> or click "Save Query" in the footer.
