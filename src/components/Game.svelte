<script>
  import Grid from "./Grid.svelte";
  import Tiles from "./Tiles.svelte";
  import { onMount } from "svelte";
  import { debounce } from "throttle-debounce";
  import {
    getRandomInt,
  } from "../scripts/utils.js";
  export let score = 0;
  export let highest = 0;
  export let gameover = false;
  export let won = false;
  let loaded = false;
  let uuid = 0;
  let elementMap = [];
  let tiles = [];

  onMount(() => {
    startGame();
  });

  export let startGame = () => {
    init();
  };

  let isGameover = () => {
    if (!gameover) {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          let el = elementMap[i][j];
          let elv = elementMap[i + 1][j];
          let elh = elementMap[i][j + 1];
          if (!el || !elv || !elh) return false;
          else if (el.v === elv.v || el.v === elh.v) {
            return false;
          }
        }
      }
    }
    return true;
  };

  let move = direction => {
    let tls,
      vertical = false;
    switch (direction) {
      case "ArrowDown":
        vertical = true;
        tls = getCols(true);
        break;
      case "ArrowUp":
        vertical = true;
        tls = getCols();
        break;
      case "ArrowRight":
        tls = getRows(true);
        break;
      case "ArrowLeft":
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
            m = 3;
            n = -1;
            break;
          case "ArrowLeft":
          case "ArrowUp":
            m = 0;
            n = 1;
            break;
        }
        for (; m < 4 && m > -1; m += n) {
          let el, nel, mergedElPos;
          if (vertical) {
            el = elementMap[m][i];
            nel = elementMap[m + n] && elementMap[m + n][i];
            mergedElPos = { x: i, y: m };
          } else {
            el = elementMap[i][m];
            nel = elementMap[i][m + n];
            mergedElPos = { x: m, y: i };
          }
          if (el && tls[i][j].id === el.id) {
            break;
          }
          // debugger;
          if (
            !el ||
            (tls[i][j].v === el.v && !el.n && (!nel || nel.id === tls[i][j].id))
          ) {
            change = 1;
            let x = tls[i][j].x,
              y = tls[i][j].y;
            tls[i][j].x = vertical ? i : m;
            tls[i][j].y = vertical ? m : i;

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
    if (!gameover) {
      if (won) {
        won = false;
      }
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
      if (moved) {
        setTimeout(() => {
          insertNewTile();
          tiles = tiles;
        }, 300);
      } else {
        tiles = tiles;
      }
    }
  };

  let init = () => {
    highest = window.localStorage.highestScore || 0;
    tiles = [];
    if (window.localStorage.length && !loaded) {
      score = parseInt(window.localStorage.score);
      elementMap = JSON.parse(window.localStorage.elementMap);
      for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
          if(elementMap[i][j]) {
            tiles.push(elementMap[i][j]);
          }
        }
      }
      uuid = parseInt(window.localStorage.uuid);
    } else {
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
    }
    tiles = tiles;
    if (!loaded) loaded = true;
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
      score += val || 0;
      highest = score > highest ? score : highest;
      if (newTile.v === 2048) won = true;
    }
  };

  let afterUpdate = () => {
    if (elementMap && elementMap.length) {
      gameover = isGameover();
    }
  };
  $: {
    if (loaded) {
      window.localStorage.setItem("highestScore", highest);
      window.localStorage.setItem("score", score);
      window.localStorage.setItem("elementMap", JSON.stringify(elementMap));
      window.localStorage.setItem("uuid", uuid);
    }
  }
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
  .gameover,
  .won {
    display: flex;
    width: 550px;
    height: 550px;
    min-width: 550px;
    min-height: 550px;
    border-radius: 4px;
    z-index: 3;
    justify-content: center;
    align-items: center;
    grid-area: 1/1;
    transform: scale(0);
    background-color: var(--grid-bckgrnd-color);
    border: var(--grid-bckgrnd-color) solid var(--grid-gap);
    animation: scaleIn 250ms cubic-bezier(0.64, 0.57, 0.67, 1.53) 500ms;
    animation-fill-mode: forwards;
  }
  .won {
    opacity: 0.9;
  }
</style>

<svelte:options accessors={true} />
<svelte:window
  on:keydown={e => {
    e.preventDefault();
  }}
  on:keyup={debounce(10, true, handleKeypress)} />
<div id="game">

  <Grid />
  <Tiles on:afterUpdate={afterUpdate} {tiles} />
  {#if gameover}
    <div class="gameover">
      <h1>GAMEOVER</h1>
    </div>
  {/if}
  {#if won}
    <div class="won">
      <h1>You won!</h1>
    </div>
  {/if}
</div>
