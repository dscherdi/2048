<script>
  import Game from "./Game.svelte";
  let score = 0;
  let highest = 0;
  let game;
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
    width: 420px;
  }
  h1 {
    text-align: center;
     font-size: calc(30px + (50 - 30) * ((100vw - 320px) / (1600 - 300)));
    padding-bottom: 10px;
    margin: 0;
  }

  #score,
  #best-score,
  #new-game {
    border: none;
    outline: none !important;
    background-color: var(--grid-bckgrnd-color);
    /* width: 150px; */
    /* height: 50px; */
     font-size: calc(12px + (18 - 12) * ((100vw - 320px) / (1600 - 300)));
    padding: 14px;
    border-radius: 4px;
    color: inherit;
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
    text-align: center;
     font-size: calc(18px + (22 - 18) * ((100vw - 320px) / (1600 - 300)));
  }


@media screen and (max-width: 1024px) and (orientation: portrait) {
  /* font-size: calc([minimum size] + ([maximum size] - [minimum size]) * ((100vw - [minimum viewport width]) / ([maximum viewport width] - [minimum viewport width]))); */
  h1 {
    padding-bottom: 10px;
  }
  header {
    display: flex;
    flex-direction: column;
    width: auto;
    max-width: 420px;
    max-height: 420px;
    min-width: 320px;
    min-height: 200px;
  }

  p{
    margin: 7px 0 7px 0;
  }
}

@media screen and (max-width: 1440px) and (orientation: landscape) {
  /* font-size: calc([minimum size] + ([maximum size] - [minimum size]) * ((100vw - [minimum viewport width]) / ([maximum viewport width] - [minimum viewport width]))); */
  #container {
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  h1 {
    padding-bottom: 10px;
  }
  header {
    display: flex;
    flex-direction: column;
    width: 300px;
    max-width: 420px;
    max-height: 420px;
    min-width: 320px;
    min-height: 200px;
    margin: 0;
    margin-right: 20px;
  }
}
@media screen and (max-height: 420px) and (orientation: landscape) {
  /* font-size: calc([minimum size] + ([maximum size] - [minimum size]) * ((100vw - [minimum viewport width]) / ([maximum viewport width] - [minimum viewport width]))); */

  header {

    align-items: center;
    justify-content: center;
    width : 100vh;
    height: 100vh;
  }
}
</style>

<div id="container">
  <header>
    <h1>2048</h1>
    <div id="buttons">
      <button on:click={game.startGame()} id="new-game">New Game</button>
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
  <Game bind:this={game} bind:score bind:highest/>
</div>
