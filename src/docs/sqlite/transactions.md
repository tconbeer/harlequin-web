---
title: Transaction Handling
menuOrder: 33
---

<script>
    import tx_auto from "$lib/assets/docs/tx-auto.png"
    import tx_manual from "$lib/assets/docs/tx-manual.png"
</script>

In SQLite, statements are auto-committed by default. That means, for example, a standalone `create table` statement will be committed as soon as the statement finishes executing.

To combine multiple statements in a transaction, you must explicitly `begin` a transaction, or use "Manual" transaction mode (see notes below).

## Manual Transaction Mode

### Pre-requisites

To use Manual mode with the SQLite adapter, you must be running **Harlequin v1.20.0** or higher using **Python 3.12** or higher.

### Switching Transaction Modes

If the pre-requisites are met, you should see a button labeled "Tx: Auto" in the Run Query bar in Harlequin:

<div class="flex flex-wrap justify-center py-2">
    <figure>
        <img src={tx_auto} alt="Screenshot of the Run Query bar with transaction mode support enabled."  class="h-auto w-full max-h-80">
        <figcaption class="text-center text-sm text-purple font-bold">Screenshot of the Run Query bar with transaction mode support enabled.</figcaption>
    </figure>
</div>

Clicking "Tx: Auto" will toggle the mode to "Tx: Manual", and the UI will grow two new buttons:
<div class="flex flex-wrap justify-center py-2">
    <figure>
        <img src={tx_manual} alt="Screenshot of the Run Query bar with manual transaction mode enabled."  class="h-auto w-full max-h-80">
        <figcaption class="text-center text-sm text-purple font-bold">Screenshot of the Run Query bar with manual transaction mode enabled.</figcaption>
    </figure>
</div>

In Manual mode, you do not explicitly need to `begin` a transaction: one will be opened for you. You can commit that transaction either by executing a `commit;` query, or pressing the "🡅" button in the Run Query bar. Analogously, you can roll back a transaction by executing `rollback;` or pressing the "⮌" button.