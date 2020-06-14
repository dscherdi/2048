<script>
  import Game from "./Game.svelte";
  let score = 0;
  let highest = 0;
</script>

<style>
  #container {
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
  }
  header {
    margin: auto;
    margin-bottom: 0;
    width: 550px;
  }
  h1 {
    text-align: center;
    font-size: 80px;
    padding-bottom: 50px;
  }

  #score,
  #best-score,
  #new-game {
    border: none;
    outline: none !important;
    background-color: var(--grid-bckgrnd-color);
    /* width: 150px; */
    /* height: 50px; */
    font-size: 25px;
    padding: 14px;
    border-radius: 4px;
    color: whitesmoke;
    margin: 7px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  #buttons {
    display: flex;
    justify-content: space-between;
  }
  p {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 25px;
  }
</style>

<div id="container">
  <header>
    <h1>2048</h1>
    <div id="buttons">
      <button id="new-game">New Game</button>
      <div style="display:flex; flex-direction: row;">
        <div id="score">
          <span style="color: var(--underlay-tile-color);">Score</span>
          <span>{score}</span>
        </div>
        <div id="best-score">
          <span style="color: var(--underlay-tile-color);">Best</span>
          <span>{highest}</span>
        </div>
      </div>
    </div>
    <p>Join the numbers and get to the 2048 tile!</p>
  </header>
  <Game bind:score bind:highest />
</div>
