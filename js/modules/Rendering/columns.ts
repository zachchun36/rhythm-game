import * as GameState from "../gameState.js.js";
import * as Init from "./init.js.js";

const columnFadeoutProgress = [0, 0, 0, 0, 0, 0, 0];

function drawColumnsAndGradients() {
    for (let i = 0; i < Init.columns.length; i++) {
        Init.context.fillStyle = "black";
        Init.context.fillRect(
            Init.columns[i].xPosition,
            0,
            Init.columnWidth - 1,
            Init.noteScrollWindowHeight
        );

        // red timing bar line
        Init.context.fillStyle = "rgba(128, 0, 0, 1)";
        Init.context.fillRect(
            Init.columns[i].xPosition,
            Init.noteScrollWindowHeight - Init.columnWidth / 25,
            Init.columnWidth - 1,
            Init.columnWidth / 25
        );
        // draw full gradient timing boxes
        // grdOpacity = speed of gradient transparency
        let grdOpacity = 1 - columnFadeoutProgress[i] * 0.05;
        let gradientColor =
            columnFadeoutProgress[i] < Init.columnWidth / 2 ?
            Init.columns[i].color + grdOpacity :
            "rgba(0, 0, 0, " + grdOpacity;
        if (GameState.columns[i].keyDown) {
            columnFadeoutProgress[i] = 0;
        }
        drawGradientForNoteScrollWindowKeyHold(
            i,
            "rgba(0, 0, 0, " + grdOpacity,
            gradientColor
        );
        // speed
        if (columnFadeoutProgress[i] < Init.columnWidth / 2) {
            columnFadeoutProgress[i]++;
        }
    }
}

function drawGradientForNoteScrollWindowKeyHold(
    timingBoxIndex: number,
    gradientColor1: string,
    gradientColor2: string
) {
    // partial shading
    let grd = Init.context.createLinearGradient(
        0,
        0,
        0,
        Init.canvas.height + 2 * (Init.columnWidth - 1)
    );
    grd.addColorStop(0, gradientColor1);
    grd.addColorStop(1, gradientColor2);
    Init.context.fillStyle = grd;
    // width of full gradient effect
    Init.context.fillRect(
        Init.columns[timingBoxIndex].xPosition +
        0.5 * columnFadeoutProgress[timingBoxIndex],
        0,
        Init.columnWidth - 1 * columnFadeoutProgress[timingBoxIndex] - 1,
        Init.noteScrollWindowHeight
    );
}

export {
    drawColumnsAndGradients,
    drawGradientForNoteScrollWindowKeyHold
}