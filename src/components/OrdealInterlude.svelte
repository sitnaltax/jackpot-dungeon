<script>
  import {
    player,
    ordealMysteryPool, ordealRound, ordealId,
    beginOrdealRound,
    ordealSpendOnClue, ordealSpendOnStamina,
    ordealOpenPodShop, ordealOpenItemShop,
    getEffectiveMaxStamina,
  } from '../lib/gameState.js';
  import { CONFIG } from '../lib/constants.js';
  import { calculateBaseStat, FINAL_ORDEALS } from '../lib/encounters.js';
  import PodDisplay from './PodDisplay.svelte';

  $: difficulty = $player.difficulty;
  $: currentOrdeal = FINAL_ORDEALS.find(o => o.id === $ordealId) ?? FINAL_ORDEALS[0];
  $: troublePerRound = currentOrdeal.troublePerRound;
  $: nextTrouble = calculateBaseStat(CONFIG.ordealStartDepth, difficulty) + currentOrdeal.troubleMod + $ordealRound * troublePerRound;
  $: startPool = Math.round(currentOrdeal.mysteryBase * (CONFIG.ordealMysteryScale[difficulty] ?? 1));
  $: poolPercent = ($ordealMysteryPool / startPool) * 100;

  $: effectiveMax = getEffectiveMaxStamina($player);
  $: clueReduction = Math.min(Math.floor($player.xp / 3), Math.max(0, $ordealMysteryPool - 1));
  $: xpSpentOnClue = clueReduction * 3;
  $: homeHeal = Math.min(Math.floor($player.xp / 3), effectiveMax - $player.stamina);
  $: xpSpentOnHome = homeHeal * 3;
  $: treasureGain = Math.floor($player.xp / 10);
  $: xpSpentOnTreasure = treasureGain * 10;

  function spendAllOnClue() {
    ordealSpendOnClue($player.xp);
    beginOrdealRound();
  }

  function spendAllOnStamina() {
    ordealSpendOnStamina($player.xp);
    beginOrdealRound();
  }

  function openItemShop() {
    ordealOpenItemShop($player.xp);
  }
</script>

<div class="interlude">
  <div class="header">
    <h2>A Brief Respite</h2>
    <div class="ordeal-name">{currentOrdeal.name}</div>
    <div class="pool-bar">
      <div class="pool-fill" style="width: {poolPercent}%"></div>
      <span class="pool-text">Mystery: {$ordealMysteryPool} remaining</span>
    </div>
    <div class="round-info">Next Trouble: {nextTrouble}</div>
  </div>

  <div class="resources">
    <div class="resource">
      <span class="resource-label">Stamina</span>
      <span class="resource-value stamina">{$player.stamina} / {effectiveMax}</span>
    </div>
    <div class="resource">
      <span class="resource-label">XP</span>
      <span class="resource-value xp">{$player.xp}</span>
    </div>
    <div class="resource">
      <span class="resource-label">Treasure</span>
      <span class="resource-value treasure">${$player.treasure}</span>
    </div>
  </div>

  <div class="options">

    <div class="option-card">
      <div class="option-header technique">Remember a Technique</div>
      <p class="option-desc">Visit the pod shop.</p>
      <button class="btn btn-technique" on:click={ordealOpenPodShop}>
        Remember a Technique
      </button>
    </div>

    <div class="option-card">
      <div class="option-header treasure">Remember a Treasure</div>
      <p class="option-desc">Spend all your XP to gain Treasure, then visit the item shop. (10 XP = $1)</p>
      <div class="spend-preview">{xpSpentOnTreasure} XP → ${treasureGain}</div>
      <button class="btn btn-treasure" on:click={openItemShop}>
        Remember a Treasure
      </button>
    </div>

    <div class="option-card">
      <div class="option-header home">Remember your Home</div>
      <p class="option-desc">Use your XP to restore Stamina. (3 XP = 1 Stamina)</p>
      <div class="spend-preview">{xpSpentOnHome} XP → {homeHeal} Stamina</div>
      <button class="btn btn-home" on:click={spendAllOnStamina}>
        Remember your Home
      </button>
    </div>

    <div class="option-card">
      <div class="option-header clue">Remember a Clue</div>
      <p class="option-desc">Use your XP to penetrate the Mystery. This can't solve the last point of Mystery, though. (3 XP = 1 Insight)</p>
      <div class="spend-preview">{xpSpentOnClue} XP → {clueReduction} Insight</div>
      <button class="btn btn-clue" on:click={spendAllOnClue}>
        Remember a Clue
      </button>
    </div>

    <PodDisplay selectable={false} />

  </div>
