<script>
  import Tile from "./Tile.svelte";
  import { onMount } from "svelte";
  import { getRandomInt } from "./Utils.svelte";
  let score;
  let tiles = [];
  let freePositions = [];
  const keyCodes = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
  };
  let uid = 0;

  onMount(() => {
    initTiles();
  });

  const initTiles = () => {
    freePositions = [];
    tiles = [[], [], [], []].map((el, i) => {
      return [{}, {}, {}, {}].map((e, j) => {
        freePositions.push({ col: i, row: j });
        return {
          id: uid++,
          v: undefined,
          cp: { row: j, col: i }
        };
      });
    });
  };

  const clearTiles = () => {
    freePositions = [];
    tiles.forEach((r, i) => {
      r.forEach((c, j) => {
        c.v = undefined;
        freePositions.push({ col: j, row: i });
      });
    });
  };

  const putNewTile = () => {
    if (freePositions.length > 0) {
      let newPos;
      newPos = freePositions.splice(
        getRandomInt(0, freePositions.length - 1),
        1
      )[0];
      if (newPos) {
        tiles[newPos.row][newPos.col] = {
          id: uid++,
          v: getRandomInt(1, 2) * 2,
          cp: { row: newPos.col, col: newPos.row }
        };
        return true;
      }
    }
    return false;
  };

  const getColumns = () => {
    let cols = [];
    tiles.forEach((r, i) => {
      let col = [];
      r.forEach((c, j) => {
        if (tiles[j][i].v) {
          col.push(tiles[j][i]);
        }
      });
      cols.push(col);
    });
    return cols;
  };

  const getRows = () => {
    let rows = [];
    tiles.forEach((r, i) => {
      let row = [];
      r.forEach((c, j) => {
        if (tiles[i][j].v) {
          row.push(tiles[i][j]);
        }
      });
      rows.push(row);
    });
    return rows;
  };

  const joinSameValuePair = arr => {
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i].v === arr[i + 1].v) {
        arr[i] = arr[i + 1];
        arr[i].v *= 2;
        arr.splice(i + 1, 1);
        break;
      }
    }
  };

  const addEmptyTiles = (arr, reverse) => {
    let l = arr.length;
    for (let i = 0; i < 4 - l; i++) {
      if (reverse) {
        arr.unshift({ id: uid++ });
      } else {
        arr.push({ id: uid++ });
      }
    }
  };

  const moveTilesVertically = down => {
    let columns = getColumns();
    for (let i = 0; i < columns.length; i++) {
      let col = columns[i];

      joinSameValuePair(col);
      addEmptyTiles(col, down);

      // change view
      for (var j = 0; j < col.length; j++) {
        tiles[j][i] = col[j];
      }
    }
  };

  const moveTilesHorizontally = right => {
    let rows = getRows();
    for (let i = 0; i < rows.length; i++) {
      let row = rows[i];

      joinSameValuePair(row);
      addEmptyTiles(row, right);

      // change view
      tiles[i] = row;
    }
  };

  const handleKeyDown = e => {
    if (keyCodes[e.keyCode]) {
      let down = false, right =false;
      switch (keyCodes[e.keyCode]) {
        case "right":
          right = true;
        case "left":
          moveTilesHorizontally(right);
          break;
        case "down":
          down = true;
        case "up":
          moveTilesVertically(down);
          break;
        default:
          break;
      }
    }
  };

  export const newGame = () => {
    score = 0;
    clearTiles();
    putNewTile();
    putNewTile();
  };
</script>

<style>
  #gridContainer {
    display: flex;
    justify-content: center;
  }

  #grid {
    border: 10px black solid;
  }
  .tileRow {
    display: grid;
    grid-template-columns: 128px 128px 128px 128px;
    grid-template-rows: 128px;
    grid-column-gap: 10px;
    grid-row-gap: 10px;
    justify-content: center;
    align-items: center;
    padding: 10px;
  }
</style>

<svelte:window on:keyup={handleKeyDown} />
<div id="gridContainer">
  <div id="grid">
    {#each tiles as tileRow}
      <div class:tileRow>
        {#each tileRow as t, id (t.id)}
          {#if t && t.v}
            <Tile value={t.v} />
          {:else}
            <Tile />
          {/if}
        {/each}
      </div>
    {/each}
  </div>
</div>
