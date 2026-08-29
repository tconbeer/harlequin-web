# Reference: Default Bindings

Harlequin uses keymaps to define sets of key bindings in the app. Below is a reference for the bindings from the default keymap (called `vscode`). For more information on customizing key bindings, see the [keymaps](https://harlequin.sh/docs/keymaps) page.

## General Bindings

- `ctrl+q` Quit Harlequin
- `F1` Show the help screen.
- `F2` Focus on the Query Editor.
- `F5` Focus on the Results Viewer.
- `F6` Focus on the Data Catalog.
- `F8` Show the Query History Viewer.
- `F9`, `ctrl+b` Toggle the sidebar.
- `F10` Toggle full screen mode for the current widget.
- `ctrl+e` Export the returned data to a CSV, Parquet, or JSON file.
- `ctrl+r` Refresh the Data Catalog.

## Query Editor Bindings

### Actions

- `F4` Format the query.
- `ctrl+enter`, `ctrl+j` Run the query.

- `ctrl+o` Open a text file in the Query Editor.
- `ctrl+s` Save the contents of the Query Editor to a file.

- `ctrl+n` Create a new buffer (editor tab).
- `ctrl+w` Close the current buffer (editor tab).
- `ctrl+k` View the next buffer (editor tab).

- `ctrl+g` Go to line
- `ctrl+f` Find
- `F3` Find next (like Find, but uses previous value).

### Editing Text

- `ctrl+a` Select all, move the cursor to the end of the query.
- `ctrl+x` Cut selected text.
- `ctrl+c` Copy selected text.
- `ctrl+v`, `ctrl+u`, `shift+insert`, `Right Click` Paste selected text.
- `ctrl+z` Undo.
- `ctrl+y` Redo.
<!-- prettier-ignore -->
- `ctrl+/`, `ctrl+\_` Toggle comments on selected line(s).
- `tab` Insert spaces at cursor to move the cursor to the next tab stop, or indent the selected line(s) to the next tab stop.
- `shift+tab` Dedent the selected line(s) to the next tab stop.
- `shift+delete` Delete the current line.

### Using Autocomplete

_With the autocomplete list open:_

- `up`, `down`, `pgUp`, `pgDn` Select a different item in the list.
- `tab`, `enter` Place the current selection in the Query Editor.
- `escape` Dismiss the autocomplete list.

### Moving the Cursor

- `up`,`down`,`left`,`right`,`tab`,`shift+tab` Move the cursor one position.
- `home` Move the cursor to the start of the line.
- `end` Move the cursor to the end of the line.
- `ctrl+home` Move the cursor to the start of the query.
- `ctrl+end` Move the cursor to the end of the query.
- `pgUp` Move the cursor up one screen.
- `pgDn` Move the cursor down one screen.
- `ctrl+up` Scroll up one line.
- `ctrl+down` Scroll down one line.
- `ctrl+left` Move the cursor to the start of the current token.
- `ctrl+right` Move the cursor to the end of the current token.
- `shift+[any]` Select text while moving the cursor.

## Results Viewer Bindings

### Actions

- `ctrl+c` Copy selected cells.

### Switching Tabs

- `j` Switch to the previous tab.
- `k` Switch to the next tab.

### Moving the Cursor

- `up`,`down`,`left`,`right` Move the cursor one cell.
- `home` Move the cursor to the top of the current column.
- `end` Move the cursor to the bottom of the current column.
- `ctrl+home` Move the cursor to the first cell.
- `ctrl+end` Move the cursor to the last cell.
- `pgUp` Move the cursor up one screen.
- `pgDn` Move the cursor down one screen.
- `ctrl+up`,`ctrl+down` Move the cursor to the start/end of the column.
- `ctrl+left`,`ctrl+right` Move the cursor to the start/end of the row.
- `shift+[any]` Select cells while moving the cursor.

## Data Catalog Bindings

- `ctrl+enter`,`ctrl+j` Insert the current name into the Query Editor.
- `ctrl+c` Copy the current name to the clipboard.
- `.` Open the Interactions context menu for the selected item.

### Switching Tabs

- `j` Switch to the previous tab.
- `k` Switch to the next tab.

### Moving the Cursor

- `up`,`down` Move the cursor one row.
- `enter`,`space` Toggle the expand/collapsed state of the current item.

## Query History Viewer Bindings

- `up`,`down`,`pgUp`,`pgDn` Change selection and scroll.
- `tab` Change focus between the history list and the query preview pane.
- `enter` Create a new Editor buffer and insert the highlighted query.
- `escape` Return to the main screen.
