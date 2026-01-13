<script>
  import { TOKEN_TYPES, RANKS, getEffectiveValue } from '../lib/constants.js';

  export let token;
  export let size = 'normal'; // 'small' | 'normal' | 'large'
  export let selectable = false;
  export let selected = false;
  export let onSelect = null;

  $: typeData = TOKEN_TYPES[token.type];
  $: rankData = RANKS[token.rank];
  $: effectiveValue = getEffectiveValue(token);
  $: isUpgraded = token.rank !== 'basic';

  function handleClick() {
    if (selectable && onSelect) {
      onSelect(token.id);
    }
  }
</script>

<div
  class="token {size}"
  class:upgraded={isUpgraded}
  class:selectable
  class:selected
  style="--type-color: {typeData.color}; --rank-color: {rankData.color}"
  on:click={handleClick}
  on:keydown={(e) => e.key === 'Enter' && handleClick()}
  role={selectable ? 'button' : 'img'}
  tabindex={selectable ? 0 : -1}
>
  <div class="token-icon">{typeData.icon}</div>
  <div class="token-value">{effectiveValue}</div>
  {#if isUpgraded}
    <div class="token-rank" title="{rankData.name} ({rankData.multiplier}x)">
      {rankData.name[0]}
    </div>
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

  .token:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  }

  .token.upgraded {
    border-color: var(--rank-color);
    box-shadow: 0 0 8px var(--rank-color);
  }

  .token.selectable {
    cursor: pointer;
  }

  .token.selected {
    border-color: #e74c3c;
    box-shadow: 0 0 12px #e74c3c, inset 0 0 20px rgba(231, 76, 60, 0.2);
    transform: translateY(-4px);
  }

  .token.selected::after {
    content: '✓';
    position: absolute;
    top: -8px;
    left: -8px;
    width: 20px;
    height: 20px;
    background: #e74c3c;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    color: #fff;
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
</style>
