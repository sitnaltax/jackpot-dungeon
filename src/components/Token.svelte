<script>
  import { TOKEN_TYPES, RANKS, getEffectiveValue } from '../lib/constants.js';
  import { inspectToken } from '../lib/gameState.js';

  export let token;
  export let size = 'normal'; // 'small' | 'normal' | 'large'
  export let selectable = false;
  export let selected = false;
  export let onSelect = null;
  export let context = null; // Array of all drawn tokens for synergy display

  $: typeData = TOKEN_TYPES[token.type];
  $: rankData = RANKS[token.rank];
  $: effectiveValue = getEffectiveValue(token);
  $: isUpgraded = token.rank !== 'basic';

  function handleClick() {
    inspectToken(token, context, selectable);
  }

  function handleSelectClick(e) {
    e.stopPropagation();
    if (onSelect) {
      onSelect(token.id);
    }
  }
</script>

<div
  class="token {size}"
  class:upgraded={isUpgraded}
  class:selected
  style="--type-color: {typeData.color}; --rank-color: {rankData.color}"
  on:click={handleClick}
  on:keydown={(e) => e.key === 'Enter' && handleClick()}
  role="button"
  tabindex="0"
>
  <div class="token-icon">{typeData.icon}</div>
  <div class="token-value">{effectiveValue}</div>
  {#if isUpgraded}
    <div class="token-rank" title="{rankData.name} (×{rankData.multiplier})">
      {rankData.name[0]}
    </div>
  {/if}
  {#if selectable}
    <button
      class="select-checkbox"
      class:checked={selected}
      on:click={handleSelectClick}
      title={selected ? 'Deselect for redraw' : 'Select for redraw'}
    >
      {#if selected}✓{/if}
    </button>
  {/if}
</div>

<style>
  .token {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #2a2a4a 0%, #1a1a2e 100%);
    border: 2px solid var(--type-color);
    border-radius: 8px;
    position: relative;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .token {
    cursor: pointer;
  }

  .token:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  }

  .token.selected {
    border-color: #e74c3c;
    box-shadow: 0 0 12px #e74c3c, inset 0 0 20px rgba(231, 76, 60, 0.2);
    transform: translateY(-4px);
  }

  .token.small {
    width: 40px;
    height: 50px;
    font-size: 0.75rem;
  }

  .token.normal {
    width: 60px;
    height: 75px;
  }

  .token.large {
    width: 80px;
    height: 100px;
  }

  .token-icon {
    font-size: 1.5em;
  }

  .token.small .token-icon {
    font-size: 1em;
  }

  .token.large .token-icon {
    font-size: 2em;
  }

  .token-value {
    font-size: 1.25em;
    font-weight: bold;
    color: var(--type-color);
  }

  .token.small .token-value {
    font-size: 0.875em;
  }

  .token.large .token-value {
    font-size: 1.5em;
  }

  .token-rank {
    position: absolute;
    top: -6px;
    right: -6px;
    width: 18px;
    height: 18px;
    background: var(--rank-color);
    color: #000;
    border-radius: 50%;
    font-size: 0.625rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .token.small .token-rank {
    width: 14px;
    height: 14px;
    font-size: 0.5rem;
    top: -4px;
    right: -4px;
  }

  .select-checkbox {
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 22px;
    height: 22px;
    background: #1a1a2e;
    border: 2px solid #555;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    color: #fff;
    padding: 0;
    transition: all 0.15s ease;
  }

  .select-checkbox:hover {
    border-color: #e74c3c;
    background: #2a2a4a;
  }

  .select-checkbox.checked {
    background: #e74c3c;
    border-color: #e74c3c;
  }
</style>
