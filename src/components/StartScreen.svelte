<script>
  import { startNewGame } from '../lib/gameState.js';
</script>

<div class="start-screen">

  <h1>Jacq's Quest</h1>

  <div class="how-to-play">
    <h3>How to Play</h3>
    <ul>
      <li>You have <strong>6 pods</strong>, each containing <strong>3 tokens</strong></li>
      <li>Each encounter, <strong>6 tokens</strong> are drawn randomly</li>
      <li>Tokens provide <strong>👁️ Insight</strong>, <strong>🛡️ Resolve</strong>, or <strong>⭐ XP</strong></li>
      <li>Match the encounter's <strong>mystery</strong> with <strong>insight</strong> to earn treasure and bonus XP</li>
      <li>Match the encounter's <strong>trouble</strong> with <strong>resolve</strong> to avoid losing stamina</li>
      <li>Spend XP in the pod shop to upgrade your pods</li>
      <li>Spend treasure in the item shop to upgrade your equipment</li>
      <li>For more details see <a class="docs-link" href="https://github.com/sitnaltax/jackpot-dungeon/blob/master/instructions.md" target="_blank" rel="noopener noreferrer">the instructions</a>
    </ul>
  </div>

  <button class="btn btn-start" on:click={startNewGame}>
    Start Game
  </button>

</div>

<style>
  .start-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    padding: 3rem;
    text-align: center;
    max-width: 700px;
    margin: 0 auto;
  }

  h1 {
    margin: 0;
    font-size: 3rem;
    line-height: 1;
    padding-bottom: 0.2em;
    background: linear-gradient(180deg, #ffffff 0%, #c8d0d8 50%, #7f8c9a 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: silver-glow 10s ease-in-out infinite;
  }
  @keyframes silver-glow {
    0%, 100% { filter: drop-shadow(0 0 4px rgba(180, 190, 200, 0.5)); }
    50%       { filter: drop-shadow(0 0 9px rgba(200, 210, 220, 0.8)) drop-shadow(0 0 18px rgba(127, 140, 154, 0.3)); }
  }

  .how-to-play {
    text-align: left;
    background: #16213e;
    padding: 1.5rem;
    border-radius: 12px;
    width: 100%;
  }

  .how-to-play h3 {
    margin: 0 0 1rem 0;
    color: #aaa;
    text-transform: uppercase;
    font-size: 0.875rem;
    letter-spacing: 0.05em;
  }

  .how-to-play ul {
    margin: 0;
    padding-left: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .how-to-play li {
    color: #ccc;
  }

  .btn-start {
    padding: 1rem 3rem;
    border: none;
    border-radius: 8px;
    font-size: 1.5rem;
    font-weight: bold;
    cursor: pointer;
    background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
    color: #000;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .btn-start:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(46, 204, 113, 0.4);
  }

  .docs-link {
    color: #00add8;
    text-decoration: none;
  }

  .docs-link:hover {
    color: #32cfff;
    text-decoration: underline;
  }

</style>
