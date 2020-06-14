<script>
  import Game from "./Game.svelte";
  $: currentScore = 0;
  $: bestScore = 0;
</script>

<style>
  :root {
    width: 100%;
    height: 100%;
  }
  #container{
    background-color: #faf8ef;
    color: #776e65;
    font-family: "Clear Sans", "Helvetica Neue", Arial, sans-serif;
    display: flex;
    justify-content: center;
	flex-direction: column;
    width: 100%;
    height: 100%;
  }
  header, footer {
	  display:flex;
	  justify-content:center;
  }
</style>

<div id="container">
  <header>
    2048
    <button score={currentScore} best={bestScore}>Score</button>
    <button>Best</button>

  </header>

  <Game />

  <footer>Created by Xherdi Lika</footer>
</div>
