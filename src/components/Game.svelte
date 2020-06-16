<script>
  import Grid from "./Grid.svelte";
  import Tiles from "./Tiles.svelte";
  import { onMount } from "svelte";
  import {
    forloop,
    getRandomInt,
    getCoordinatesFromPosition
  } from "../scripts/utils.js";
  export let score = 0;
  export let highest = 0;

  let positions;
  let elementMap;
  let tiles = [];

  onMount(() => {
    startGame();
  });

  let startGame = () => {
    init();
  };

  let moveVertical = direction => {
    let cols = getCols();
    console.log("COlumns", cols);
    for (let i = 0; i < tiles.length; i++) {
      shiftElementByDirection(direction, tiles[i], cols[tiles[i].x]);
    }
  };

  let moveHorizontal = direction => {
    let rows = getRows();
    console.log("ROWS", rows);
    for (let i = 0; i < tiles.length; i++) {
      shiftElementByDirection(direction, tiles[i], rows[tiles[i].y]);
    }
  };

  let handleKeypress = e => {
    switch (e.key) {
      case "ArrowDown":
        moveVertical("down");
        break;
      case "ArrowUp":
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
    }
    insertNewTile();
    serialize();
  };

  let init = () => {
    score = 0;
    positions = new Array(16).fill(true).map((e, i) => {
      return getCoordinatesFromPosition(i, 4, 4);
    });

    elementMap = [
      [{}, {}, {}, {}],
      [{}, {}, {}, {}],
      [{}, {}, {}, {}],
      [{}, {}, {}, {}]
    ];

    insertNewTile();
    insertNewTile();
    serialize();
  };

  let getRows = () => {
    let rows = [];
    rows.push(tiles.filter(e => e.y === 0));
    rows.push(tiles.filter(e => e.y === 1));
    rows.push(tiles.filter(e => e.y === 2));
    rows.push(tiles.filter(e => e.y === 3));
    return rows;
  };

  let getCols = () => {
    let cols = [];
    cols.push(tiles.filter(e => e.x === 0));
    cols.push(tiles.filter(e => e.x === 1));
    cols.push(tiles.filter(e => e.x === 2));
    cols.push(tiles.filter(e => e.x === 3));
    return cols;
  };

  let shiftElementByDirection = (dir, element, arr) => {
    let toBeDeleted = [];
    switch (dir) {
      case "right":
      case "down":
        toBeDeleted = forloop(arr, shiftOrJoin, true);
        break;
      case "left":
      case "up":
        toBeDeleted = forloop(arr, shiftOrJoin, false);
        break;
    }
    if (toBeDeleted.length) {
      insertNewTile(
        { x: toBeDeleted[0].x, y: toBeDeleted[1].y },
        toBeDeleted[0].v
      );
      tiles.splice(tiles.indexOf(toBeDeleted[0]), 1);
      tiles.splice(tiles.indexOf(toBeDeleted[1]), 1);
    }
  };

  let shiftOrJoin = (el, i, arr) => {
    console.log(el, i, arr);
    if (!arr[i].v || arr[i].v === el.v) {
      el.x = arr[i].x;
      el.y = arr[i].y;
    }
    if (arr[i].v === el.v) {
      return [el, arr[i]];
    }
    return [];
  };

  let serialize = () => {
    var t = [];
    for (var i = 0; i < elementMap.length; i++) {
      for (var j = 0; j < elementMap[i].length; j++) {
        if (elementMap[i][j].v) {
          t.push(elementMap[i][j]);
        }
      }
    }
    tiles = t;
  };

  let insertNewTile = (pos, val) => {
    let randomPos = pos || getRandomInt(0, positions.length - 1);
    let randomVal = val || getRandomInt(1, 2) * 2;

    let newTile = {
      x: (pos && pos.x) || positions[randomPos].x,
      y: (pos && pos.y) || positions[randomPos].y,
      v: randomVal
    };
    elementMap[positions[randomPos].y][positions[randomPos].x] = newTile;
    positions.splice(randomPos, 1);
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
