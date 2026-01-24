<script>
  import { TOKEN_TYPES, RANKS, getTokenValue } from '../lib/constants.js';
  import {
    inspectedToken,
    inspectionContext,
    inspectionSelectable,
    closeInspection,
    selectedTokensForRedraw,
    toggleTokenSelection,
  } from '../lib/gameState.js';

  $: token = $inspectedToken;
  $: context = $inspectionContext;
  $: selectable = $inspectionSelectable;
  $: isSelected = token ? $selectedTokensForRedraw.has(token.id) : false;
  $: typeData = token ? TOKEN_TYPES[token.type] : null;
  $: rankData = token ? RANKS[token.rank] : null;

  function handleToggleSelect() {
    if (token) {
      toggleTokenSelection(token.id);
    }
  }

  // Calculate base value (without synergies)
  $: baseValue = token ? getTokenValue(token) : 0;

  // Calculate contextual value and contributions (with synergies, if in combat)
  $: contextualInfo = getContextualInfo(token, context, typeData);

  function getContextualInfo(token, context, typeData) {
    if (!token || !typeData) return null;

    // If token has a getValue callback and we have context, calculate synergy effects
    if (typeData.getValue && context) {
      const contributions = typeData.getValue(token, context);
      const stats = Object.entries(contributions).map(([stat, value]) => ({
        stat,
        value,
        hasBonus: value > baseValue,
      }));
      return { stats, hasSynergy: stats.some(s => s.hasBonus) };
    }

    // Default: contributes to its own stat
    return {
      stats: [{ stat: token.type, value: baseValue, hasBonus: false }],
      hasSynergy: false,
    };
  }

  // Get description of what this token does
  function getTokenDescription(token, typeData) {
    if (!token || !typeData) return '';

    switch (token.type) {
      case 'insight':
        return 'Contributes to Insight, helping you perceive the fey\'s true nature.';
      case 'composure':
        return 'Contributes to Composure, helping you withstand bewilderment.';
      case 'treasure':
        return 'Adds directly to treasure gained from the encounter.';
      case 'lock':
        return 'Contributes to Composure. Gains a bonus when drawn with a Key.';
      case 'key':
        return 'Contributes to Insight. Gains a bonus when drawn with a Lock.';
      default:
        return '';
    }
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      closeInspection();
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') {
      closeInspection();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if token}
  <div class="modal-backdrop" on:click={handleBackdropClick} role="dialog" aria-modal="true">
    <div class="modal-content" style="--type-color: {typeData.color}; --rank-color: {rankData.color}">
      <button class="close-btn" on:click={closeInspection}>&times;</button>

      <div class="token-header">
        <span class="token-icon">{typeData.icon}</span>
        <div class="token-title">
          <h2>{typeData.name}</h2>
          {#if token.rank !== 'basic'}
            <span class="rank-badge">{rankData.name}</span>
          {/if}
        </div>
      </div>

      <p class="description">{getTokenDescription(token, typeData)}</p>

      <div class="stats-section">
        <h3>{context ? 'Current Effect' : 'Base Value'}</h3>

        {#if contextualInfo}
          {#each contextualInfo.stats as { stat, value, hasBonus }}
            <div class="stat-row" class:bonus={hasBonus}>
              <span class="stat-name">{stat.charAt(0).toUpperCase() + stat.slice(1)}</span>
              <span class="stat-value">
                +{value}
                {#if hasBonus}
                  <span class="bonus-indicator">(synergy!)</span>
                {/if}
              </span>
            </div>
          {/each}

          {#if !context && typeData.getValue}
            <p class="synergy-hint">This token has synergy effects when drawn in combat.</p>
          {/if}
        {/if}
      </div>

      {#if token.rank !== 'basic'}
        <div class="rank-section">
          <span class="rank-multiplier">Rank multiplier: x{rankData.multiplier}</span>
        </div>
      {/if}

      {#if selectable}
        <button
          class="select-btn"
          class:selected={isSelected}
          on:click={handleToggleSelect}
        >
          {isSelected ? '✓ Selected for Redraw' : 'Select for Redraw'}
        </button>
      {/if}
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    border: 2px solid var(--type-color);
    border-radius: 12px;
    padding: 1.5rem;
    max-width: 350px;
    width: 90%;
    position: relative;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
  }

  .close-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: none;
    border: none;
    color: #888;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    line-height: 1;
  }

  .close-btn:hover {
    color: #fff;
  }

  .token-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .token-icon {
    font-size: 3rem;
  }

  .token-title h2 {
    margin: 0;
    color: var(--type-color);
    font-size: 1.5rem;
  }

  .rank-badge {
    display: inline-block;
    background: var(--rank-color);
    color: #000;
    padding: 0.125rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: bold;
    margin-top: 0.25rem;
  }

  .description {
    color: #aaa;
    font-size: 0.9rem;
    margin-bottom: 1rem;
    line-height: 1.4;
  }

  .stats-section {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .stats-section h3 {
    margin: 0 0 0.75rem 0;
    font-size: 0.875rem;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .stat-row:last-of-type {
    border-bottom: none;
  }

  .stat-name {
    color: #ccc;
  }

  .stat-value {
    color: var(--type-color);
    font-weight: bold;
    font-size: 1.125rem;
  }

  .stat-row.bonus .stat-value {
    color: #2ecc71;
  }

  .bonus-indicator {
    font-size: 0.75rem;
    font-weight: normal;
    color: #2ecc71;
  }

  .synergy-hint {
    margin: 0.75rem 0 0 0;
    font-size: 0.8rem;
    color: #888;
    font-style: italic;
  }

  .rank-section {
    text-align: center;
    margin-bottom: 1rem;
  }

  .rank-multiplier {
    color: var(--rank-color);
    font-size: 0.875rem;
  }

  .select-btn {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #e74c3c;
    background: transparent;
    color: #e74c3c;
    font-size: 1rem;
    font-weight: bold;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .select-btn:hover {
    background: rgba(231, 76, 60, 0.1);
  }

  .select-btn.selected {
    background: #e74c3c;
    color: #fff;
  }
</style>
