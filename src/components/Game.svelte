<script>
  import Grid from "./Grid.svelte";
  import Tiles from "./Tiles.svelte";
  import { onMount } from "svelte";
  export let score = 0;
  export let highest = 0;

  let positions;
  let tiles = [];

  onMount(() => {
    startGame();
  });

  let startGame = () => {
    init();
  };

  let moveVertical = direction => {
    switch (direction) {
      case "down":
        break;
      case "up":
        break;
    }
  };

  let moveHorizontal = direction => {
    switch (direction) {
      case "left":
        break;
      case "right":
        break;
    }
  };

  let handleKeypress = e => {
    switch (e.key) {
      case "ArrowDown":
        moveVertical("down");
        break;
      case "ArrowTop":
        moveVertical("up");
        break;
      case "ArrowLeft":
        moveHorizontal("left");
        break;
      case "ArrowRight":
        moveHorizontal("right");
        break;
      default:
        break;
      insertNewTile();
    }
  };

  let init = () => {
    score = 0;
    positions = [
      new Array(4).fill({}).map(e => {return {
        free: true
      }}),
      new Array(4).fill({}).map(e => { return {
        free: true
      }}),
      new Array(4).fill({}).map(e => {return {
        free: true
      }}),
      new Array(4).fill({}).map(e =>{return  {
        free: true
      }})
    ];
    tiles = [];
    insertNewTile();
    insertNewTile();
  };

  let getFreePositions = () => {
    let fp = [];
    positions.forEach((row, rowIndex) => {
      row.forEach((element, colIndex) => {
        if (element.free) {
          fp.push({ posX: colIndex, posY: rowIndex });
        }
      });
    });
    return fp;
  };
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
  let insertNewTile = () => {
    let randomVal = (getRandomInt(2) + 1) * 2;
    console.log(randomVal);
    let freePositions = getFreePositions();
    let randomPos =getRandomInt(freePositions.length);
    

    let newTile = {
      posX: freePositions[randomPos].posX,
      posY: freePositions[randomPos].posY,
      val: randomVal
    };
    tiles.push(newTile);
  };
</script>

<style>
  #game {
    display: grid;
    margin: auto;
    margin-top: 25px;
    
    width: 550px;
    height: 550px;
    min-width: 550px;
    min-height: 550px;
  }
</style>

<svelte:window on:keyup={handleKeypress} />
<div id="game">

  <Grid />
  <Tiles {tiles} />

</div>
