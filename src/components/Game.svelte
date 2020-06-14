<script>
  import { onMount, tick } from "svelte";
  import { getRandomInt } from "../scripts/utils.js";
  import { slide } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { quintOut } from "svelte/easing";
  import { crossfade } from "svelte/transition";
  import { getCoordinatesFromPosition } from "../scripts/utils.js";
  let score;
  let tiles = [];
  let tilesSerialized = [];
  let gameover = false;
  let colors = {};
  let colorTaken = {};
  let freePositions = [];
  const keyCodes = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
  };
  let uid = 0;

  $: {
    freePositions = [];
    tilesSerialized.forEach((tile, i) => {
      if (tile && !tile.v) {
        let c = getCoordinatesFromPosition(i, 4, 4);
        freePositions.push({ col: c.col, row: c.row });
      }
    });
  }

  onMount(async () => {
    initColors();
    initTiles();
    await tick();
    newGame();
  });

  const initColors = () => {
    let value = 2,
      color = "";

    while (value <= 2048) {
      color = getColor();
      colors[value] = color;
      colorTaken[color] = true;
      value += value;
    }
  };

  const getColor = () => {
    let c = "";
    let l = 0;
    do {
      l = getRandomInt(30, 90);
      c = "hsl(" + getRandomInt(0, 359) + ",70%," + l + "%";
    } while (colorTaken[c]);
    return { color: c, lightness: l };
  };

  const initTiles = () => {
    tiles = [[], [], [], []].map((el, i) => {
      return [{}, {}, {}, {}].map((e, j) => {
        return {
          id: uid++
        };
      });
    });
    serialize();
  };

  const serialize = () => {
    let s = [];
    tiles.forEach((row, i) => {
      row.forEach((el, j) => {
        s.push(el);
      });
    });
    tilesSerialized = s;
  };

  const putNewTile = () => {
    if (freePositions.length > 0) {
      let newPos;
      newPos = freePositions.splice(
        getRandomInt(0, freePositions.length - 1),
        1
      )[0];
      if (newPos) {
        let newVal = getRandomInt(1, 2) * 2;
        tiles[newPos.row][newPos.col] = {
          id: uid++,
          v: newVal,
          c: colors[newVal]
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
        arr[i].c = colors[arr[i].v];
        arr.splice(i + 1, 1);
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
    let gridChanged = false;
    for (let i = 0; i < columns.length; i++) {
      let col = columns[i];

      if (down) {
        col.reverse();
      }
      joinSameValuePair(col);
      if (down) {
        col.reverse();
      }
      addEmptyTiles(col, down);

      // change view
      if (!colsEqual(tiles, col, i)) {
        gridChanged = true;
        for (var j = 0; j < col.length; j++) {
          tiles[j][i] = col[j];
        }
      }
    }
    return gridChanged;
  };

  const moveTilesHorizontally = right => {
    let rows = getRows();
    let gridChanged = false;
    for (let i = 0; i < rows.length; i++) {
      let row = rows[i];

      if (right) {
        row.reverse();
      }
      joinSameValuePair(row);
      if (right) {
        row.reverse();
      }
      addEmptyTiles(row, right);

      // change view
      if (!rowsEqual(tiles[i], row)) {
        gridChanged = true;
        tiles[i] = row;
      }
    }
    return gridChanged;
  };

  const colsEqual = (arr1, arr2, col) => {
    let same = true;
    for (let i = 0; i < arr2.length; i++) {
      if (
        !arr1[i][col] ||
        !arr2[i] ||
        !(arr1[i][col] && arr2[i] && arr1[i][col].v === arr2[i].v)
      ) {
        same = false;
        break;
      }
    }
    return same;
  };

  const rowsEqual = (arr1, arr2) => {
    let same = true;
    for (let i = 0; i < arr1.length; i++) {
      if (
        !arr1[i] ||
        !arr2[i] ||
        !(arr1[i] && arr2[i] && arr1[i].v === arr2[i].v)
      ) {
        same = false;
        break;
      }
    }
    return same;
  };

  const [send, receive] = crossfade({
    duration: d => 500,

    fallback(node, params) {
      const style = getComputedStyle(node);
      const transform = style.transform === "none" ? "" : style.transform;
      console.log(node);
      return {
        duration: 600,
        easing: quintOut,
        css: t => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
      };
    }
  });

  const handleKeypress = async e => {
    if (keyCodes[e.keyCode]) {
      let down = false,
        right = false,
        gridChanged = false;
      switch (keyCodes[e.keyCode]) {
        case "right":
          right = true;
        case "left":
          gridChanged = moveTilesHorizontally(right);
          break;
        case "down":
          down = true;
        case "up":
          gridChanged = moveTilesVertically(down);
          break;
        default:
          break;
      }
      if (gridChanged) {
        serialize();
        await tick();
        putNewTile();
        serialize();
        await tick();
        if (freePositions.length === 0 && !hasLegalMoves()) {
          gameover = true;
        }
      }
    }
  };

  const hasLegalMoves = () => {
    let hasMoves = false;
    for (let i = 0; i < tiles.length; i++) {
      for (let j = 0; j < tiles[i].length; j++) {
        if (
          (tiles[i][j] &&
            tiles[i][j].v &&
            tiles[i][j + 1] &&
            tiles[i][j + 1].v &&
            tiles[i][j].v === tiles[i][j + 1].v) ||
          (tiles[i][j] &&
            tiles[i][j].v &&
            tiles[i + 1] &&
            tiles[i + 1][j] &&
            tiles[i + 1][j].v &&
            tiles[i][j].v === tiles[i + 1][j].v)
        ) {
          hasMoves = true;
          break;
        }
      }
    }
    return hasMoves;
  };

  export const newGame = () => {
    score = 0;
    gameover=false;
    initTiles();
    putNewTile();
    putNewTile();
    serialize();
  };
</script>

<style>
  :root {
    --grid-template-desktop: 107px 107px 107px 107px;
    --grid-template-mobile: 60px 60px 60px 60px;

    --grid-gap-desktop: 15px;
    --grid-gap-mobile: 10px;

    --font-size-sn: 55px;
    --font-size-bn: 40px;
    
    --gameover-size: 503px;

  }
  #topOfGame,
  #instructions {
    display: flex;
    justify-content: center;
  }
  #gridContainer {
    display: flex;
    justify-content: center;
  }
  #grid {
    background-color: #bbada0;
    border-radius: 5px;
    display: grid;
    grid-template-columns: var(--grid-template-desktop);
    grid-template-rows: var(--grid-template-desktop);
    gap: var(--grid-gap-desktop);
    justify-content: center;
    align-items: center;
    padding: var(--grid-gap-desktop);
  }

  .tileUnderlay {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(238, 228, 218, 0.35);
    width: 100%;
    height: 100%;
    box-sizing: border-box;

    border-radius: 3px;
  }

  .tileContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    border-radius: 5px;
  }
  .tile {
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0),
      inset 0 0 0 1px rgba(255, 255, 255, 0);
    border-radius: 5px;
    font-size: var(--font-size-desktop-bn-desktop)
  }

  #gameover {
    position:absolute;
    width: var(--gameover-size);
    height: var(--gameover-size);
    left: calc(50% - var(--gameover-size)/2);
    background-color: #faf8ef;
    opacity: .8;
  }

  @media screen and (max-width: 700px) {
    #grid {
      grid-template-columns: var(--grid-template-mobile);
      grid-template-rows: var(--grid-template-mobile);
      gap: var(--grid-gap-mobile);
      padding: var(--grid-gap-mobile);
    }

    #gameover {
      --gameover-size: 290px;
    }
    .tile {
      --font-size-sn: 30px;
      --font-size-bn: 25px;
    }
  }
</style>

<svelte:window on:keyup={handleKeypress} />
<div>
  <div id="topOfGame">

    <button
      on:mouseup={e => {
        newGame(e);
      }}>
      New Game
    </button>
  </div>
  <div>
  <div id="gameover" style="display: {gameover? 'initial': 'none'}">
    GAMEOVER
  
  </div>
  <div id="gridContainer">
    <div id="grid">
      {#each tilesSerialized as tile}
        <div class="tileUnderlay">
          {#if !tile.v}
            <div>{''}</div>
          {:else}
            <div class="tileContainer">
              <label
                class="tile"
                style="font-size: {tile.v > 999 ? 'var(--font-size-gn)' : 'var(--font-size-sn)'};
                background-color:{tile.c.color}; 
                color:{tile.c.lightness < 70 ? 'rgb(255,250,250)' : 'inherit'}">
                <!-- in:receive={{ key: tile.id }} out:send={{ key: tile.id }} -->
                {tile.v}
              </label>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</div>
  <div id="instructions" />
</div>