</div>

<style>
  .interlude {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-width: 800px;
    margin: 0 auto;
  }

  .header {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }

  h2 {
    margin: 0;
    font-size: 1.75rem;
    color: #83e8ff;
  }

  .ordeal-name {
    font-size: 0.9rem;
    color: #c9a0f5;
    font-style: italic;
  }

  .pool-bar {
    position: relative;
    height: 22px;
    background: #1a2a35;
    border-radius: 4px;
    overflow: hidden;
  }

  .pool-fill {
    height: 100%;
    background: linear-gradient(90deg, #e74c3c, #f39c12);
    transition: width 0.4s ease;
  }

  .pool-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.8rem;
    font-weight: bold;
    color: #fff;
    text-shadow: 0 1px 2px rgba(0,0,0,0.8);
    white-space: nowrap;
  }

  .round-info {
    font-size: 0.8rem;
    color: #888;
  }

  .resources {
    display: flex;
    gap: 2rem;
    justify-content: center;
    background: #16213e;
    border-radius: 8px;
    padding: 0.75rem 1.5rem;
  }

  .resource {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
  }

  .resource-label {
    font-size: 0.7rem;
    text-transform: uppercase;
    color: #888;
    letter-spacing: 0.05em;
  }

  .resource-value {
    font-size: 1.25rem;
    font-weight: bold;
  }

  .resource-value.xp      { color: #f1c40f; }
  .resource-value.stamina { color: #2ecc71; }
  .resource-value.treasure { color: #9b59b6; }

  .options {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  @media (max-width: 560px) {
    .options {
      grid-template-columns: 1fr;
    }
  }

  .option-card {
    background: #16213e;
    border: 2px solid #333;
    border-radius: 10px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }

  .option-header {
    font-size: 1.2rem;
    font-weight: bold;
    text-align: center;
  }

  .option-header.clue      { color: #e74c3c; }
  .option-header.home      { color: #2ecc71; }
  .option-header.technique { color: #3498db; }
  .option-header.treasure  { color: #9b59b6; }

  .option-card:has(.option-header.clue)      { border-color: #5a1010; }
  .option-card:has(.option-header.home)      { border-color: #0f4020; }
  .option-card:has(.option-header.technique) { border-color: #0f2a45; }
  .option-card:has(.option-header.treasure)  { border-color: #2a1040; }

  .option-desc {
    font-size: 0.8rem;
    color: #aaa;
    margin: 0;
    line-height: 1.4;
    flex: 1;
  }

  .spend-preview {
    font-size: 1rem;
    color: #ccc;
    text-align: center;
  }

  .btn {
    padding: 0.6rem 1rem;
    border: none;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    margin-top: auto;
  }

  .btn:hover { transform: translateY(-1px); }

  .btn-clue      { background: #8b1a1a; color: #fff; }
  .btn-clue:hover { background: #a52020; }

  .btn-home      { background: #1a6b3a; color: #fff; }
  .btn-home:hover { background: #22884a; }

  .btn-technique { background: #1a4a7a; color: #fff; }
  .btn-technique:hover { background: #225a96; }

  .btn-treasure  { background: #4a1a7a; color: #fff; }
  .btn-treasure:hover { background: #5c2295; }
</style>
