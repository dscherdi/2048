<script>

</script>

<style>
  #grid {
      border-radius: 4px;
    z-index: -1;
    background-color: var(--grid-bckgrnd-color);
    border: var(--grid-bckgrnd-color) solid var(--grid-gap);
  }
  .underlay-tile {
      border-radius: 4px;
      background-color: var(--underlay-tile-color);
  }
</style>

<div id="grid" class='grid-style'>
  {#each new Array(16) as r}
    <div class="underlay-tile" />
  {/each}
</div>
