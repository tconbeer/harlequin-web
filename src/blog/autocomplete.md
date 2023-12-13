---
title: "Autocomplete Comes to Harlequin"
publishedAt: 2023-12-14T12:00:00Z
lede: Less typing, more awesome.
---

<script>
    import autocomplete from '$lib/assets/blog/autocomplete.mp4'
    import arch from '$lib/assets/blog/autocomplete-arch.png'
</script>

You've been asking for it, and now you've got it: Harlequin v1.7.0 ships with a powerful autocomplete system for paths, words, and namespace members.

<video autoplay loop muted playsinline controls class="mt-6">
    Your browser does not support .mp4
    <source src={autocomplete} type="video/mp4" />
</video>

## Path Completion

After you type `/` or `\` (I see you, Windows users), Harlequin will suggest either relative or absolute paths to directories and files on your local filesystem. This also works inside quotes, so querying files with DuckDB just got a lot easier.

## Word Completion

If you type any word character, Harlequin will show completions that match. Harlequin has a (small) set of built-in completions for ANSI SQL keywords and functions (like `select` and `sum`), and adapters can provide additional completions for dialect-specific keywords, functions, and other relevant strings.

## Namespace Member Completion

After you type `.` or `:`, Harlequin will fetch completions whose "context" matches the string to the left of the separator. This means `schema.` will suggest any tables or views in that schema, `table.` will suggest columns, etc. It also works with quoted identifiers: `"my schema".` will do exactly what you want.

## How it works

### The UI

Harlequin is built using [Textual](https://textual.textualize.io/), a TUI framework for Python. The Query Editor uses a [supercharged fork](https://github.com/tconbeer/textual-textarea) of Textual's built-in [TextArea widget](https://textual.textualize.io/widget_gallery/#textarea), that wraps it in a container and provides a number of other features, including copy/paste, undo/redo and open/save.

The autocomplete list is built using Textual's [OptionList widget](https://textual.textualize.io/widget_gallery/#textarea), which gets mounted in the same container as the TextArea. The container defines two [layers](https://textual.textualize.io/guide/layout/#layers), which allows the OptionList to float above the TextArea. The OptionList in Harlequin cannot receive focus, so keys are always sent to the TextArea.

<img src={arch} alt="An architecture diagram showing the relationship of the TextArea and OptionList widgets and their parent container." class="my-6">

When you type in the TextArea, if the key is the right type to trigger completions, the TextArea updates its own state, which tracks which completer should be used, and then posts a [message](https://textual.textualize.io/guide/events/) that includes the preceding word (or path, etc.) to be matched. That message is handled by the parent container, which calls a method on the OptionList with the relevant completer function and its context; that method generates the completions in a separate thread. When completions are ready, the [thread worker](https://textual.textualize.io/guide/workers/#thread-workers) posts a message with the completions. On receiving that message, the OptionList updates its size and position, and sets a reactive variable that indicates that it should be visible.

Other keypresses work in a similar fashion, where messages to either hide the OptionList or insert the selection are posted by the TextArea and routed by the parent container. If you'd like to dive in farther, the [source for the OptionList is here](https://github.com/tconbeer/textual-textarea/blob/main/src/textual_textarea/autocomplete.py).

### Pluggable Completers

The architecture of the TextArea and OptionList allows any `Callable[str, tuple[str, str]]` to be used to generate completions. Harlequin does this with two callable classes, WordCompleter and MemberCompleter ([source](https://github.com/tconbeer/harlequin/blob/main/src/harlequin/autocomplete/completers.py)). Those classes store their relevant vocabularies and define their own matching logic. They are instantiated (in a separate thread) for the first time just after the Data Catalog is hydrated (since they rely on the same data for completions). The vocabularies are updated after any change to the Data Catalog.

Adapters can declare their own lists of additional completions, which are included in the vocabularies of the completers when they are first instantiated. The [DuckDB](https://github.com/tconbeer/harlequin/blob/main/src/harlequin_duckdb/completions.py) and [SQLite](https://github.com/tconbeer/harlequin/blob/main/src/harlequin_sqlite/completions.py) adapters do this by querying system tables for every keyword, function, pragma, etc.

Right now, the completers work using simple string operations on their vocabularies -- Tries are not necessary for now, even up to thousands of possible completions. But this may change in the future, as I look to support fuzzy matches, more contextual matches (using the Tree Sitter parse tree), and more advanced features .

## Try it out

If you haven't already tried Harlequin, there is no better time than now! Read [the docs](/docs/getting-started) or just shoot from the hip:

```bash
pipx install harlequin
```
