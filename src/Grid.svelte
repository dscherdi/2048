<script>
  import Tile from "./Tile.svelte";
  export let tiles = new Array(16);
</script>

<style>
  #gridContainer {
    display: flex;
    justify-content: center;
  }
  #grid {
    display: grid;
    grid-template-columns: 128px 128px 128px 128px;
    grid-template-rows: 128px 128px 128px 128px;
    grid-column-gap: 10px;
    grid-row-gap: 10px;
    justify-content: center;
    align-items: center;
    border: 10px black solid;
    padding: 10px;
  }
</style>

<div id="gridContainer">
  <div id="grid">
    {#each tiles as t}
      {#if t && t.value}
        <Tile value={t.value}></Tile>
      {:else}
        <Tile />
      {/if}
    {/each}

  </div>
</div>
