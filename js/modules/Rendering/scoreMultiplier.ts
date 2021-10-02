import * as Init from "./init.js.js"
import * as GameState from "../gameState.js.js";
import * as ProgressBar from "./progressBars.js.js";

const FONT_HEIGHT = 32;

function drawScoreMultiplier() {
    let firstColumnXPosition = Init.columns[0].xPosition;
    let multiplierXPosition = firstColumnXPosition - ProgressBar.PROGRESS_BAR_WIDTH - FONT_HEIGHT - 10;
    
    Init.context.font = FONT_HEIGHT + "px Courier New";

    switch (GameState.getScoreMultiplier()) {
        case 1:
            Init.context.fillStyle = "white";
            break;
        case 2:
            Init.context.fillStyle = "orange";
            break;
        case 3:
            Init.context.fillStyle = "yellow";
            break;            
        case 4:
            Init.context.fillStyle = "green";
            break;
        case 5:
            Init.context.fillStyle = "cyan";
            break;
        case 8:
            Init.context.fillStyle = "#ea3788";         
    }
    Init.context.fillText(GameState.getScoreMultiplier().toString() + "X", multiplierXPosition, Init.noteScrollWindowHeight - FONT_HEIGHT);
}

export {
    drawScoreMultiplier
}