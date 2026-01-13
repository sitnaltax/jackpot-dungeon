<script>
  import Token from './Token.svelte';

  export let pod;
  export let selected = false;
  export let selectable = false;
  export let showCost = false;
  export let onSelect = null;

  function handleClick() {
    if (selectable && onSelect) {
      onSelect(pod.id);
    }
  }
</script>

<div
  class="pod"
  class:selected
  class:selectable
  on:click={handleClick}
  on:keydown={(e) => e.key === 'Enter' && handleClick()}
  role={selectable ? 'button' : 'group'}
  tabindex={selectable ? 0 : -1}
>
  <div class="pod-header">
    <span class="pod-name">{pod.name}</span>
    {#if showCost && pod.cost > 0}
      <span class="pod-cost">💰 {pod.cost}</span>
    {/if}
  </div>
  <div class="pod-tokens">
    {#each pod.tokens as token (token.id)}
      <Token {token} size="small" />
    {/each}
  </div>
  {#if selectable}
    <div class="select-indicator">
      {selected ? '✓ Selected' : 'Click to select'}
    </div>
  {/if}
</div>

<style>
  .pod {
    background: #16213e;
    border: 2px solid #333;
    border-radius: 8px;
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    transition: border-color 0.2s ease, transform 0.2s ease;
  }

  .pod.selectable {
    cursor: pointer;
  }

  .pod.selectable:hover {
    border-color: #666;
    transform: translateY(-2px);
  }

  .pod.selected {
    border-color: #e74c3c;
    background: #1e1e3e;
  }

  .pod-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .pod-name {
    font-weight: bold;
    font-size: 0.875rem;
  }

  .pod-cost {
    font-size: 0.875rem;
    color: #f1c40f;
  }

  .pod-tokens {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }

  .select-indicator {
    font-size: 0.75rem;
    text-align: center;
    color: #888;
    padding-top: 0.25rem;
    border-top: 1px solid #333;
  }

  .pod.selected .select-indicator {
    color: #e74c3c;
  }
</style>
