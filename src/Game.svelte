<script>
  import Grid from "./Grid.svelte";
  import { onMount } from "svelte";
  import {
    getRandomInt,
    getPositionFromCoordinates,
    getCoordinatesFromPosition
  } from "./Utils.svelte";

  let grid = Grid;
</script>

<style>
  #topOfGame,
  #instructions {
    display: flex;
    justify-content: center;
  }
</style>

<div>

  <div id="topOfGame">

    <button on:mouseup={(e) =>{  grid.newGame(e); }}>New Game</button>
  </div>
  <svelte:component this={Grid} bind:this={grid} />
  <div id="instructions" />
</div>
