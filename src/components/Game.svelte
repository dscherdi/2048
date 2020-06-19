<script>
  import Grid from "./Grid.svelte";
  import Tiles from "./Tiles.svelte";
  import { onMount } from "svelte";
  import { debounce } from "throttle-debounce";
  import { tick } from "svelte";
  import {
    forloop,
    getRandomInt,
    getCoordinatesFromPosition,
    getPositionFromCoordinates
  } from "../scripts/utils.js";
  export let score = 0;
  export let highest = 0;
  export let gameover = false;
  let uuid = 0;
  let elementMap = [];
  let tiles = [];
  let join = [];
  onMount(() => {
    startGame();
  });

  let startGame = () => {
    init();
  };

  let move = direction => {
    let tls,
      vertical = false;
      console.log(direction);
    switch (direction) {
      case "ArrowDown":
        vertical = true;
        tls = getCols(true);
        console.log("gotcoldown");
        break;
      case "ArrowUp":
        vertical = true;
        tls = getCols();
        console.log("gotcolup");
        break;
      case "ArrowRight":
        
        console.log("gotrowright");
        tls = getRows(true);
        break;
      case "ArrowLeft":
        console.log("gotrowleft");
        tls = getRows();
        break;
    }
    // console.log(cols, elementMap);
    // debugger;
    let m,
      n,
      change = 0;
    for (let i = 0; i < tls.length; i++) {
      for (let j = 0; j < tls[i].length; j++) {
        switch (direction) {
          case "ArrowRight":
          case "ArrowDown":
            console.log("inverse");
            m = 3;
            n = -1;
            break;
          case "ArrowLeft":
          case "ArrowUp":
            console.log("notinverse");
            m = 0;
            n = 1;
            break;
        }
        for (; m < 4 && m > -1; m += n) {
          let el, mergedElPos;
          if (vertical) {
            mergedElPos = { x: i, y: m };
            el = elementMap[m][i];
            console.log("vertical");
          } else {
            mergedElPos = { x: m, y: i };
            el = elementMap[i][m];
            console.log("horizontal");
          }
          console.log(tls, tls[i][j], el);
          if (el && tls[i][j].id === el.id) {
            break;
          }
          if (!el || (tls[i][j].v === el.v && !el.n)) {
            change = 1;
            let x = tls[i][j].x,
              y = tls[i][j].y;
            tls[i][j].x = i;
            tls[i][j].y = m;

            elementMap[y][x] = false;
            if (el && tls[i][j].v === el.v) {
              tls[i][j].m = true;
              el.m = true;
              if (vertical) {
                elementMap[m][i] = false;
              } else {
                elementMap[i][m] = false;
              }
              insertNewTile(mergedElPos, 2 * tls[i][j].v);
            } else {
              if (vertical) {
                elementMap[m][i] = tls[i][j];
              } else {
                elementMap[i][m] = tls[i][j];
              }
            }
            break;
          }
        }
      }
    }
    return change;
  };

  let getCols = inverse => {
    let cols = [];
    cols.push(tiles.filter(el => !el.m && el.v && el.x === 0));
    cols.push(tiles.filter(el => !el.m && el.v && el.x === 1));
    cols.push(tiles.filter(el => !el.m && el.v && el.x === 2));
    cols.push(tiles.filter(el => !el.m && el.v && el.x === 3));
    let cmpDescending = (a, b) => {
      return b.y - a.y;
    };
    let cmpAscending = (a, b) => {
      return a.y - b.y;
    };
    let cmp = inverse ? cmpDescending : cmpAscending;
    cols[0] = cols[0].sort(cmp);
    cols[1] = cols[1].sort(cmp);
    cols[2] = cols[2].sort(cmp);
    cols[3] = cols[3].sort(cmp);
    return cols;
  };

  let getRows = inverse => {
    let rows = [];
    rows.push(tiles.filter(el => !el.m && el.v && el.y === 0));
    rows.push(tiles.filter(el => !el.m && el.v && el.y === 1));
    rows.push(tiles.filter(el => !el.m && el.v && el.y === 2));
    rows.push(tiles.filter(el => !el.m && el.v && el.y === 3));
    let cmpDescending = (a, b) => {
      return b.x - a.x;
    };
    let cmpAscending = (a, b) => {
      return a.x - b.x;
    };
    let cmp = inverse ? cmpDescending : cmpAscending;
    rows[0] = rows[0].sort(cmp);
    rows[1] = rows[1].sort(cmp);
    rows[2] = rows[2].sort(cmp);
    rows[3] = rows[3].sort(cmp);
    return rows;
  };

  let handleKeypress = async e => {
    e.preventDefault();
    clearMerged();
    let moved = 0;
    let vertical = false;
    switch (e.key) {
      case "ArrowDown":
      case "ArrowUp":
      case "ArrowLeft":
      case "ArrowRight":
        moved = move(e.key);
        break;
      default:
        break;
    }
    console.log(moved);
    switch (moved) {
      case 1:
        // setTimeout(insertNewTile, 200);
      case 0:
        tiles = tiles;
        break;
      case -1:
        gameover = true;
        break;
    }
  };

  let init = () => {
    score = 0;
    gameover = false;
    elementMap = [];
    tiles = [];
    for (var i = 0; i < 4; i++) {
      elementMap[i] = [];
      for (var j = 0; j < 4; j++) {
        elementMap[i][j] = false;
      }
    }
    insertNewTile();
    insertNewTile();
    // insertNewTile();
    // insertNewTile();
    tiles = tiles;
    // update();
  };

  let getFreePositions = () => {
    let positions = [];
    for (var i = 0; i < elementMap.length; i++) {
      for (var j = 0; j < elementMap[i].length; j++) {
        if (!elementMap[i][j]) {
          positions.push({ x: j, y: i });
        }
      }
    }
    return positions;
  };

  let clearMerged = () => {
    let i = 0;
    while (i < tiles.length) {
      if (tiles[i].n) tiles[i].n = false;
      if (tiles[i].m) {
        tiles.splice(i, 1);
      } else {
        i++;
      }
    }
  };

  let insertNewTile = (pos, val) => {
    let positions = getFreePositions();
    if (positions.length) {
      let randomPos = pos || getRandomInt(0, positions.length - 1);
      let randomVal = val || getRandomInt(1, 2) * 2;
      let x = pos ? pos.x : positions[randomPos].x;
      let y = pos ? pos.y : positions[randomPos].y;

      let newTile = { id: ++uuid, x: x, y: y, v: randomVal, n: true };
      elementMap[y][x] = newTile;
      tiles.push(newTile);
    }
  };
</script>

<style>
  #game {
    display: grid;
    margin: auto;
    margin-top: 25px;

    width: 300px;
    height: 300px;
    min-width: 300px;
    min-height: 300px;
  }
</style>

<svelte:window
  on:keydown={e => {
    e.preventDefault();
  }}
  on:keyup={debounce(150, true, handleKeypress)} />
<div id="game">

  <Grid />
  <Tiles {tiles} />

</div>
