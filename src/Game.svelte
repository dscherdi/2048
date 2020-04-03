<script>
  import Grid from "./Grid.svelte";
  import Tile from "./Tile.svelte";
  import { getRandomInt } from "./Utils.svelte";

  export let score;
  export let best;

  let tiles = new Array(16).fill({ value: null });

  const putNewTile = () => {
    let freePositions = getFreePositions();
    if (freePositions.length > 0) {
      let newPos;
      newPos = getRandomInt(0, freePositions.length - 1);
      tiles[newPos] = {value:getRandomInt(1,2) * 2};
    }
  };
  const getFreePositions = () => {
    let free = [];
    tiles.forEach((element, index) => {
      if (element.value === null) free.push(index);
    });
    return free;
  };
  const handleKeyDown = e => {
    console.log("keypress");
  };
  const newGame = () => {
    score = 0;
    tiles.forEach(element => (element.value = null));
    putNewTile();
    putNewTile();
    // tiles = tiles;
  };
</script>

<style>
  #topOfGame,
  #instructions {
    display: flex;
    justify-content: center;
  }
</style>

<svelte:window on:keydown={handleKeyDown} />
<div>

  <div id="topOfGame">

    <button on:click={newGame}>New Game</button>

  </div>
  <Grid tiles={tiles} />
  <div id="instructions" />
</div>
