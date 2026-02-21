<script>
  import { selectClass } from '../lib/gameState.js';
  import { CLASS_LIST } from '../lib/classes.js';
</script>

<div class="class-select">
  <h1>Choose Your Class</h1>
  <p class="subtitle">Each class brings unique abilities and starting gear.</p>

  <div class="class-cards">
    {#each CLASS_LIST as cls}
      <button class="class-card" on:click={() => selectClass(cls.id)}>
        <h2>{cls.name}</h2>
        <p class="class-desc">{cls.description}</p>

        <div class="class-benefit">
          <span class="benefit-label">Passive</span>
          <span class="benefit-value">{cls.benefitDescription}</span>
        </div>

        <div class="class-items">
          <span class="items-label">Starting Gear</span>
          <div class="item-icons">
            {#each cls.startingEquipment as item}
              {#if item}
                <span class="item-icon" title="{item.name}: {item.description}">
                  {item.icon}
                </span>
              {/if}
            {/each}
            {#if !cls.startingEquipment.some(i => i)}
              <span class="no-items">None</span>
            {/if}
          </div>
        </div>

        {#if cls.startingTreasureBonus > 0 || cls.startingXpBonus > 0}
          <div class="class-bonuses">
            {#if cls.startingTreasureBonus > 0}
              <span class="bonus-tag treasure">+${cls.startingTreasureBonus} Treasure</span>
            {/if}
            {#if cls.startingXpBonus > 0}
              <span class="bonus-tag xp">+{cls.startingXpBonus} XP</span>
            {/if}
          </div>
        {/if}
      </button>
    {/each}
  </div>
</div>

<style>
  .class-select {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 2rem;
    text-align: center;
    max-width: 900px;
    margin: 0 auto;
  }

  h1 {
    margin: 0;
    font-size: 2.5rem;
    background: linear-gradient(135deg, #f1c40f 0%, #e74c3c 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .subtitle {
    margin: 0;
    color: #888;
    font-size: 1rem;
  }

  .class-cards {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .class-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 1.5rem;
    background: #16213e;
    border: 2px solid #2c3e50;
    border-radius: 12px;
    width: 250px;
    cursor: pointer;
    transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    color: #ccc;
    font-family: inherit;
    text-align: center;
  }

  .class-card:hover {
    transform: translateY(-4px);
    border-color: #f1c40f;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }

  .class-card h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #fff;
  }

  .class-desc {
    margin: 0;
    font-size: 0.875rem;
    color: #888;
    line-height: 1.4;
  }

  .class-benefit {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.75rem;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    width: 100%;
  }

  .benefit-label {
    font-size: 0.7rem;
    text-transform: uppercase;
    color: #666;
    letter-spacing: 0.05em;
  }

  .benefit-value {
    font-size: 0.85rem;
    color: #2ecc71;
    font-weight: bold;
  }

  .class-items {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    width: 100%;
  }

  .items-label {
    font-size: 0.7rem;
    text-transform: uppercase;
    color: #666;
    letter-spacing: 0.05em;
  }

  .item-icons {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }

  .item-icon {
    font-size: 1.5rem;
    background: #2c3e50;
    border: 1px solid #4a6785;
    border-radius: 6px;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .no-items {
    font-size: 0.8rem;
    color: #555;
    font-style: italic;
  }

  .class-bonuses {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .bonus-tag {
    font-size: 0.75rem;
    font-weight: bold;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
  }

  .bonus-tag.treasure {
    background: rgba(241, 196, 15, 0.2);
    color: #f1c40f;
  }

  .bonus-tag.xp {
    background: rgba(155, 89, 182, 0.2);
    color: #9b59b6;
  }
</style>
