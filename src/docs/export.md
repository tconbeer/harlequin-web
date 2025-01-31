---
title: Exporting Data
menuOrder: 29
---

<script>
    import Key from "$lib/components/key.svelte"
    import Tip from "$lib/components/tip.svelte"
    import Figure from "$lib/components/figure.svelte"
    import Link from "$lib/components/link.svelte"
    import export_csv from "$lib/assets/docs/export-csv.png"
</script>

Harlequin's Results Viewer is a great way to see query results, but sometimes you need to export data to use it in a different tool. Harlequin provides two easy options for this.

## Using the Clipboard

The Results Viewer can copy selected data to the clipboard. First, select a range of cells using <Key>ctrl+a</Key> (to select all), holding <Key>shift</Key> while using arrows or other keys to move the cursor, or by clicking and dragging. Then press <Key>ctrl+c</Key> to copy the data to the clipboard.

Data is copied in a tab-separated-values format. This format is compatible with many other applications, and pastes nicely into Excel, Google Sheets, and the Harlequin Query Editor.

<Tip>Copying works best when Harlequin has access to the system clipboard. If it doesn't work out of the box, see the <Link href="troubleshooting/copying-and-pasting">troubleshooting guide</Link> for more information.</Tip>

## Exporting Files

Copying and Pasting is quick and easy, but often it is better to export he results of a query as a file. Harlequin provides a utility to export data in common formats, including CSV, Parquet, JSON, ORC, and Feather.

First, execute your query. Then, with the results visible, press <Key>ctrl+e</Key> to open the Data Exporter screen. Enter a file path, then select a format. Harlequin will then display the relevant options for that format.

<Figure src={export_csv} alt="A screenshot of Harlequin's Data Exporter screen, after selecting the CSV format." caption="Adding a header row to a CSV export."></Figure>

Press <Key>enter</Key> or click the "Export" button, and Harlequin will write the file with all of the data from your query.
