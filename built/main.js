import * as Controller from "./modules/controller.js";
import * as GameState from "./modules/gameState.js";
import * as Render from "./modules/Rendering/init.js";
let playButton = document.querySelector("#play");
playButton.addEventListener("click", function () {
    GameState.song.play();
    GameState.song.volume = 0.1;
});
let muteButton = document.querySelector("#mute");
muteButton.addEventListener("click", function () {
    GameState.song.volume = 0.0;
});
let pauseButton = document.querySelector("#pause");
pauseButton.addEventListener("click", function () {
    GameState.song.pause();
});
Render.initialRender();
// can actually start the controller when we add a real play button
// that does mean keyboard detection stuff won't available at the menu screen which is fine
Controller.start();
