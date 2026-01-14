<script>
  import { startNewGame } from '../lib/gameState.js';
</script>

<div class="start-screen">
  <h1>WyldDive</h1>

  <p class="tagline">
    Draw your fate. Build your fortune. Venture ever deeper.
  </p>

  <div class="how-to-play">
    <h3>How to Play</h3>
    <ul>
      <li>You have <strong>6 pods</strong>, each containing <strong>3 tokens</strong></li>
      <li>Each encounter, <strong>6 tokens</strong> are drawn randomly</li>
      <li>Tokens provide <strong>👁️ Insight</strong>, <strong>💭 Composure</strong>, or <strong>💰 Treasure</strong></li>
      <li>Match the fey's <strong>mystery</strong> to reveal their nature and earn bonus treasure</li>
      <li>Match the fey's <strong>bewilderment</strong> to avoid losing stamina</li>
      <li>Spend treasure in the shop to upgrade your pods</li>
      <li>Dive as deep as you can!</li>
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
    max-width: 600px;
    margin: 0 auto;
  }

  h1 {
    margin: 0;
    font-size: 3rem;
    background: linear-gradient(135deg, #f1c40f 0%, #e74c3c 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .tagline {
    font-size: 1.25rem;
    color: #888;
    margin: 0;
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
    color: #888;
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
</style>
