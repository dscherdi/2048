<script>
  import Tile from "./Tile.svelte";
  import { onMount } from "svelte";
  import { getRandomInt } from "./Utils.svelte";
  import { slide } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { quintOut } from "svelte/easing";
	import { crossfade } from 'svelte/transition';
  let score;
  let tiles = [];
  let tilesSerialized = [];
  let freePositions = [];
  const keyCodes = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
  };
  let uid = 0;

  onMount(() => {
    newGame();
  });

  const initTiles = () => {
    tiles = [[], [], [], []].map((el, i) => {
      return [{}, {}, {}, {}].map((e, j) => {
        return {
          id: uid++
        };
      });
    });
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

  const getFreePositions = () => {
    freePositions = [];
    tiles.forEach((row, i) => {
      row.forEach((el, j) => {
        if (el && !el.v) {
          freePositions.push({ col: j, row: j });
        }
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
          v: getRandomInt(1, 2) * 2
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
const [send, receive] = crossfade({
		duration: d => Math.sqrt(d * 200),

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

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

  const handleKeypress = e => {
    if (keyCodes[e.keyCode]) {
      let down = false,
        right = false;
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
      getFreePositions();
      putNewTile();
      serialize();
    }
  };

  export const newGame = () => {
    score = 0;
    initTiles();
    getFreePositions();
    putNewTile();
    putNewTile();
    serialize();
  };
</script>

<style>
  #gridContainer {
    display: flex;
    justify-content: center;
  }
  #grid {

    background-color: #bbada0;

    border-radius: 5px;
  }
  .row {
    display: grid;
    grid-template-columns: 128px 128px 128px 128px;
    grid-template-rows: 128px ;
    grid-column-gap: 10px;
    grid-row-gap: 10px;
    justify-content: center;
    align-items: center;
    padding: 10px;
  }
  .tileUnderlay {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(238, 228, 218, 0.35);
    width: 100%;
    height: 100%;
    box-sizing: border-box;

    border-radius: 5px;
  }

  .tile {
    font-size: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: bisque;

    border-radius: 5px;
  }
</style>

<svelte:window on:keyup={handleKeypress} />
<div id="gridContainer">
  <div id="grid">
    {#each tiles as row}
      <div class="row">
    {#each row as tile, id (tile.id)}
      <div class="tileUnderlay" in:receive="{{key: tile.id}}" out:send="{{key: tile.id}}" animate:flip={{duration:500}}>
        {#if !tile.v}
          <div >{''}</div>
        {:else}
          <div class="tile">{tile.v}</div>
        {/if}
      </div>
      {/each}
</div>
    {/each}
  </div>
</div>
