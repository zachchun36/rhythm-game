import * as Init from "./init.js";
function drawGameOver() {
    const FONT_HEIGHT = Init.canvas.width / 8;
    Init.context.font = FONT_HEIGHT + "px Courier New";
    Init.context.fillStyle = "black";
    Init.context.fillText("GAME OVER", Init.columns[0].xPosition, Init.noteScrollWindowHeight / 2);
    // say game over
    // draw button for retry
}
export { drawGameOver };
