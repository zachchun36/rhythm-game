import * as Init from "./init.js";
import * as GameState from "../gameState.js";
const PROGRESS_BAR_WIDTH = 3;
function drawProgressBar(xPosition, progress, color) {
    let grd = Init.context.createLinearGradient(xPosition, 0, xPosition + PROGRESS_BAR_WIDTH, Init.noteScrollWindowHeightPlusTimingBoxes);
    grd.addColorStop(0, "rgba(256, 256, 256, .3)");
    grd.addColorStop(1, "rgba(256, 256, 256, 1)");
    Init.context.fillStyle = grd;
    Init.context.fillRect(xPosition, 0, PROGRESS_BAR_WIDTH, Init.noteScrollWindowHeightPlusTimingBoxes);
    Init.context.fillStyle = color;
    Init.context.fillRect(xPosition, Init.noteScrollWindowHeightPlusTimingBoxes - progress, PROGRESS_BAR_WIDTH, progress);
}
function drawSongProgressBar() {
    let completionProgress = Init.noteScrollWindowHeightPlusTimingBoxes * GameState.song.currentTime / GameState.song.duration;
    drawProgressBar(Init.columns[0].xPosition - PROGRESS_BAR_WIDTH, completionProgress, "#42a4f5");
}
function drawBeetJuiceBar() {
    let endColumnsXPosition = Init.columns.length * Init.columnWidth + Init.columns[0].xPosition - 1;
    let color;
    if (GameState.beetJuice >= GameState.SMOOTHIE_TIME_THRESHOlD && !GameState.smoothieTime) {
        color = "#ea3788";
    }
    else {
        color = "#9a294c";
    }
    let completionProgress = Init.noteScrollWindowHeightPlusTimingBoxes * GameState.beetJuice / 100.0;
    drawProgressBar(endColumnsXPosition, completionProgress, color);
    let smoothieTimeThresholdYPosition = Init.noteScrollWindowHeightPlusTimingBoxes - (Init.noteScrollWindowHeightPlusTimingBoxes * GameState.SMOOTHIE_TIME_THRESHOlD / 100.0);
    Init.context.fillStyle = "white";
    Init.context.fillRect(endColumnsXPosition, smoothieTimeThresholdYPosition, PROGRESS_BAR_WIDTH, 1);
}
export { PROGRESS_BAR_WIDTH, drawBeetJuiceBar, drawSongProgressBar };
