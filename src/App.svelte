<script>
  import { gamePhase, PHASES } from './lib/gameState.js';

  import StartScreen from './components/StartScreen.svelte';
  import PlayerStatus from './components/PlayerStatus.svelte';
  import Encounter from './components/Encounter.svelte';
  import TokenDraw from './components/TokenDraw.svelte';
  import CombatResult from './components/CombatResult.svelte';
  import PodDisplay from './components/PodDisplay.svelte';
  import Shop from './components/Shop.svelte';
  import GameOver from './components/GameOver.svelte';
</script>

<main>
  {#if $gamePhase === PHASES.START}
    <StartScreen />
  {:else if $gamePhase === PHASES.GAME_OVER}
    <GameOver />
  {:else}
    <div class="game-container">
      <PlayerStatus />

      {#if $gamePhase === PHASES.DRAW}
        <div class="encounter-section">
          <Encounter />
        </div>
        <div class="draw-section">
          <TokenDraw />
        </div>
        <div class="pods-section">
          <PodDisplay />
        </div>
      {:else if $gamePhase === PHASES.COMBAT}
        <div class="encounter-section">
          <Encounter />
        </div>
        <div class="combat-section">
          <CombatResult />
        </div>
      {:else if $gamePhase === PHASES.SHOP}
        <Shop />
      {/if}
    </div>
  {/if}
</main>

<style>
  :global(body) {
    padding: 1rem;
  }

  main {
    max-width: 1000px;
    margin: 0 auto;
  }

  .game-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .encounter-section {
    display: flex;
    justify-content: center;
  }

  .draw-section {
    background: #16213e;
    border-radius: 12px;
    padding: 1.5rem;
  }

  .combat-section {
    display: flex;
    justify-content: center;
  }

  .pods-section {
    background: #0d1117;
    border-radius: 12px;
    padding: 1.5rem;
  }
</style>
