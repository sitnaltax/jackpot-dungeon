<script>
  import { player, selectedPodToReplace, selectPodToReplace } from '../lib/gameState.js';
  import Pod from './Pod.svelte';

  export let selectable = false;
</script>

<div class="pod-display">
  <h3>Your Pods</h3>
  <div class="pods-grid">
    {#each $player.pods as pod (pod.id)}
      <Pod
        {pod}
        {selectable}
        selected={$selectedPodToReplace === pod.id}
        onSelect={selectable ? selectPodToReplace : null}
      />
    {/each}
  </div>
</div>

<style>
  .pod-display {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  h3 {
    margin: 0;
    font-size: 1rem;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .pods-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 1rem;
  }
</style>
