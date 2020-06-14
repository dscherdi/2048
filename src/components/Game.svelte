<script>
import Grid from "./Grid.svelte";
import Tiles from "./Tiles.svelte";
export let score;
export let highest;


let handleKeypress = (e) => {

}

</script>

<style>

#game {
  display: grid;
  margin:auto;
  margin-top: 25px;
  width: 550px;
  height: 550px;
}


</style>

<svelte:window on:keyup={handleKeypress} />
<div id="game">

<Grid/>
<Tiles/>

</div>