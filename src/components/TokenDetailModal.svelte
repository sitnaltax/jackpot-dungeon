<script>
  import { RANKS } from '../lib/constants.js';
  import { TOKEN_TYPES, getTokenValue } from '../lib/tokens.js';
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

  // Calculate contextual value and contributions (with synergies, if in an encounter)
  $: contextualInfo = getContextualInfo(token, context, typeData, rankData);

  function getContextualInfo(token, context, typeData, rankData) {
    if (!token || !typeData) return null;

    const rankMultiplier = rankData?.multiplier || 1;

    // If token has a getValue callback and we have context, calculate synergy effects
    if (typeData.getValue && context) {
      const contributions = typeData.getValue(token, context);
      // Compute pre-rank contributions to get rank-independent synergy
      const preRankContributions = typeData.getValue({ ...token, rank: 'ordinary' }, context);
      const stats = Object.entries(contributions).map(([stat, value]) => {
        const preRankValue = preRankContributions[stat] ?? typeData.baseValue;
        const synergyBonus = preRankValue - typeData.baseValue;
        return {
          stat,
          value,
          baseValue: typeData.baseValue,
          synergyBonus,
          rankMultiplier,
          hasBonus: synergyBonus > 0,
        };
      });
      return { stats, hasSynergy: stats.some(s => s.hasBonus) };
    }

    // For tokens with getValue but no context, show potential
    if (typeData.getValue) {
      // Show base calculation without synergy
      const baseValue = Math.floor(typeData.baseValue * rankMultiplier);
      return {
        stats: [{
          stat: token.type,
          value: baseValue,
          baseValue: typeData.baseValue,
          synergyBonus: 0,
          rankMultiplier,
          hasBonus: false,
        }],
        hasSynergy: false,
        hasPotentialSynergy: true,
      };
    }

    // Default: contributes to its own stat
    const baseValue = Math.floor(typeData.baseValue * rankMultiplier);
    return {
      stats: [{
        stat: token.type,
        value: baseValue,
        baseValue: typeData.baseValue,
        synergyBonus: 0,
        rankMultiplier,
        hasBonus: false,
      }],
      hasSynergy: false,
    };
  }

  // Get description of what this token does
  function getTokenDescription(token, typeData) {
    if (!token || !typeData) return '';

    switch (token.type) {
      case 'insight':
        return 'Contributes to Insight, helping you gain rewards from encounters.';
      case 'resolve':
        return 'Contributes to Resolve, helping you withstand trouble.';
      case 'xp':
        return 'Adds directly to XP gained from the encounter.';
      case 'harmony':
        return 'Contributes to Resolve. Gains a bonus when drawn with a different Musical token.';
      case 'melody':
        return 'Contributes to Insight. Gains a bonus when drawn with a different Musical token.';
      case 'chord':
        return 'Contributes 1 Insight, Resolve, and XP. Increases to 3 each if drawn with 2 other unique Musical tokens.';
      case 'discord':
        return 'Contributes 2 Insight and Resolve. Increases to 5 each if drawn with 3 other unique Musical tokens.';
      case 'scorpio':
        return 'Contributes to Insight. Gains +1 for each Celestial token drawn.';
      case 'capricorn':
        return 'Contributes to Resolve. Gains +1 for each Celestial token drawn.';
      case 'taurus':
        return 'Contributes to XP. Gains +1 for each Celestial token drawn.';
      case 'virgo':
        return 'Contributes to Insight and XP. Gains +1 each for each Celestial token drawn.';   
      case 'aries':
        return 'Contributes to Resolve and XP. Gains +1 each for each Celestial token drawn.';     
      case 'libra':
        return 'Contributes to all stats. Gains +1 Insight, Resolve, and XP for each other Celestial token drawn.';
      case 'oak':
        return 'Contributes to Resolve. Gains +1 for each Botanical token drawn.';
      case 'lotus':
        return 'Contributes to Insight. Gains +1 for each Botanical token drawn.';
      case 'clover':
        return 'Contributes to XP. Gains +1 for each Botanical token drawn.';
      case 'willow':
        return 'Contributes to Resolve and XP. Gains +1 each for each Botanical token drawn.';
      case 'orchid':
        return 'Contributes to Insight and XP. Gains +1 each for each Botanical token drawn.';
      case 'fern':
        return 'Contributes to all stats. Gains +1 Insight, Resolve, and XP for each other Botanical token drawn.';
      case 'pluto':
        return 'Contributes 8 Insight. Drops to 0 if any other Celestial tokens are drawn.';
      case 'hemlock':
        return 'Contributes 8 Resolve. Drops to 0 if any other Botanical tokens are drawn.';
      case 'obsidian':
        return 'Contributes to Insight. Gains +1 per Chthonic token drawn. Grants +2 Insight when discarded.';
      case 'granite':
        return 'Contributes to Resolve. Gains +1 per Chthonic token drawn. Grants +2 Resolve when discarded.';
      case 'geode':
        return 'Contributes to XP. Gains +1 per Chthonic token drawn. Grants +2 XP when discarded.';
      case 'brainstorm':
        return 'Contributes a base 4 Insight and 4 XP.';
      case 'meditation':
        return 'Contributes a base 4 Resolve and 4 XP.';
      case 'wild':
        return 'Contributes to all stats. Needs 2+ unique tags (Musical, Celestial, Botanical, Chthonic) among other drawn tokens. Gains +3 per tag to Insight, Resolve, and XP.';
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
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
  <div class="modal-backdrop" on:click={handleBackdropClick} role="dialog" aria-modal="true">
    <div class="modal-content" style="--type-color: {typeData.color}; --rank-color: {rankData.color}">
      <button class="close-btn" on:click={closeInspection}>&times;</button>

      <div class="token-header">
        <span class="token-icon">{typeData.icon}</span>
        <div class="token-title">
          <h2>{typeData.name}</h2>
          <div class="badges">
            <span class="rank-badge" style="background: {rankData.color}">
              {rankData.name}
            </span>
            {#if typeData.tags}
              {#each typeData.tags as tag}
                <span class="tag-badge">{tag}</span>
              {/each}
            {/if}
          </div>
        </div>
      </div>

      <p class="description">{getTokenDescription(token, typeData)}</p>

      <div class="stats-section">
        <h3>{context ? 'Current Contribution' : 'Base Value'}</h3>

        {#if contextualInfo}
          {#each contextualInfo.stats as { stat, value, baseValue, synergyBonus, rankMultiplier, hasBonus }}
            <div class="stat-block" class:bonus={hasBonus}>
              <div class="stat-header">
                <span class="stat-icon">{TOKEN_TYPES[stat]?.icon || '?'}</span>
                <span class="stat-name">{stat === 'xp' ? 'XP' : stat.charAt(0).toUpperCase() + stat.slice(1)}</span>
                <span class="stat-total">+{value}</span>
              </div>
              <div class="stat-calculation">
                <span class="calc-base">{baseValue}</span>
                {#if synergyBonus > 0}
                  <span class="calc-op">+</span>
                  <span class="calc-synergy">{synergyBonus} synergy</span>
                {/if}
                {#if rankMultiplier !== 1}
                  <span class="calc-op">&times;</span>
                  <span class="calc-rank">{rankMultiplier} rank</span>
                {/if}
                <span class="calc-op">=</span>
                <span class="calc-result">{value}</span>
              </div>
            </div>
          {/each}

          {#if contextualInfo.hasPotentialSynergy}
            <p class="synergy-hint">This token has synergy effects when drawn in encounters.</p>
          {/if}
        {/if}
      </div>

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

  .badges {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-top: 0.25rem;
  }

  .rank-badge {
    display: inline-block;
    background: var(--rank-color);
    color: #000;
    padding: 0.125rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: bold;
  }

  .tag-badge {
    display: inline-block;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    padding: 0.125rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: bold;
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
  }

  .stats-section h3 {
    margin: 0 0 0.75rem 0;
    font-size: 0.875rem;
    color: #aaa;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .stat-block {
    padding: 0.75rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .stat-block:last-of-type {
    border-bottom: none;
  }

  .stat-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .stat-icon {
    font-size: 1.25rem;
  }

  .stat-name {
    color: #ccc;
    flex: 1;
  }

  .stat-total {
    color: var(--type-color);
    font-weight: bold;
    font-size: 1.25rem;
  }

  .stat-block.bonus .stat-total {
    color: #2ecc71;
  }

  .stat-calculation {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 1rem;
    color: #aaa;
    padding-left: 2rem;
  }

  .calc-base {
    color: #aaa;
  }

  .calc-op {
    color: #666;
  }

  .calc-synergy {
    color: #2ecc71;
    font-weight: bold;
  }

  .calc-rank {
    color: var(--rank-color);
  }

  .calc-result {
    color: var(--type-color);
    font-weight: bold;
  }

  .stat-block.bonus .calc-result {
    color: #2ecc71;
  }

  .synergy-hint {
    margin: 0.75rem 0 0 0;
    font-size: 0.8rem;
    color: #aaa;
    font-style: italic;
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
