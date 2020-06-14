<script>
import Grid from "./Grid.svelte";
import Tiles from "./Tiles.svelte";
</script>

<style>

#game {
  display: grid;
  margin:auto;
  width: 550px;
  height: 550px;
}


</style>

<svelte:window on:keyup={handleKeypress} />
<div id="game">

<Grid/>
<Tiles/>

</div>