<script>
  import { elasticOut } from "svelte/easing";
  export let tiles;

  let colors = {
    2: '#006064',
    4: '#004D40',
    8: '#1B5E20',
    16: '#33691E',
    32: '#827717',
    64: '#F57F17',
    128: '#BF360C',
    256: '#3E2723',
    512: '#4A148C',
    1024: '#311B92',
    2048: '#880E4F',
    4096: '#B71C1C',
    8192: '#1A237E'
  };

</script>

<style>
  #tiles {
    border-radius: 4px;
    border: transparent solid var(--grid-gap);
  }
  .tile {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
     font-size: calc(17px + (30 - 17) * ((100vw - 320px) / (1600 - 300)));
    font-weight: bold;
    border-radius: 4px;
    grid-area: 1/1;
    z-index: 2;
    transition: var(--main-transition);
    left:  calc(var(--pos-x) * 100% + var(--pos-x) * var(--grid-gap));
    top: calc(var(--pos-y) * 100% + var(--pos-y) * var(--grid-gap));
  }
  .new-tile {
    animation: scaleIn 250ms  cubic-bezier(0.64, 0.57, 0.67, 1.53);
    animation-fill-mode: forwards;
  }

  .merged-tile {
    z-index: 1;
    /* opacity: 0; */
  }
  
</style>

<div id="tiles" class="grid-style">
  {#each tiles.filter(t => t.v !== undefined) || [] as t (t.id)}
      <div class="tile {t.n ? 'new-tile' : ''}  {t.m ? 'merged-tile' : ''}" style="--pos-x: {t.x}; --pos-y: {t.y}; background-color: {colors[t.v] || 'black'};">
        {t.v}
      </div>
  {/each}
</div>
