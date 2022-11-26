import * as Init from "./init.js";

let buttonX: number;
let buttonY: number;
let buttonWidth: number;
let buttonHeight: number;

function drawGameOver() {
    const GAME_OVER_FONT_HEIGHT: number = Init.canvas.width / 8;
    const BUTTON_WIDTH: number = Init.canvas.width / 3;
    const BUTTON_HEIGHT: number = GAME_OVER_FONT_HEIGHT * 1.5;

    Init.context.font = GAME_OVER_FONT_HEIGHT + "px Courier New";
    Init.context.fillStyle = "black";
    Init.context.fillText("GAME OVER", Init.columns[0].xPosition, Init.noteScrollWindowHeight / 2);

    // say game over
    // draw button for retry

    Init.context.beginPath();

    buttonX = BUTTON_WIDTH;
    buttonY = Init.noteScrollWindowHeight / 2 + 2 * GAME_OVER_FONT_HEIGHT;
    buttonWidth = BUTTON_WIDTH;
    buttonHeight = BUTTON_HEIGHT;

    Init.context.rect(buttonX, buttonY, BUTTON_WIDTH, BUTTON_HEIGHT);
    Init.context.stroke();
    Init.context.font = GAME_OVER_FONT_HEIGHT * .75 + "px Courier New";
    Init.context.fillText("RETRY", BUTTON_WIDTH, Init.noteScrollWindowHeight / 2 + 2 * GAME_OVER_FONT_HEIGHT + BUTTON_HEIGHT / 2);
}

export {
    drawGameOver,
    buttonX,
    buttonY,
    buttonWidth,
    buttonHeight
}