---
title: Using Harlequin
menuOrder: -98
---

<script>
    import Key from "$lib/components/key.svelte"
    import Tip from "$lib/components/tip.svelte"
    import Figure from "$lib/components/figure.svelte"
    import Link from "$lib/components/link.svelte"
    import init from "$lib/assets/docs/getting-started/init.png"
    import first_query from "$lib/assets/docs/getting-started/first-query.png"
    import full_screen from "$lib/assets/docs/getting-started/full-screen.png"
    import catalog from "$lib/assets/docs/getting-started/catalog.png"
    import interactions from "$lib/assets/docs/getting-started/interactions.png"
    import describe from "$lib/assets/docs/getting-started/describe.png"
    import autocomplete from "$lib/assets/docs/getting-started/autocomplete.png"
    import find from "$lib/assets/docs/getting-started/find.png"
</script>

To follow this tutorial, simply run Harlequin with no arguments to open an in-memory DuckDB database:

```bash
harlequin
```

## Getting Oriented

Once you run Harlequin from the command line, it will open in your terminal in "application mode". This means that instead of showing your shell, your terminal will display Harlequin's interface, and Harlequin will receive all input into your terminal, including clicks. Immediately, it should look like this:

<Figure src={init} alt="A screenshot of Harlequin connected to an in-memory (empty) DuckDB database." caption="A blank slate."></Figure>

Harlequin's interface has 5 main components:

1. **Data Catalog:** The left-hand pane is a data catalog. It shows the objects in the currently-connected database(s) in an interactive tree.
2. **Query Editor:** The top pane on the right side of the screen in the Query Editor. It is a full-featured text editor with syntax highlighting for SQL, autocomplete, and support for multiple buffers in tabs.
3. **Results Viewer:** Under the Query Editor is the Results Viewer. The results viewer displays the results of `select` statements in a high-performance data table powered by Apache Arrow.
4. **Run Query Bar:** Between the Query Editor and Results Viewer, the Run Query Bar houses a few useful interactive elements for running queries, limiting results, and managing transactions.
5. **Footer:** At the bottom of the screen is the Footer, which displays a subset of currently-active key bindings and their actions. These actions are clickable.

## Executing a Query

The Query Editor should already have the focus of the keyboard, which is why it is outlined in yellow. Type or copy-paste the following SQL into the Query Editor, and then press <Key>ctrl+enter</Key>.

```sql
select * from duckdb_functions()
```

This should execute the query, and the results should be shown in the Results Viewer.

<Figure src={first_query} alt="A screenshot of Harlequin with data in the Results Viewer."></Figure>

<Tip>
If that didn't happen, your terminal may be intercepting the <Key>ctrl+enter</Key> keypress. You can try <Key>ctrl+j</Key> instead, or just click the yellow Run Query button. See the <Link href="../troubleshooting/key-bindings">troubleshooting guide</Link> for more info.
</Tip>

The Results Viewer now has the keyboard's focus. You can scroll through the results using the arrow keys, <Key>tab</Key>, <Key>ctrl+right</Key>, <Key>pgDn</Key>, <Key>end</Key>, and [more](../bindings#results-viewer-bindings).

There is a lot of data here, so press <Key>F10</Key> to enter full-screen mode.

<Figure src={full_screen} alt="A screenshot of Harlequin with data in full screen mode."></Figure>

When you are finished in full-screen mode, press <Key>F10</Key> again to return to the original view.

<Tip>
Full-screen mode also works for the Query Editor. You can also press <Key>ctrl+b</Key> to hide and show the Data Catalog sidebar.
</Tip>

## Using the Data Catalog

Our Catalog is currently empty; let's put something in it by executing another query. Press <Key>F2</Key> to focus the Query Editor, then <Key>ctrl+w</Key> to clear the old query, and then type or paste the following query, and run it with <Key>ctrl+enter</Key>:

```sql
create table foo as select * from duckdb_functions()
```

Now focus on the Data Catalog by pressing <Key>F6</Key>. `memory` is the name of our database; press <Key>enter</Key> or <Key>space</Key> to expand this item and show its only schema, called `main` (these are both DuckDB defaults for in-memory databases). Press <Key>down</Key> and <Key>enter</Key> again to expand the `main` schema, and do that one more time to expand the table `foo` we just created, showing its columns.

<Figure src={catalog} alt="A screenshot of Harlequin with items in the Data Catalog expanded."></Figure>

Next to the names of objects, in dimmed text you can see an indication of their types. These types are defined by each adapter; typically `s` is for string, `#` is for int, `##` is for big int, and so forth. The DuckDB adapter even labels complex types, like arrays of strings (`[s]`), maps (`{m}`), and more.

With the table `foo` still selected, press <Key>.</Key> to open the Interactions context menu.

<Figure src={interactions} alt="A screenshot of Harlequin with the interactions menu expanded for the foo table."></Figure>

Interactions are scripts that execute in the context of the current selection in the Data Catalog. They are available on all types of objects, not just tables.

Press <Key>down</Key> until the `Describe` interaction is highlighted, then press <Key>enter</Key> to execute it. You should see a `describe` query inserted into a new tab in the Query Editor. Press <Key>ctrl+enter</Key> to execute the query, which will display the schema of `foo` in the Results Viewer.

<Figure src={describe} alt="A screenshot of Harlequin with the describe query executed."></Figure>

## Using the Query Editor

Press <Key>F2</Key> to return the focus to the Query Editor. Now press <Key>ctrl+n</Key> to open a new buffer in a third tab.

Type `sel`, and notice that an autocomplete menu appears, including exact and fuzzy matches.

<Figure src={autocomplete} alt="A screenshot of Harlequin with an autocomplete modal."></Figure>

You can use the arrow keys to select different options, and then press <Key>tab</Key> or <Key>enter</Key> to accept the completion.

Keep typing if you want, or press <Key>ctrl+o</Key> to open a text file in the Query Editor.

<Tip>Don't have a big .sql file? Try <Link href="https://raw.githubusercontent.com/tconbeer/http_archive_almanac/refs/tags/unformatted/sql/2020/accessibility/common_alt_text_length.sql">this one</Link> from the HTTP Archive!</Tip>

Format the file you just opened by pressing <Key>F4</Key>.

It's a long query, but you can use <Key>ctrl+f</Key> to find a keyword or <Key>ctrl+g</Key> to go to a line.

<Figure src={find} alt="A screenshot of Harlequin with an autocomplete modal." caption="Finding all instances of alt_"></Figure>

When you're finished editing the query, you can use <Key>ctrl+s</Key> to save it back to disk.

Now you know the basics, but there is One More Thing: you quit Harlequin using <Key>ctrl+q</Key>.

## More Features

This was just a quick introduction to some of Harlequin's features, but many more await. Keep reading these docs for an overview of all features, or skip ahead to the [Key Bindings Reference](../bindings) for a cheat-sheet (and a hint of what is possible).
