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

  let getCols = inverse => {
    let cols = [];
    cols.push(tiles.filter(el => !el.m && el.v && el.x === 0));
    cols.push(tiles.filter(el => !el.m && el.v && el.x === 1));
    cols.push(tiles.filter(el => !el.m && el.v && el.x === 2));
    cols.push(tiles.filter(el => !el.m && el.v && el.x === 3));
    let cmp = (a, b) => {
      return b.y - a.y;
    };
    if (inverse) {
      cols[0] = cols[0].sort(cmp);
      cols[1] = cols[1].sort(cmp);
      cols[2] = cols[2].sort(cmp);
      cols[3] = cols[3].sort(cmp);
    }
    return cols;
  };

  let moveVertical = async direction => {
    let cols;
    switch (direction) {
      case "down":
        cols = getCols(true);
        break;
      case "up":
        cols = getCols();
        break;
    }
    // debugger;
    let m, n;
    for (let i = 0; i < cols.length; i++) {
      for (let j = 0; j < cols[i].length; j++) {
        switch (direction) {
          case "down":
            m = 3;
            n = -1;
            break;
          case "up":
            m = 0;
            n = 1;
            break;
        }
        for (; m < 4 && m > -1; m += n) {
          console.log(i, j, m, cols[i][j], elementMap[m][i]);
          if (cols[i][j].y === m) break;
          if (cols[i][j].id !== elementMap[m][i][0].id) {
            if (
              !elementMap[m][i].v ||
              (cols[i][j].v === elementMap[m][i][0].v && !elementMap[m][i].n)
            ) {
              let merged = false;
              let x = cols[i][j].x,
                y = cols[i][j].y;
              cols[i][j].x = i;
              cols[i][j].y = m;
              if (cols[i][j].v === elementMap[m][i][0].v) {
                merged = true;
                cols[i][j].m = true;
                elementMap[m][i][0].m = true;
              }

              elementMap[m][i].unshift(elementMap[y][x].shift());

              if (merged) {
                insertNewTile({ x: i, y: m }, 2 * cols[i][j].v);
              }
              break;
            }
          }
        }
      }
    }
  };

  let getRows = inverse => {
    let rows = [];
    rows.push(tiles.filter(el => !el.m && el.v && el.y === 0));
    rows.push(tiles.filter(el => !el.m && el.v && el.y === 1));
    rows.push(tiles.filter(el => !el.m && el.v && el.y === 2));
    rows.push(tiles.filter(el => !el.m && el.v && el.y === 3));
    let cmp = (a, b) => {
      return b.x - a.x;
    };
    if (inverse) {
      rows[0] = rows[0].sort(cmp);
      rows[1] = rows[1].sort(cmp);
      rows[2] = rows[2].sort(cmp);
      rows[3] = rows[3].sort(cmp);
    }
    return rows;
  };

  let moveHorizontal = async direction => {
    let rows;
    switch (direction) {
      case "right":
        rows = getRows(true);
        break;
      case "left":
        rows = getRows();
        break;
    }
    let m, n;
    for (let i = 0; i < rows.length; i++) {
      for (let j = 0; j < rows[i].length; j++) {
        switch (direction) {
          case "right":
            m = 3;
            n = -1;
            break;
          case "left":
            m = 0;
            n = 1;
            break;
        }
        for (; m < 4 && m > -1; m += n) {
          rows[i][j].n = false;
          if (rows[i][j].x === m) break;

          if (rows[i][j].id !== elementMap[i][m][0].id) {
            if (
              !elementMap[i][m][0].v ||
              (rows[i][j].v === elementMap[i][m][0].v && !elementMap[i][m][0].n)
            ) {
              console.log(i, j, m, rows[i][j], elementMap[i][m]);
              let merged = false;
              let x = rows[i][j].x,
                y = rows[i][j].y;
              rows[i][j].x = m;
              rows[i][j].y = i;
              if (rows[i][j].v === elementMap[i][m][0].v) {
                merged = true;
                rows[i][j].m = true;
                elementMap[i][m][0].m = true;
              }

              elementMap[i][m].unshift(elementMap[y][x].shift());

              if (merged) {
                insertNewTile({ x: m, y: i }, 2 * rows[i][j].v);
              }
              break;
            }
          }
        }
      }
    }
  };

  let handleKeypress = async e => {
    e.preventDefault();

    let moved = false;
    let vertical = false;
    switch (e.key) {
      case "ArrowDown":
        vertical = true;
        moveVertical("down");
        moved = true;
        break;
      case "ArrowUp":
        vertical = true;
        moveVertical("up");
        moved = true;
        break;
      case "ArrowLeft":
        moveHorizontal("left");
        moved = true;
        break;
      case "ArrowRight":
        moveHorizontal("right");
        moved = true;
        break;
      default:
        break;
    }
    if (moved) {
      // setTimeout(insertNewTile, 200);
      tiles = tiles;
      console.log(tiles);
    }
  };

  let init = () => {
    score = 0;
    elementMap = [];
    tiles = [];
    for (var i = 0; i < 4; i++) {
      elementMap[i] = [];
      for (var j = 0; j < 4; j++) {
        elementMap[i][j] = [{ id: ++uuid, x: j, y: i }];
      }
    }
    insertNewTile();
    insertNewTile();
    insertNewTile();
    insertNewTile();
    tiles = tiles;
    // update();
  };

  let getFreePositions = () => {
    let positions = [];
    for (var i = 0; i < elementMap.length; i++) {
      for (var j = 0; j < elementMap[i].length; j++) {
        if (!elementMap[i][j][0].v) {
          positions.push({ x: j, y: i });
        }
      }
    }
    return positions;
  };

  let clearMerged = () => {
    if (elementMap) {
      for (let i = 0; i < elementMap.length; i++) {
        for (let j = 0; j < elementMap[i].length; j++) {
          for (let k = 0; k < elementMap[i][j].length; k++) {
            if (elementMap[i][j][k].m) {
              elementMap[i][j].splice(k, 1);
            }
          }
        }
      }
      let i = 0;
      while (i < tiles.length) {
        if (tile[i].n) tiles[i].n = false;
        if (tiles[i].m) {
          tiles.splice(i, 1);
        } else {
          i++;
        }
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
      elementMap[y][x].unshift(newTile);
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
  <Tiles on:afterUpdate={() => {}} {tiles} />

</div>
