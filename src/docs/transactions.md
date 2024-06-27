---
title: Managing Transactions
menuOrder: 19
---

<script>
    import tx_auto from "$lib/assets/docs/tx-auto.png"
    import tx_manual from "$lib/assets/docs/tx-manual.png"
</script>

Different adapters handle transactions differently; many choose to auto-commit each executed query. However, some adapters define multiple Transaction Modes that allow you to fine-tune the transaction handling of the commands you run in Harlequin.

## Switching Transaction Modes

If the adapter supports multiple transaction modes, you should see a button labeled "Tx: [Mode Name]" in the Run Query bar in Harlequin. For example, this button is shown when the SQLite adapter is in Autocommit mode:

<div class="flex flex-wrap justify-center py-2">
    <figure>
        <img src={tx_auto} alt="Screenshot of the Run Query bar with transaction mode support enabled."  class="h-auto w-full max-h-80">
        <figcaption class="text-center text-sm text-purple font-bold">Screenshot of the Run Query bar with transaction mode support enabled.</figcaption>
    </figure>
</div>

Clicking "Tx: [Mode Name]" button will toggle to the adapter's next transaction mode. For SQLite, clicking the button above toggles to "Tx: Manual", and the UI grows two new buttons:

<div class="flex flex-wrap justify-center py-2">
    <figure>
        <img src={tx_manual} alt="Screenshot of the Run Query bar with manual transaction mode enabled."  class="h-auto w-full max-h-80">
        <figcaption class="text-center text-sm text-purple font-bold">Screenshot of the Run Query bar with manual transaction mode enabled.</figcaption>
    </figure>
</div>

## Committing Transactions

If supported by the adapter and appropriate for the transaction mode, next to the "Tx: [Mode Name]" button will appear a button labeled "🡅". Clicking this button will commit the current open transaction.

## Rolling Back Transactions

As with committing, if supported by the adapter and appropriate for the transaction mode, next to the "Tx: [Mode Name]" button will appear a button labeled "⮌". Clicking this button will roll back the current open transaction.
