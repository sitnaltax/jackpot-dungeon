<script>
  import { player, shopPods, selectedPodToReplace, purchasePod, skipShop, purchasedShopPods, refreshShop } from '../lib/gameState.js';
  import { clonePodTemplate } from '../lib/pods.js';
  import Pod from './Pod.svelte';
  import PodDisplay from './PodDisplay.svelte';

  function handlePurchase(podTemplate, index) {
    purchasePod(podTemplate, index);
  }

  const refreshCost = 1;

  $: canAfford = (cost) => $player.treasure >= cost;
  $: isPurchased = (index) => $purchasedShopPods.has(index);
  $: canPurchase = (cost, index) => canAfford(cost) && $selectedPodToReplace !== null && !isPurchased(index);
  $: canRefresh = $player.treasure >= refreshCost;
</script>

<div class="shop">
  <div class="shop-header">
    <h2>🏪 Shop</h2>
    <div class="treasure-display">
      ${$player.treasure}
    </div>
  </div>

  <p class="instructions">
    Select one of your pods below to replace, then click a shop pod to purchase it.
  </p>

  <div class="shop-section">
    <div class="section-header">
      <h3>Available Pods</h3>
      <button
        class="btn btn-refresh"
        disabled={!canRefresh}
        on:click={refreshShop}
      >
        Refresh (${refreshCost})
      </button>
    </div>
    <div class="shop-pods">
      {#each $shopPods as podTemplate, index}
        <div class="shop-pod-wrapper" class:sold={isPurchased(index)}>
          <Pod pod={{ id: `preview-${index}`, cost: podTemplate.cost, tokens: podTemplate.tokenDefs.map((t, i) => ({ ...t, id: `preview-${index}-${i}`, rank: t.rank || 'basic' })) }} showCost={true} />
          <button
            class="btn btn-purchase"
            disabled={!canPurchase(podTemplate.cost, index)}
            on:click={() => handlePurchase(podTemplate, index)}
          >
            {#if isPurchased(index)}
              Sold
            {:else if !canAfford(podTemplate.cost)}
              Can't Afford
            {:else if !$selectedPodToReplace}
              Select Pod First
            {:else}
              Purchase
            {/if}
          </button>
        </div>
      {/each}
    </div>
  </div>

  <div class="shop-section">
    <PodDisplay selectable={true} />
  </div>

  <button class="btn btn-secondary" on:click={skipShop}>
    Done Shopping →
  </button>
</div>

<style>
  .shop {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .shop-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .shop-header h2 {
    margin: 0;
  }

  .treasure-display {
    font-size: 1.5rem;
    font-weight: bold;
    color: #f1c40f;
    background: #16213e;
    padding: 0.5rem 1rem;
    border-radius: 6px;
  }

  .instructions {
    color: #888;
    margin: 0;
    font-style: italic;
  }

  .shop-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .shop-section h3 {
    margin: 0;
    font-size: 1rem;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .btn-refresh {
    background: #27ae60;
    color: #fff;
    font-size: 0.8rem;
    padding: 0.4rem 0.75rem;
  }

  .btn-refresh:hover:not(:disabled) {
    background: #219a52;
  }

  .shop-pods {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 1rem;
  }

  .shop-pod-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .shop-pod-wrapper.sold {
    opacity: 0.5;
  }

  .btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.2s ease;
  }

  .btn:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-purchase {
    background: #3498db;
    color: #fff;
  }

  .btn-purchase:hover:not(:disabled) {
    background: #2980b9;
  }

  .btn-secondary {
    background: #34495e;
    color: #fff;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    align-self: center;
  }

  .btn-secondary:hover {
    background: #2c3e50;
  }
</style>
