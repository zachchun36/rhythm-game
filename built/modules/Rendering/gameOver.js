import * as Init from "./init.js";
const FONT_HEIGHT = 64;
function drawGameOver() {
    Init.context.font = FONT_HEIGHT + "px Courier New";
    Init.context.fillStyle = "black";
    Init.context.fillText("GAME OVER", Init.columns[0].xPosition, Init.noteScrollWindowHeight / 2);
    // say game over
    // draw button for retry
}
export { drawGameOver };
