# Svelte Reactivity Notes

## Store Access in Helper Functions

Svelte's reactivity system doesn't automatically track store changes when they're accessed inside helper functions called from the template.

### The Problem

```svelte
<script>
  import { myStore } from './stores.js';

  // This function accesses $myStore internally
  function checkValue(index) {
    return $myStore.has(index);
  }
</script>

<!-- This WON'T re-render when myStore changes -->
<button disabled={!checkValue(index)}>Buy</button>
```

When `myStore` updates, Svelte doesn't know to re-evaluate `checkValue(index)` because the store subscription is hidden inside the function.

### The Solution

Extract store values into reactive declarations and pass them as parameters:

```svelte
<script>
  import { myStore } from './stores.js';

  // Create a reactive reference to the store value
  $: storeValue = $myStore;

  // Function now receives the value as a parameter
  function checkValue(index, store) {
    return store.has(index);
  }
</script>

<!-- This WILL re-render when myStore changes -->
<button disabled={!checkValue(index, storeValue)}>Buy</button>
```

Now Svelte sees `storeValue` in the template expression and knows to re-render when it changes.

### Real Example (ItemShop.svelte)

**Before (broken):**
```svelte
$: hasEmptySlot = equipmentSlots.some(e => e === null);

function canPurchase(item, index) {
  if ($purchasedShopItems.has(index)) return false;  // Store access hidden
  if ($selectedEquipmentSlot === null) return false; // Store access hidden
  return true;
}

<button disabled={!canPurchase(item, index)}>
```

**After (working):**
```svelte
$: hasEmptySlot = equipmentSlots.some(e => e === null);
$: purchasedSet = $purchasedShopItems;
$: selectedSlot = $selectedEquipmentSlot;

function canPurchase(item, index, purchased, selected) {
  if (purchased.has(index)) return false;
  if (selected === null) return false;
  return true;
}

<button disabled={!canPurchase(item, index, purchasedSet, selectedSlot)}>
```

### Key Takeaway

When using stores in Svelte components, ensure any store value that affects rendering is either:
1. Used directly in the template with `$store` syntax
2. Assigned to a reactive declaration (`$:`) and that variable is used in/passed to template expressions
