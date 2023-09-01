---
title: Key Bindings
menuOrder: 40
---

<script>
    import Key from "$lib/components/key.svelte"
</script>

## General Bindings

- <Key>ctrl+q</Key>: Quit Harlequin
- <Key>F1</Key>: Show the help screen.
- <Key>F2</Key>: Focus on the Query Editor.
- <Key>F5</Key>: Focus on the Results Viewer.
- <Key>F6</Key>: Focus on the Data Catalog.
- <Key>F9</Key>, <Key>ctrl+b</Key>: Toggle the sidebar.
- <Key>F10</Key>: Toggle full screen mode for the current widget.
- <Key>ctrl+e</Key>: Write the returned data to a CSV, Parquet, or JSON file.

## Query Editor Bindings

### Actions

- <Key>F4</Key>: Format the query.
- <Key>ctrl+enter</Key>, <Key>ctrl+j</Key>: Run the query.
- <Key>ctrl+o</Key>: Open a text file in the Query Editor.
- <Key>ctrl+s</Key>: Save the contents of the Query Editor to a file.
- <Key>ctrl+n</Key>: Create a new buffer (editor tab).
- <Key>ctrl+w</Key>: Close the current buffer (editor tab).
- <Key>ctrl+k</Key>: View the next buffer (editor tab).

### Editing Text

- <Key>ctrl+a</Key>: Select all, move the cursor to the end of the query.
- <Key>ctrl+x</Key>: Cut selected text.
- <Key>ctrl+c</Key>: Copy selected text.
- <Key>ctrl+v</Key>, <Key>ctrl+u</Key>: Paste selected text.
- <Key>ctrl+z</Key>: Undo.
- <Key>ctrl+y</Key>: Redo.
- <Key>ctrl+/</Key>, <Key>ctrl+\_</Key>: Toggle comments on selected line(s).
- <Key>tab</Key>: Insert spaces at cursor to move the cursor to the next tab stop, or indent the selected line(s) to the next tab stop.
- <Key>shift+tab</Key>: Dedent the selected line(s) to the next tab stop.
- <Key>shift+delete</Key>: Delete the current line.

### Moving the Cursor

- <Key>up</Key>,<Key>down</Key>,<Key>left</Key>,<Key>right</Key>: Move the cursor one position.
- <Key>home</Key> Move the cursor to the start of the line.
- <Key>end</Key> Move the cursor to the end of the line.
- <Key>ctrl+home</Key> Move the cursor to the start of the query.
- <Key>ctrl+end</Key> Move the cursor to the end of the query.
- <Key>PgUp</Key> Move the cursor up one screen.
- <Key>PgDn</Key> Move the cursor down one screen.
- <Key>ctrl+up</Key> Scroll up one line.
- <Key>ctrl+down</Key> Scroll up one line.
- <Key>ctrl+left</Key> Move the cursor to the start of the current token.
- <Key>ctrl+right</Key> Move the cursor to the end of the current token.
- <Key>shift+[any]</Key>: Select text while moving the cursor.

## Results Viewer Bindings

### Switching Tabs

- <Key>j</Key>: Switch to the previous tab.
- <Key>k</Key>: Switch to the next tab.

### Moving the Cursor

- <Key>up</Key>,<Key>down</Key>,<Key>left</Key>,<Key>right</Key>: Move the cursor one cell.
- <Key>home</Key>: Move the cursor to the top of the current column.
- <Key>end</Key>: Move the cursor to the bottom of the current column.
- <Key>PgUp</Key>: Move the cursor up one screen.
- <Key>PgDn</Key>: Move the cursor down one screen.
