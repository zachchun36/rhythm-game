import * as Init from "./init.js"
import * as GameState from "../gameState.js";

const MAX_FLAIR_GLOW_OPACITY = 0.5;
const FLAIR_FADE_RATE = 1.0 / 50.0;

let flairOpacity = 0;
let recentlyInSmoothieTime = true;

function drawYellowGlow(opacity: number) {
    let grd = Init.context.createLinearGradient(
        Init.columns[0].xPosition,
        -200, // arbitrary gradient
        Init.columns[0].xPosition,
        1.3 * Init.noteScrollWindowHeight
    );
    grd.addColorStop(0, "rgba(0, 0, 0, 0)");
    grd.addColorStop(1, "rgba(214, 185, 11, " + opacity);
    Init.context.fillStyle = grd;
    Init.context.fillRect(
        Init.columns[0].xPosition,
        0,
        Init.columnWidth * Init.columns.length - 1,
        Init.noteScrollWindowHeight
    );
}

function drawFlairEffects() {
    if (!GameState.smoothieTime) {
        flairOpacity = MAX_FLAIR_GLOW_OPACITY;
    }
}

function drawFlairGlowFade() {
    if (flairOpacity >= 0) {
        drawYellowGlow(flairOpacity);
        flairOpacity -= MAX_FLAIR_GLOW_OPACITY * FLAIR_FADE_RATE;
    }
}

function drawSmoothieTimeGlow() {
    if (GameState.smoothieTime) {
        drawYellowGlow(MAX_FLAIR_GLOW_OPACITY);
        recentlyInSmoothieTime = true;
    }
    if (recentlyInSmoothieTime) {
        recentlyInSmoothieTime = false;
        flairOpacity = MAX_FLAIR_GLOW_OPACITY;
    }
}

export {
    drawFlairEffects,
    drawFlairGlowFade,
    drawSmoothieTimeGlow
}
