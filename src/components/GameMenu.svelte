<script>
  import { restartGame } from '../lib/gameState.js';

  let open = false;

  function toggle() { open = !open; }
  function close() { open = false; }

  function handleRestart() {
    close();
    restartGame();
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') close();
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="menu-wrapper">
  <button class="menu-btn" on:click={toggle} aria-label="Menu" aria-expanded={open}>
    ☰
  </button>

  {#if open}
    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
    <div class="backdrop" on:click={close}></div>

    <div class="dropdown" role="menu">
      <button class="menu-item action" on:click={handleRestart}>
        ↩ Restart Game
      </button>

      <hr class="divider" />

      <a
        class="menu-item"
        href="https://github.com/sitnaltax/jackpot-dungeon/"
        target="_blank"
        rel="noopener noreferrer"
        on:click={close}
      >
        ⌥ Repository
      </a>
      <a
        class="menu-item"
        href="https://github.com/sitnaltax/jackpot-dungeon/blob/master/instructions.md"
        target="_blank"
        rel="noopener noreferrer"
        on:click={close}
      >
        📖 Documentation
      </a>

      <hr class="divider" />

      <span class="menu-item disabled" title="Coming soon">🦋 Bluesky</span>
      <span class="menu-item disabled" title="Coming soon">💬 Discord</span>
    </div>
  {/if}
</div>

<style>
  .menu-wrapper {
    position: relative;
  }

  .menu-btn {
    background: none;
    border: none;
    color: #aaa;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    line-height: 1;
    transition: color 0.15s ease, background 0.15s ease;
  }

  .menu-btn:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.08);
  }

  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 10;
  }

  .dropdown {
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 0;
    z-index: 11;
    background: #1a2744;
    border: 1px solid #2c3e50;
    border-radius: 8px;
    padding: 0.5rem;
    min-width: 180px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .menu-item {
    display: block;
    padding: 0.5rem 0.75rem;
    border-radius: 5px;
    font-size: 0.95rem;
    text-decoration: none;
    color: #ccc;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    width: 100%;
    transition: background 0.15s ease, color 0.15s ease;
  }

  .menu-item:hover:not(.disabled) {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
  }

  .menu-item.action {
    color: #e74c3c;
  }

  .menu-item.action:hover {
    background: rgba(231, 76, 60, 0.15);
    color: #e74c3c;
  }

  .menu-item.disabled {
    color: #555;
    cursor: default;
  }

  .divider {
    border: none;
    border-top: 1px solid #2c3e50;
    margin: 0.25rem 0;
  }
</style>
