<script>
  import { elasticOut } from "svelte/easing";
  import {createEventDispatcher, afterUpdate} from "svelte";
  export let tiles;

  let dispatch = createEventDispatcher();

  afterUpdate(() => {
    dispatch('afterUpdate');
  }); 

  let colors = {
    2: '#777777',
    4: '#555555',
    8: '#333333',
    16: '#676767',
    32: '#B2BEB5',
    64: '#708090',
    128: '#7A7371',
    256: '#B4AB9C',
    512: '#2D3436',
    1024: '#111111',
    2048: '#1F262A',
    4096: '#78866B',
    8192: '#687169'
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
    font-size: 40px;
    font-weight: bold;
    border-radius: 4px;
    background-color: #777777;
    grid-area: 1/1;
    z-index: 2;
    transition: var(--main-transition);
    left:  calc(var(--pos-x) * 100% + var(--pos-x) * var(--grid-gap));
    top: calc(var(--pos-y) * 100% + var(--pos-y) * var(--grid-gap));
  }
  .new-tile {
    animation: scaleIn 250ms  cubic-bezier(0.64, 0.57, 0.67, 1.53);
  }

  .merged-tile {
    z-index: 1;
    /* opacity: 0; */
  }
  
</style>

<div id="tiles" class="grid-style">
  {#each tiles.filter(t => t.v !== undefined) || [] as t (t.id)}
      <div class="tile {t.n ? 'new-tile' : ''}  {t.m ? 'merged-tile' : ''}" style="--pos-x: {t.x}; --pos-y: {t.y}; background-color: {colors[t.v] || 'black'}">
        {t.v}
      </div>
  {/each}
</div>
