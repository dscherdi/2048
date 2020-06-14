<script>
import Game from "./Game.svelte";
    $: currentScore = 0;
  $: bestScore = 0;
</script>

<style>

#container {
  height:100vh;
  width:100vw;
  display:flex;
  flex-direction: column;
}
header, footer {
  margin:auto;
}
h1{
  text-align: center;
  font-size: 50px;
}
</style>

<div id="container">
  <header>
  <h1>2048</h1>
    <button score={currentScore} best={bestScore}>Score</button>
    <button>Best</button>

  </header>
  <Game />
  <footer>Created by Xherdi Lika</footer>
</div>
