<script>
  import { elasticOut } from "svelte/easing";
  export let tiles;
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
    animation: newtile 250ms  cubic-bezier(0.64, 0.57, 0.67, 1.53);
  }


  @keyframes newtile {
    from {
      transform: scale(0);
    }
    to {
      transform: scale(1);
    }
  }

  .merged-tile {
    z-index: 1;
    /* opacity: 0; */
  }
  
</style>

<div id="tiles" class="grid-style">
  {#each tiles.filter(t => t.v !== undefined) || [] as t (t.id)}
      <div class="tile {t.n ? 'new-tile' : ''}  {t.m ? 'merged-tile' : ''}" style="--pos-x: {t.x}; --pos-y: {t.y}">
        {t.v}
      </div>
  {/each}
</div>
