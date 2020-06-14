<script>
  export let tiles = new Array(16).fill({}).map((e, i) => {
    return { posX: 0, posY: 0, el: i };
  });
</script>

<style>
  #tiles {
    border-radius: 4px;
    border: transparent solid var(--grid-gap);
  }
  .tile {
    --pos-x: 0;
    --pos-y: 0;

    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 40px;
    font-weight: bold;
    border-radius: 4px;
    background-color: #777777;
    grid-area: 1/1;
    transition: var(--main-transition);
    transform: translate(
      calc(var(--pos-x) * 100% + var(--pos-x) * var(--grid-gap)),
      calc(var(--pos-y) * 100% + var(--pos-y) * var(--grid-gap))
    );
  }
</style>

<div id="tiles" class="grid-style">
  {#each tiles as t}
    <div class="tile" style="--pos-x: {t.posX}; --pos-y: {t.posY}">{t.el}</div>
  {/each}
</div>
