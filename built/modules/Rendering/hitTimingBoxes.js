import * as GameState from "../gameState.js";
import * as Init from "./init.js";
function drawHitTimingBoxes() {
    for (let i = 0; i < Init.columns.length; i++) {
        // hit timing boxes
        let gradientColor = GameState.columns[i].keyDown ? "yellow" : "black";
        drawGradientTimingBoxes(i, Init.columns[i].color + " 1)", gradientColor);
    }
}
function drawGradientTimingBoxes(timingBoxIndex, gradientColor1, gradientColor2) {
    // gradient dimensions is twice as big as the rectangle we draw since we dont wnat a full gradient to black / blue, we just want some partial shading
    let grd = Init.context.createLinearGradient(0, Init.noteScrollWindowHeight, 0, (2.0 / 3.0) * Init.canvas.height + 2 * (Init.columnWidth - 1));
    grd.addColorStop(0, gradientColor1);
    grd.addColorStop(1, gradientColor2);
    Init.context.fillStyle = grd;
    // draw timing box
    Init.context.fillRect(Init.columns[timingBoxIndex].xPosition, Init.noteScrollWindowHeight, Init.columnWidth - 1, Init.columnWidth - 1);
}
export { drawHitTimingBoxes };
