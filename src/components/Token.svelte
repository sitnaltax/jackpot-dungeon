<script>
  import { RANKS } from '../lib/constants.js';
  import { TOKEN_TYPES, getTokenValue, getTokenImage } from '../lib/tokens.js';
  import { inspectToken } from '../lib/gameState.js';

  export let token;
  export let size = 'normal'; // 'small' | 'normal' | 'large'
  export let selectable = false;
  export let selected = false;
  export let onSelect = null;
  export let context = null; // Array of all drawn tokens for synergy display
  export let equipment = []; // Equipped items for synergy display

  $: typeData = TOKEN_TYPES[token.type];
  $: rankData = RANKS[token.rank];
  $: baseValue = getTokenValue(token);
  $: borderEffect = typeData.borderEffect || null;
  $: hasSynergyIndicator = (typeData.getValue && !typeData.noSynergy) || !!typeData.onDiscard;
  $: tokenImage = getTokenImage(typeData);

  // Calculate contextual contributions (with synergies if context provided)
  $: contributions = getContributions(token, context, equipment, typeData, baseValue);

  function getContributions(token, context, equipment, typeData, baseValue) {
    if (typeData.getValue) {
      if (!typeData.noSynergy && !context) {
        // Synergy token without context: fall back to base value display
        return [{ stat: token.type, value: baseValue, icon: typeData.icon }];
      }
      const effectiveContext = typeData.noSynergy ? [] : context;
      const values = typeData.getValue(token, effectiveContext, equipment);
      return Object.entries(values).map(([stat, value]) => ({
        stat,
        value,
        icon: TOKEN_TYPES[stat]?.icon || '?',
      }));
    }
    // Default: contributes to its own stat
    return [{ stat: token.type, value: baseValue, icon: typeData.icon }];
  }

  function handleClick() {
    inspectToken(token, context, selectable, equipment);
  }

  function handleSelectClick(e) {
    e.stopPropagation();
    if (onSelect) {
      onSelect(token.id);
    }
  }
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div
  class="token {size}"
  class:selected
  class:has-border-effect={borderEffect}
  style="--type-color: {typeData.color}; --rank-color: {rankData.color}; --border-effect: {borderEffect || 'none'}; --bg-img: url('{tokenImage}')"
  on:click={handleClick}
  on:keydown={(e) => e.key === 'Enter' && handleClick()}
  role="button"
  tabindex="0"
>
  <div class="token-icon">{typeData.icon}</div>
  <div class="token-value">{contributions[0].value}{#if size === 'small' && hasSynergyIndicator}<span>{typeData.synergyPenalty ? '*' : '+'}</span>{/if}</div>
  <div
    class="token-rank"
    style="background: {rankData.color}"
    title="{rankData.name} (×{rankData.multiplier})"
  >
    {rankData.name[0]}
  </div>
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
    background:
      linear-gradient(135deg, rgba(42,42,74,0.78) 0%, rgba(26,26,46,0.78) 100%),
      var(--bg-img) center / cover no-repeat,
      #1a1a2e;
    border: 2px solid var(--type-color);
    border-radius: 8px;
    position: relative;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .token.has-border-effect {
    border: none;
    background: var(--border-effect);
    padding: 3px;
  }

  .token.has-border-effect::before {
    content: '';
    position: absolute;
    inset: 3px;
    background:
      linear-gradient(135deg, rgba(42,42,74,0.78) 0%, rgba(26,26,46,0.78) 100%),
      var(--bg-img) center / cover no-repeat,
      #1a1a2e;
    border-radius: 5px;
    z-index: 0;
  }

  .token.has-border-effect .token-icon,
  .token.has-border-effect .token-value {
    position: relative;
    z-index: 1;
  }

  .token.has-border-effect .token-rank {
    z-index: 1;
  }

  .token {
    cursor: pointer;
  }

  .token:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  }

  .token.selected {
    box-shadow: 0 0 12px #ffffff, inset 0 0 20px rgba(255, 255, 255, 0.2);
    transform: translateY(-4px);
  }

  .token.has-border-effect.selected {
    box-shadow: 0 0 16px #ffffff, 0 0 24px rgba(255, 255, 255, 0.5);
  }

  .token.small {
    width: 40px;
    height: 50px;
    font-size: 0.85rem;
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
    font-size: 1em;
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
    font-family: system-ui, -apple-system, sans-serif;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .token.small .token-rank {
    width: 14px;
    height: 14px;
    font-size: 0.65rem;
    top: -4px;
    right: -4px;
  }

  .token.large .token-rank {
    top: 0;
    right: 0;
    width: 30px;
    height: 30px;
    border-radius: 0;
    clip-path: path('M 0 0 L 22 0 Q 30 0 30 8 L 30 30 Z');
    align-items: flex-start;
    justify-content: flex-end;
    padding: 3px 5px 0 0;
    font-size: 0.6rem;
  }

  .select-checkbox {
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 26px;
    height: 26px;
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
    border-color: #ffffff;
    background: #2a2a4a;
  }

  .select-checkbox.checked {
    background: #ffffff;
    border-color: #ffffff;
    color: #000;
  }
</style>
