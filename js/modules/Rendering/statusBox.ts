import * as Init from "./init.js";
import * as ProgressBar from "./progressBars.js";

function drawStatusBox() {
    let grd = Init.context.createLinearGradient(
        Init.columns[0].xPosition - ProgressBar.PROGRESS_BAR_WIDTH,
        Init.noteScrollWindowHeightPlusTimingBoxes,
        Init.columns[0].xPosition - ProgressBar.PROGRESS_BAR_WIDTH,
        Init.canvas.height
    );
    grd.addColorStop(0, "rgba(100, 100, 100, 0.5)");
    grd.addColorStop(1, "rgba(0, 0, 0, 1");
    Init.context.fillStyle = grd;
    Init.context.fillRect(
        Init.columns[0].xPosition - ProgressBar.PROGRESS_BAR_WIDTH,
        Init.noteScrollWindowHeightPlusTimingBoxes - 1,
        Init.columns.length * Init.columnWidth - 1 + ProgressBar.PROGRESS_BAR_WIDTH * 2,
        Init.canvas.height - (Init.noteScrollWindowHeightPlusTimingBoxes - 1),
    )
}

export {
    drawStatusBox
}